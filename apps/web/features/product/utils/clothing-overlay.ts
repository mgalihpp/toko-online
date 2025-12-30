// Define types locally since we use dynamic import
export interface NormalizedLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface PoseResults {
  poseLandmarks?: NormalizedLandmark[];
}

export interface BodyMeasurements {
  shoulderWidth: number;
  torsoHeight: number;
  centerX: number;
  centerY: number;
  angle: number;
  isVisible: boolean;
  isFacingCamera: boolean;
}

export interface MeshCorners {
  topLeft: { x: number; y: number };
  topRight: { x: number; y: number };
  bottomLeft: { x: number; y: number };
  bottomRight: { x: number; y: number };
  // Add elbow landmarks for sleeve warping
  leftElbow?: { x: number; y: number };
  rightElbow?: { x: number; y: number };
  isFacingCamera: boolean;
}

// MediaPipe Pose landmark indices
const LANDMARKS = {
  NOSE: 0,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
} as const;

/**
 * Calculate body measurements from MediaPipe pose results
 */
export function calculateBodyMeasurements(
  results: PoseResults,
  canvasWidth: number,
  canvasHeight: number,
): BodyMeasurements | null {
  const landmarks = results.poseLandmarks;

  if (!landmarks || landmarks.length < 25) {
    return null;
  }

  const nose = landmarks[LANDMARKS.NOSE];
  const leftShoulder = landmarks[LANDMARKS.LEFT_SHOULDER];
  const rightShoulder = landmarks[LANDMARKS.RIGHT_SHOULDER];
  const leftHip = landmarks[LANDMARKS.LEFT_HIP];
  const rightHip = landmarks[LANDMARKS.RIGHT_HIP];

  // Check visibility
  const minVisibility = 0.5;
  if (
    !leftShoulder ||
    !rightShoulder ||
    !leftHip ||
    !rightHip ||
    (leftShoulder.visibility ?? 0) < minVisibility ||
    (rightShoulder.visibility ?? 0) < minVisibility ||
    (leftHip.visibility ?? 0) < minVisibility ||
    (rightHip.visibility ?? 0) < minVisibility
  ) {
    return null;
  }

  // Detect if user is facing the camera by checking nose visibility
  // High nose visibility = facing camera, low = back to camera
  const isFacingCamera = (nose?.visibility ?? 0) > 0.5;

  // Convert normalized coordinates to pixel coordinates
  const lsX = leftShoulder.x * canvasWidth;
  const lsY = leftShoulder.y * canvasHeight;
  const rsX = rightShoulder.x * canvasWidth;
  const rsY = rightShoulder.y * canvasHeight;
  const lhX = leftHip.x * canvasWidth;
  const lhY = leftHip.y * canvasHeight;
  const rhX = rightHip.x * canvasWidth;
  const rhY = rightHip.y * canvasHeight;

  // Calculate shoulder width
  const shoulderWidth = Math.sqrt((lsX - rsX) ** 2 + (lsY - rsY) ** 2);

  // Calculate torso height (from mid-shoulder to mid-hip)
  const midShoulderY = (lsY + rsY) / 2;
  const midHipY = (lhY + rhY) / 2;
  const torsoHeight = Math.abs(midHipY - midShoulderY);

  // Calculate center point (middle of torso)
  const centerX = (lsX + rsX + lhX + rhX) / 4;
  const centerY = (lsY + rsY + lhY + rhY) / 4;

  // Calculate body angle based on shoulder line
  const angle = Math.atan2(lsY - rsY, lsX - rsX);

  return {
    shoulderWidth,
    torsoHeight,
    centerX,
    centerY,
    angle,
    isVisible: true,
    isFacingCamera,
  };
}

/**
 * Calculate mesh corner positions for WebGL warping
 * Extracts 4 corner points from pose landmarks with padding for clothing
 */
