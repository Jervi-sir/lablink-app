import { User } from "./auth";
import { Product } from "./product";

export type OrderStatusCode = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: number;
  code: string;
  userId: number;
  user?: User;
  totalPrice: number;
  shippingAddress: string;
  wilayaId: number;
  statusId: number;
  status?: OrderStatus;
  items?: OrderProduct[];
  createdAt: string;
}

export interface OrderStatus {
  id: number;
  code: OrderStatusCode;
  isFinal: boolean;
}

export interface OrderProduct {
  id: number;
  orderId: number;
  productId: number;
  product?: Product;
  quantity: number;
  price: number;
}
