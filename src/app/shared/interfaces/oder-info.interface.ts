import { OrderProduct } from "./order-product.interface";

export interface OrderInfo {
  orderID: string;
  user: string;
  products: OrderProduct[];
  orderSubTotal: number;
  discount?: number;
  orderTotal: number;
  orderDate: Date;
  orderCancelled: boolean;
}