export function calculateMeshCorners(
  results: PoseResults,
  canvasWidth: number,
  canvasHeight: number,
): MeshCorners | null {
  const landmarks = results.poseLandmarks;

  if (!landmarks || landmarks.length < 25) {
    return null;
  }

  const nose = landmarks[LANDMARKS.NOSE];
  const leftShoulder = landmarks[LANDMARKS.LEFT_SHOULDER];
  const rightShoulder = landmarks[LANDMARKS.RIGHT_SHOULDER];
  const leftHip = landmarks[LANDMARKS.LEFT_HIP];
  const rightHip = landmarks[LANDMARKS.RIGHT_HIP];
  const leftElbow = landmarks[LANDMARKS.LEFT_ELBOW];
  const rightElbow = landmarks[LANDMARKS.RIGHT_ELBOW];

  // Check visibility
  const minVisibility = 0.5;
  if (
    !leftShoulder ||
    !rightShoulder ||
    !leftHip ||
    !rightHip ||
    (leftShoulder.visibility ?? 0) < minVisibility ||
    (rightShoulder.visibility ?? 0) < minVisibility ||
    (leftHip.visibility ?? 0) < minVisibility ||
    (rightHip.visibility ?? 0) < minVisibility
  ) {
    return null;
  }

  const isFacingCamera = (nose?.visibility ?? 0) > 0.5;

  // Convert to pixel coordinates
  const lsX = leftShoulder.x * canvasWidth;
  const lsY = leftShoulder.y * canvasHeight;
  const rsX = rightShoulder.x * canvasWidth;
  const rsY = rightShoulder.y * canvasHeight;
  const lhX = leftHip.x * canvasWidth;
  const lhY = leftHip.y * canvasHeight;
  const rhX = rightHip.x * canvasWidth;
  const rhY = rightHip.y * canvasHeight;

  // Extract elbow coordinates if visible
  let le;
  if (leftElbow && (leftElbow.visibility ?? 0) > minVisibility) {
    le = {
      x: leftElbow.x * canvasWidth,
      y: leftElbow.y * canvasHeight,
    };
  }

  let re;
  if (rightElbow && (rightElbow.visibility ?? 0) > minVisibility) {
    re = {
      x: rightElbow.x * canvasWidth,
      y: rightElbow.y * canvasHeight,
    };
  }

  // Calculate padding based on shoulder width - Increased padding for better fit
  const shoulderWidth = Math.sqrt((lsX - rsX) ** 2 + (lsY - rsY) ** 2);
  const horizontalPadding = shoulderWidth * 0.45; // Increased from 0.2 to 0.45
  const verticalPadding = shoulderWidth * 0.25; // Increased from 0.15 to 0.25

  // Calculate direction vectors for proper expansion
  // Shoulder direction (left to right)
  const shoulderDirX = (rsX - lsX) / shoulderWidth;
  const shoulderDirY = (rsY - lsY) / shoulderWidth;

  // Perpendicular direction (for vertical expansion)
  const perpX = -shoulderDirY;
  const perpY = shoulderDirX;

  // Calculate expanded corner positions
  // Top corners: shoulders expanded outward and slightly up
  const topLeft = {
    x: lsX - shoulderDirX * horizontalPadding - perpX * verticalPadding,
    y: lsY - shoulderDirY * horizontalPadding - perpY * verticalPadding,
  };
  const topRight = {
    x: rsX + shoulderDirX * horizontalPadding - perpX * verticalPadding,
    y: rsY + shoulderDirY * horizontalPadding - perpY * verticalPadding,
  };

  // Bottom corners: hips expanded outward and slightly down
  const hipWidth = Math.sqrt((lhX - rhX) ** 2 + (lhY - rhY) ** 2);
  const hipDirX = hipWidth > 0 ? (rhX - lhX) / hipWidth : shoulderDirX;
  const hipDirY = hipWidth > 0 ? (rhY - lhY) / hipWidth : shoulderDirY;

  const bottomLeft = {
    x: lhX - hipDirX * horizontalPadding + perpX * verticalPadding,
    y: lhY - hipDirY * horizontalPadding + perpY * verticalPadding,
  };
  const bottomRight = {
    x: rhX + hipDirX * horizontalPadding + perpX * verticalPadding,
    y: rhY + hipDirY * horizontalPadding + perpY * verticalPadding,
  };

  return {
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
    leftElbow: le,
    rightElbow: re,
    isFacingCamera,
  };
}

/**
 * Draw clothing overlay on canvas based on body measurements
 */
export function drawClothingOverlay(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  measurements: BodyMeasurements,
  _canvasWidth: number,
  _canvasHeight: number,
): void {
  const {
    shoulderWidth,
    torsoHeight,
    centerX,
    centerY,
    angle,
    isFacingCamera,
  } = measurements;

  // Calculate clothing dimensions with some padding
  const clothingWidth = shoulderWidth * 1.4; // Slightly wider than shoulders
  const clothingHeight = torsoHeight * 1.5; // Cover torso + a bit more

  // Position clothing to align with shoulders (move up from center)
  const offsetY = -torsoHeight * 0.1;

  ctx.save();

  // Move to center position
  ctx.translate(centerX, centerY + offsetY);

  // Apply rotation based on shoulder angle
  ctx.rotate(angle);

  // When facing camera, rotate 180 degrees to correct upside-down orientation
  if (isFacingCamera) {
    ctx.rotate(Math.PI);
  }

  // Draw the clothing image centered
  ctx.globalAlpha = 0.85; // Slight transparency for better blending
  ctx.drawImage(
    image,
    -clothingWidth / 2,
    -clothingHeight / 2,
    clothingWidth,
    clothingHeight,
  );

  ctx.restore();
}

/**
 * Draw pose landmarks for debugging
 */
export function drawPoseLandmarks(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  canvasWidth: number,
  canvasHeight: number,
): void {
  // Draw key body landmarks
  const keyPoints = [
    LANDMARKS.NOSE,
    LANDMARKS.LEFT_SHOULDER,
    LANDMARKS.RIGHT_SHOULDER,
    LANDMARKS.LEFT_HIP,
    LANDMARKS.RIGHT_HIP,
    LANDMARKS.LEFT_ELBOW,
    LANDMARKS.RIGHT_ELBOW,
  ];

  ctx.fillStyle = "#00ff00";
  ctx.strokeStyle = "#00ff00";
  ctx.lineWidth = 2;

  for (const index of keyPoints) {
    const landmark = landmarks[index];
    if (landmark && (landmark.visibility ?? 0) > 0.5) {
      const x = landmark.x * canvasWidth;
      const y = landmark.y * canvasHeight;

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  // Draw shoulder line
  const ls = landmarks[LANDMARKS.LEFT_SHOULDER];
  const rs = landmarks[LANDMARKS.RIGHT_SHOULDER];
  if (ls && rs) {
    ctx.beginPath();
    ctx.moveTo(ls.x * canvasWidth, ls.y * canvasHeight);
    ctx.lineTo(rs.x * canvasWidth, rs.y * canvasHeight);
    ctx.stroke();
  }

  // Draw hip line
  const lh = landmarks[LANDMARKS.LEFT_HIP];
  const rh = landmarks[LANDMARKS.RIGHT_HIP];
  if (lh && rh) {
    ctx.beginPath();
    ctx.moveTo(lh.x * canvasWidth, lh.y * canvasHeight);
    ctx.lineTo(rh.x * canvasWidth, rh.y * canvasHeight);
    ctx.stroke();
  }
}
