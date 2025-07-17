import db from '../db';

export interface IInventoryReorder {
  id?: number;
  itemId: number;
  quantity: number;
  supplier?: string;
  status: 'REQUESTED' | 'ORDERED' | 'RECEIVED' | 'CANCELLED';
  note?: string;
  createdAt: string;
  user?: string;
}

// Example: Fetch reorders for an item
export function getInventoryReorders(itemId: number): IInventoryReorder[] {
  return db.prepare('SELECT * FROM inventory_reorders WHERE itemId = ? ORDER BY createdAt DESC').all(itemId) as IInventoryReorder[];
} 