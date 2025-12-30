/**
 * WebGL Clothing Renderer
 * Renders clothing texture with mesh-based warping based on pose landmarks
 */

export interface MeshPoint {
  x: number;
  y: number;
  u: number; // texture coordinate
  v: number; // texture coordinate
}

export interface ClothingMesh {
  vertices: Float32Array;
  texCoords: Float32Array;
  indices: Uint16Array;
  gridWidth: number;
  gridHeight: number;
}

// Vertex shader - transforms mesh vertices
const VERTEX_SHADER_SOURCE = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  
  uniform vec2 u_resolution;
  
  varying vec2 v_texCoord;
  
  void main() {
    // Convert from pixels to 0.0 to 1.0
    vec2 zeroToOne = a_position / u_resolution;
    
    // Convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;
    
    // Convert from 0->2 to -1->+1 (clip space)
    vec2 clipSpace = zeroToTwo - 1.0;
    
    // Flip Y axis (canvas has origin at top-left)
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    
    v_texCoord = a_texCoord;
  }
`;

// Fragment shader - samples texture with alpha blending
const FRAGMENT_SHADER_SOURCE = `
  precision mediump float;
  
  uniform sampler2D u_texture;
  uniform float u_alpha;
  
  varying vec2 v_texCoord;
  
  void main() {
    vec4 color = texture2D(u_texture, v_texCoord);
    gl_FragColor = vec4(color.rgb, color.a * u_alpha);
  }
