import ApiConfig from "./apiConfig";
import HttpClient, { type ParentObj } from "./httpClient";
import Transaction from "./transaction";

interface SnapOptions {
  isProduction: boolean;
  serverKey: string;
  clientKey: string;
}

interface TransactionResponse {
  token: string;
  redirect_url: string;
  [key: string]: unknown;
}

/**
 * Snap object used to do request to Midtrans Snap API
 */
class Snap implements ParentObj {
  apiConfig: ApiConfig;
  httpClient: HttpClient;
  transaction: Transaction;
  [key: string]: unknown;

  constructor(
    options: SnapOptions = {
      isProduction: false,
      serverKey: "",
      clientKey: "",
    },
  ) {
    this.apiConfig = new ApiConfig(options);
    this.httpClient = new HttpClient(this);
    this.transaction = new Transaction(this);
  }

  /**
   * Do `/transactions` API request to Snap API
   * @param {Object} parameter - object of Core API JSON body as parameter, will be converted to JSON (more params detail refer to: https://snap-docs.midtrans.com)
   * @return {Promise} - Promise contains Object from JSON decoded response
   */
  createTransaction(
    parameter: Record<string, unknown> = {},
  ): Promise<TransactionResponse> {
    const apiUrl = `${this.apiConfig.getSnapApiBaseUrl()}/transactions`;
    console.log(this.apiConfig.get().serverKey);
    return this.httpClient.request(
      "post",
      this.apiConfig.get().serverKey!,
      apiUrl,
      parameter,
    );
  }

  /**
   * Wrapper function that call `createTransaction` then:
   * @return {Promise} - Promise of String token
   */
  createTransactionToken(
    parameter: Record<string, unknown> = {},
  ): Promise<string> {
    return this.createTransaction(parameter).then((res) => res.token);
  }

  /**
   * Wrapper function that call `createTransaction` then:
   * @return {Promise} - Promise of String redirect_url
   */
  createTransactionRedirectUrl(
    parameter: Record<string, unknown> = {},
  ): Promise<string> {
    return this.createTransaction(parameter).then((res) => res.redirect_url);
  }
}

export default Snap;
