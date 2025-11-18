import { getEnv } from "@/utils/getEnv";

interface AppConfig {
  NODE_ENV: string;
  PORT: string;
  BASE_API_PATH: string;
  SERVER_ORIGIN: string;
  CLIENT_ORIGIN: string;

  MIDTRANS_SANDBOX_SERVER_KEY: string;
  MIDTRANS_SANDBOX_CLIENT_KEY: string;
  MIDTRANS_PRODUCTION_SERVER_KEY: string;
  MIDTRANS_PRODUCTION_CLIENT_KEY: string;
}

/**
 * Returns an object containing the application's configuration.
 *
 * @returns {AppConfig} An object containing the application's configuration.
 */
const config = (): AppConfig => ({
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: getEnv("PORT", "5000"),
  BASE_API_PATH: getEnv("BASE_API_PATH", "/api"),

  SERVER_ORIGIN: getEnv(
    "SERVER_ORIGIN",
    `http://localhost:${getEnv("PORT", "5000")}`,
  ),
  CLIENT_ORIGIN: getEnv("CLIENT_ORIGIN", "http://localhost:3000"),

  // Midtrans keys
  MIDTRANS_SANDBOX_SERVER_KEY: getEnv("MIDTRANS_SANDBOX_SERVER_KEY"),
  MIDTRANS_SANDBOX_CLIENT_KEY: getEnv("MIDTRANS_SANDBOX_CLIENT_KEY"),
  MIDTRANS_PRODUCTION_SERVER_KEY: getEnv("MIDTRANS_PRODUCTION_SERVER_KEY"),
  MIDTRANS_PRODUCTION_CLIENT_KEY: getEnv("MIDTRANS_PRODUCTION_CLIENT_KEY"),
});

const appConfig = config();

export default appConfig;
