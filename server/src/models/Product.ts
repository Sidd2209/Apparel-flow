import db from '../db';
import { typedAll } from '../utils/dbHelpers';

export interface IProduct {
  id?: number;
  name: string;
  sku?: string;
  category?: string;
  season?: string;
  designer?: string;
  status: string;
  developmentStage: string;
  actualHours: number;
  priority: string;
  createdAt?: string;
  updatedAt?: string;
}

// Example: Fetch all products
export function getAllProducts(): IProduct[] {
  return typedAll<IProduct>(db.prepare('SELECT * FROM products'));
}