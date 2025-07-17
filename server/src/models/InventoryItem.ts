import db from '../db';
import { typedAll } from '../utils/dbHelpers';

export interface IInventoryItem {
  id?: number;
  name: string;
  category: 'RAW_MATERIALS' | 'WIP' | 'FINISHED_GOODS';
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  unitCost: number;
  location: string;
  supplier?: string;
  deleted: boolean;
  totalValue: number;
  lastUpdated: string;
}

// Example: Fetch all inventory items
export function getAllInventoryItems(): IInventoryItem[] {
  return typedAll<IInventoryItem>(db.prepare('SELECT * FROM inventory_items WHERE deleted = 0'));
}
