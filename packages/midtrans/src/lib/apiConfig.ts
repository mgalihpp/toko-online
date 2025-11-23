import _ from "lodash";

export interface ApiConfigOptions {
  isProduction?: boolean;
  serverKey?: string;
  clientKey?: string;
}

/**
 *  Config Object that used to store isProduction, serverKey, clientKey.
 *  And also API base urls.
 */
class ApiConfig {
  isProduction: boolean;
  serverKey: string;
  clientKey: string;

  static CORE_SANDBOX_BASE_URL = "https://api.sandbox.midtrans.com";
  static CORE_PRODUCTION_BASE_URL = "https://api.midtrans.com";
  static SNAP_SANDBOX_BASE_URL = "https://app.sandbox.midtrans.com/snap/v1";
  static SNAP_PRODUCTION_BASE_URL = "https://app.midtrans.com/snap/v1";
  static IRIS_SANDBOX_BASE_URL = "https://app.sandbox.midtrans.com/iris/api/v1";
  static IRIS_PRODUCTION_BASE_URL = "https://app.midtrans.com/iris/api/v1";

  /**
   * Initiate with options
   * @param  {ApiConfigOptions} options - should have these props:
   * isProduction, serverKey, clientKey
   */
  constructor(
    options: ApiConfigOptions = {
      isProduction: false,
      serverKey: "",
      clientKey: "",
    },
  ) {
    this.isProduction = false;
    this.serverKey = "";
    this.clientKey = "";

    this.set(options);
  }

  /**
   * Return config stored
   * @return {ApiConfigOptions} object contains isProduction, serverKey, clientKey
   */
  get(): ApiConfigOptions {
    return {
      isProduction: this.isProduction,
      serverKey: this.serverKey,
      clientKey: this.clientKey,
    };
  }

  set(options: ApiConfigOptions): void {
    const currentConfig = {
      isProduction: this.isProduction,
      serverKey: this.serverKey,
      clientKey: this.clientKey,
    };
    const parsedOptions = _.pick(options, [
      "isProduction",
      "serverKey",
      "clientKey",
    ]);
    const mergedConfig = _.merge({}, currentConfig, parsedOptions);

    this.isProduction = mergedConfig.isProduction;
    this.serverKey = mergedConfig.serverKey;
    this.clientKey = mergedConfig.clientKey;
  }

  /**
   * @return {String} core api base url
   */
  getCoreApiBaseUrl(): string {
    return this.isProduction
      ? ApiConfig.CORE_PRODUCTION_BASE_URL
      : ApiConfig.CORE_SANDBOX_BASE_URL;
  }

  /**
   * @return {String} snap api base url
   */
  getSnapApiBaseUrl(): string {
    return this.isProduction
      ? ApiConfig.SNAP_PRODUCTION_BASE_URL
      : ApiConfig.SNAP_SANDBOX_BASE_URL;
  }

  /**
   * @return {String} Iris api base url
   */
  getIrisApiBaseUrl(): string {
    return this.isProduction
      ? ApiConfig.IRIS_PRODUCTION_BASE_URL
      : ApiConfig.IRIS_SANDBOX_BASE_URL;
  }
}

export default ApiConfig;
