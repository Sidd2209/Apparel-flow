import db from '../db';
import { typedAll } from '../utils/dbHelpers';

export interface IOrder {
  id?: number;
  orderNumber: string;
  productId: number;
  quantity: number;
  status: string;
  priority: string;
  totalValue: number;
  customerName: string;
  productType: string;
  assignedTo: string;
  validDate: string;
  createdAt: string;
  updatedAt: string;
}

// Example: Fetch all orders
export function getAllOrders(): IOrder[] {
  return typedAll<IOrder>(db.prepare('SELECT * FROM orders'));
}