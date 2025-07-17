import db from '../db';

export interface IInventoryHistory {
  id?: number;
  itemId: number;
  action: 'CREATE' | 'EDIT' | 'DELETE' | 'REORDER' | 'ADJUST';
  quantityChange: number;
  previousStock: number;
  newStock: number;
  note?: string;
  createdAt: string;
  user?: string;
}

// Example: Fetch history for an item
export function getInventoryHistory(itemId: number): IInventoryHistory[] {
  return db.prepare('SELECT * FROM inventory_history WHERE itemId = ? ORDER BY createdAt DESC').all(itemId) as IInventoryHistory[];
} 