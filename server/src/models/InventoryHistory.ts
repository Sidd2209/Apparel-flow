import { Schema, model, Document } from 'mongoose';

export interface IInventoryHistory extends Document {
  itemId: string; // Reference to InventoryItem
  action: 'CREATE' | 'EDIT' | 'DELETE' | 'REORDER' | 'ADJUST';
  quantityChange: number; // Positive for add, negative for remove
  previousStock: number;
  newStock: number;
  note?: string;
  createdAt: Date;
  user?: string; // Optionally track who made the change
}

const InventoryHistorySchema = new Schema<IInventoryHistory>({
  itemId: { type: String, required: true },
  action: { type: String, required: true, enum: ['CREATE', 'EDIT', 'DELETE', 'REORDER', 'ADJUST'] },
  quantityChange: { type: Number, required: true },
  previousStock: { type: Number, required: true },
  newStock: { type: Number, required: true },
  note: { type: String },
  createdAt: { type: Date, default: Date.now },
  user: { type: String },
});

const InventoryHistory = model<IInventoryHistory>('InventoryHistory', InventoryHistorySchema);

export default InventoryHistory; 