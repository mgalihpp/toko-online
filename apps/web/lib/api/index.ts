import { addressApi } from "./address.api";
import { categoryApi } from "./category.api";
import { customerApi } from "./customer.api";
import { dashboardApi } from "./dashboard.api";
import { notificationApi } from "./notification.api";
import { orderApi } from "./order.api";
import { paymentApi } from "./payment.api";
import { productApi } from "./product.api";

export const api = {
  product: productApi,
  category: categoryApi,
  order: orderApi,
  address: addressApi,
  payment: paymentApi,
  customer: customerApi,
  notification: notificationApi,
  dashboard: dashboardApi,
};
