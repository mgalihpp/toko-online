import appConfig from "./appConfig";

const allowedOrigins = [
  appConfig.CLIENT_ORIGIN,
  appConfig.SERVER_ORIGIN,
  process.env.NEXTAUTH_URL,
  process.env.FRONTEND_URL,
].filter(Boolean); // Remove undefined values

// CORS configuration with origin validation
export const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    if (
      process.env.NODE_ENV === "development" &&
      origin.startsWith("http://localhost:")
    ) {
      return callback(null, true);
    }

    // Reject other origins
    const msg =
      "The CORS policy for this site does not allow access from the specified Origin.";
    return callback(new Error(msg), false);
  },

  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-idempotency-key"],
  credentials: true, // Allow cookies and authorization headers
};
