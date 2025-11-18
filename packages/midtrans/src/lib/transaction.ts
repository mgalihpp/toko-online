import type ApiConfig from "./apiConfig";
import type HttpClient from "./httpClient";

interface NotificationObject {
  transaction_id: string;
  [key: string]: unknown;
}

interface TransactionSuccessReponse {
  status_code: string;
  status_message: string;
  transaction_id: string;
  masked_card: string;
  order_id: string;
  payment_type: string;
  transaction_time: string;
  transaction_status:
    | "settlement"
    | "pending"
    | "expire"
    | "capture"
    | "deny"
    | "authorize"
    | "cancel";
  fraud_status: string;
  approval_code: string;
  signature_key: string;
  bank: string;
  gross_amount: string;
  channel_response_code: string;
  channel_response_message: string;
  card_type: string;
  payment_option_type: string;
  shopeepay_reference_number: string;
  reference_id: string;
}

// interface TransactionErrorReponse {
//   status_code: string;
//   status_message: string;
// }

type err = {
  message: string;
};

/**
 * These are wrapper/implementation of API methods described on:
 * https://api-docs.midtrans.com/#midtrans-api
 * @return {Promise} - Promise that contains JSON API response decoded as Object
 */
class Transaction {
  parent: { apiConfig: ApiConfig; httpClient: HttpClient };

  constructor(parentObj: { apiConfig: ApiConfig; httpClient: HttpClient }) {
    this.parent = parentObj;
  }

  status(transactionId = ""): Promise<TransactionSuccessReponse> {
    const apiUrl = `${this.parent.apiConfig.getCoreApiBaseUrl()}/v2/${transactionId}/status`;
    return this.parent.httpClient.request(
      "get",
      this.parent.apiConfig.get().serverKey!,
      apiUrl,
      {},
    );
  }

  statusb2b(transactionId = ""): Promise<unknown> {
    const apiUrl = `${this.parent.apiConfig.getCoreApiBaseUrl()}/v2/${transactionId}/status/b2b`;
    return this.parent.httpClient.request(
      "get",
      this.parent.apiConfig.get().serverKey!,
      apiUrl,
      {},
    );
  }

  approve(transactionId = ""): Promise<unknown> {
    const apiUrl = `${this.parent.apiConfig.getCoreApiBaseUrl()}/v2/${transactionId}/approve`;
    return this.parent.httpClient.request(
      "post",
      this.parent.apiConfig.get().serverKey!,
      apiUrl,
      {},
    );
  }

  deny(transactionId = ""): Promise<unknown> {
    const apiUrl = `${this.parent.apiConfig.getCoreApiBaseUrl()}/v2/${transactionId}/deny`;
    return this.parent.httpClient.request(
      "post",
      this.parent.apiConfig.get().serverKey!,
      apiUrl,
      {},
    );
  }

  cancel(transactionId = ""): Promise<unknown> {
    const apiUrl = `${this.parent.apiConfig.getCoreApiBaseUrl()}/v2/${transactionId}/cancel`;
    return this.parent.httpClient.request(
      "post",
      this.parent.apiConfig.get().serverKey!,
      apiUrl,
      {},
    );
  }

  expire(transactionId = ""): Promise<unknown> {
    const apiUrl = `${this.parent.apiConfig.getCoreApiBaseUrl()}/v2/${transactionId}/expire`;
    return this.parent.httpClient.request(
      "post",
      this.parent.apiConfig.get().serverKey!,
      apiUrl,
      {},
    );
  }

  refund(
    transactionId = "",
    parameter: Record<string, unknown> = {},
  ): Promise<unknown> {
    const apiUrl = `${this.parent.apiConfig.getCoreApiBaseUrl()}/v2/${transactionId}/refund`;
    return this.parent.httpClient.request(
      "post",
      this.parent.apiConfig.get().serverKey!,
      apiUrl,
      parameter,
    );
  }

  refundDirect(
    transactionId = "",
    parameter: Record<string, unknown> = {},
  ): Promise<unknown> {
    const apiUrl = `${this.parent.apiConfig.getCoreApiBaseUrl()}/v2/${transactionId}/refund/online/direct`;
    return this.parent.httpClient.request(
      "post",
      this.parent.apiConfig.get().serverKey!,
      apiUrl,
      parameter,
    );
  }

  notification(notificationObj: NotificationObject | string): Promise<unknown> {
    if (
      typeof notificationObj === "string" ||
      notificationObj instanceof String
    ) {
      try {
        notificationObj = JSON.parse(notificationObj as string) as string;
      } catch (err) {
        return Promise.reject(
          new MidtransNotificationError(
            `Fail to parse 'notification' string as JSON. Use JSON string or Object as 'notification'. Message: ${(err as err).message}`,
          ),
        );
      }
    }

    const transactionId = (notificationObj as NotificationObject)
      .transaction_id;
    return this.status(transactionId)
      .then((res) => res)
      .catch((err) => Promise.reject(err));
  }
}

class MidtransNotificationError extends Error {}

export default Transaction;