`;

export class WebGLClothingRenderer {
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private positionBuffer: WebGLBuffer | null = null;
  private texCoordBuffer: WebGLBuffer | null = null;
  private indexBuffer: WebGLBuffer | null = null;
  private texture: WebGLTexture | null = null;
  private isInitialized = false;

  // Attribute and uniform locations
  private positionLocation: number = -1;
  private texCoordLocation: number = -1;
  private resolutionLocation: WebGLUniformLocation | null = null;
  private textureLocation: WebGLUniformLocation | null = null;
  private alphaLocation: WebGLUniformLocation | null = null;

  // Mesh configuration
  private gridWidth = 16; // Increased from 8
  private gridHeight = 20; // Increased from 8 for better vertical flexibility
  private indexCount = 0;

  /**
   * Initialize WebGL context and compile shaders
   */
  initialize(canvas: HTMLCanvasElement): boolean {
    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
    });

    if (!gl) {
      console.error("WebGL not supported");
      return false;
    }

    this.gl = gl;

    // Compile shaders
    const vertexShader = this.compileShader(
      gl.VERTEX_SHADER,
      VERTEX_SHADER_SOURCE,
    );
    const fragmentShader = this.compileShader(
      gl.FRAGMENT_SHADER,
      FRAGMENT_SHADER_SOURCE,
    );

    if (!vertexShader || !fragmentShader) {
      return false;
    }

    // Create program
    const program = gl.createProgram();
    if (!program) {
      return false;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Failed to link program:", gl.getProgramInfoLog(program));
      return false;
    }

    this.program = program;

    // Get attribute and uniform locations
    this.positionLocation = gl.getAttribLocation(program, "a_position");
    this.texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
    this.resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    this.textureLocation = gl.getUniformLocation(program, "u_texture");
    this.alphaLocation = gl.getUniformLocation(program, "u_alpha");

    // Create buffers
    this.positionBuffer = gl.createBuffer();
    this.texCoordBuffer = gl.createBuffer();
    this.indexBuffer = gl.createBuffer();

    // Create initial mesh
    this.createMesh();

    // Enable blending for transparency
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    this.isInitialized = true;
    return true;
  }

  /**
   * Compile a shader
   */
  private compileShader(type: number, source: string): WebGLShader | null {
    const gl = this.gl;
    if (!gl) return null;

    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Failed to compile shader:", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  /**
   * Create mesh indices (triangles for grid)
   */
  private createMesh(): void {
    const gl = this.gl;
    if (!gl || !this.indexBuffer) return;

    const indices: number[] = [];
    const w = this.gridWidth;
    const h = this.gridHeight;

    // Create triangle indices for grid
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const topLeft = y * (w + 1) + x;
        const topRight = topLeft + 1;
        const bottomLeft = (y + 1) * (w + 1) + x;
        const bottomRight = bottomLeft + 1;

        // Two triangles per quad
        indices.push(topLeft, bottomLeft, topRight);
        indices.push(topRight, bottomLeft, bottomRight);
      }
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW,
    );

    this.indexCount = indices.length;

    // Create default texture coordinates (not flipped)
    this.updateTexCoords(false);
  }

  /**
   * Update texture coordinates with optional vertical flip
   */
  private updateTexCoords(flipVertical: boolean): void {
    const gl = this.gl;
    if (!gl || !this.texCoordBuffer) return;

    const texCoords: number[] = [];
    const w = this.gridWidth;
    const h = this.gridHeight;

    for (let y = 0; y <= h; y++) {
      for (let x = 0; x <= w; x++) {
        if (flipVertical) {
          // Flip only V for vertical flip (upside down correction)
          texCoords.push(x / w, 1 - y / h);
        } else {
          texCoords.push(x / w, y / h);
        }
      }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(texCoords),
      gl.DYNAMIC_DRAW,
    );
  }

  /**
   * Load clothing texture from image
   */
  loadTexture(image: HTMLImageElement): void {
    const gl = this.gl;
    if (!gl) return;

    if (this.texture) {
      gl.deleteTexture(this.texture);
    }

    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    // Set texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Upload image to texture
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  }

  /**
   * Generate warped mesh vertices based on corner positions
   * Uses bilinear interpolation combined with elbow-based deformation for sleeves
   */
  generateWarpedMesh(
    topLeft: { x: number; y: number },
    topRight: { x: number; y: number },
    bottomLeft: { x: number; y: number },
    bottomRight: { x: number; y: number },
    leftElbow?: { x: number; y: number },
    rightElbow?: { x: number; y: number },
  ): Float32Array {
    const vertices: number[] = [];
    const w = this.gridWidth;
    const h = this.gridHeight;

    for (let y = 0; y <= h; y++) {
      for (let x = 0; x <= w; x++) {
        const u = x / w;
        const v = y / h;

        // 1. Basic Bilinear interpolation (The "Box")
        const top = {
          x: topLeft.x + (topRight.x - topLeft.x) * u,
          y: topLeft.y + (topRight.y - topLeft.y) * u,
        };
        const bottom = {
          x: bottomLeft.x + (bottomRight.x - bottomLeft.x) * u,
          y: bottomLeft.y + (bottomRight.y - bottomLeft.y) * u,
        };

        let px = top.x + (bottom.x - top.x) * v;
        let py = top.y + (bottom.y - top.y) * v;

        // 2. Sleeve Deformation (The "Arm Bend")
        // Only deform if we have elbow point and we are in the "sleeve zone"

        // Left Sleeve (u < 0.35) - Expanded range
        if (leftElbow && u < 0.35) {
          const expectedElbowU = 0.1; // Slightly inside from edge due to padding
          const expectedElbowV = 0.55;

          // Increased influence radius
          const uDist = Math.max(0, 1 - Math.abs(u - expectedElbowU) / 0.4);
          const vDist = Math.max(0, 1 - Math.abs(v - expectedElbowV) / 0.5);
          // Non-linear weight for stronger center pull (smoothstep-like)
          let weight = uDist * vDist;
          weight = weight * weight * (3 - 2 * weight);

          if (weight > 0.01) {
            const boxElbowTop = {
              x: topLeft.x + (topRight.x - topLeft.x) * expectedElbowU,
              y: topLeft.y + (topRight.y - topLeft.y) * expectedElbowU,
            };
            const boxElbowBottom = {
              x: bottomLeft.x + (bottomRight.x - bottomLeft.x) * expectedElbowU,
              y: bottomLeft.y + (bottomRight.y - bottomLeft.y) * expectedElbowU,
            };
            const boxElbowX =
              boxElbowTop.x +
              (boxElbowBottom.x - boxElbowTop.x) * expectedElbowV;
            const boxElbowY =
              boxElbowTop.y +
              (boxElbowBottom.y - boxElbowTop.y) * expectedElbowV;

            const dx = leftElbow.x - boxElbowX;
            const dy = leftElbow.y - boxElbowY;

            // Apply stronger offset
            px += dx * weight * 1.2;
            py += dy * weight * 1.2;
          }
        }

        // Right Sleeve (u > 0.65) - Expanded range
        if (rightElbow && u > 0.65) {
          const expectedElbowU = 0.9;
          const expectedElbowV = 0.55;

          const uDist = Math.max(0, 1 - Math.abs(u - expectedElbowU) / 0.4);
          const vDist = Math.max(0, 1 - Math.abs(v - expectedElbowV) / 0.5);
          let weight = uDist * vDist;
          weight = weight * weight * (3 - 2 * weight);

          if (weight > 0.01) {
            const boxElbowTop = {
              x: topLeft.x + (topRight.x - topLeft.x) * expectedElbowU,
              y: topLeft.y + (topRight.y - topLeft.y) * expectedElbowU,
            };
            const boxElbowBottom = {
              x: bottomLeft.x + (bottomRight.x - bottomLeft.x) * expectedElbowU,
              y: bottomLeft.y + (bottomRight.y - bottomLeft.y) * expectedElbowU,
            };
            const boxElbowX =
              boxElbowTop.x +
              (boxElbowBottom.x - boxElbowTop.x) * expectedElbowV;
            const boxElbowY =
              boxElbowTop.y +
              (boxElbowBottom.y - boxElbowTop.y) * expectedElbowV;

            const dx = rightElbow.x - boxElbowX;
            const dy = rightElbow.y - boxElbowY;

            px += dx * weight * 1.2;
            py += dy * weight * 1.2;
          }
        }

        vertices.push(px, py);
      }
    }

    return new Float32Array(vertices);
  }

  /**
   * Render the clothing mesh
   * @param flip180 - If true, flip texture 180 degrees (for facing camera)
   */
  render(
    canvasWidth: number,
    canvasHeight: number,
    topLeft: { x: number; y: number },
    topRight: { x: number; y: number },
    bottomLeft: { x: number; y: number },
    bottomRight: { x: number; y: number },
    alpha: number = 0.85,
    flip180: boolean = false,
    leftElbow?: { x: number; y: number },
    rightElbow?: { x: number; y: number },
  ): void {
    const gl = this.gl;
    if (!gl || !this.program || !this.texture || !this.isInitialized) return;

    // Update texture coordinates based on flip
    this.updateTexCoords(flip180);

    // Set viewport
    gl.viewport(0, 0, canvasWidth, canvasHeight);

    // Clear with transparent
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Use program
    gl.useProgram(this.program);

    // Generate warped vertices
    const vertices = this.generateWarpedMesh(
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
      leftElbow,
      rightElbow,
    );

    // Upload vertices
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

    // Set position attribute
    gl.enableVertexAttribArray(this.positionLocation);
    gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Set texcoord attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.enableVertexAttribArray(this.texCoordLocation);
    gl.vertexAttribPointer(this.texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    // Set uniforms
    gl.uniform2f(this.resolutionLocation, canvasWidth, canvasHeight);
    gl.uniform1f(this.alphaLocation, alpha);

    // Bind texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(this.textureLocation, 0);

    // Draw
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
  }

  /**
   * Check if WebGL is available
   */
  static isWebGLAvailable(): boolean {
    try {
      const canvas = document.createElement("canvas");
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
    } catch (e) {
      return false;
    }
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    const gl = this.gl;
    if (!gl) return;

    if (this.texture) gl.deleteTexture(this.texture);
    if (this.positionBuffer) gl.deleteBuffer(this.positionBuffer);
    if (this.texCoordBuffer) gl.deleteBuffer(this.texCoordBuffer);
    if (this.indexBuffer) gl.deleteBuffer(this.indexBuffer);
    if (this.program) gl.deleteProgram(this.program);

    this.isInitialized = false;
    this.gl = null;
  }
}
