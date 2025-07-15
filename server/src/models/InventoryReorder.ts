import { Schema, model, Document } from 'mongoose';

export interface IInventoryReorder extends Document {
  itemId: string;
  quantity: number;
  supplier?: string;
  status: 'REQUESTED' | 'ORDERED' | 'RECEIVED' | 'CANCELLED';
  note?: string;
  createdAt: Date;
  user?: string;
}

const InventoryReorderSchema = new Schema<IInventoryReorder>({
  itemId: { type: String, required: true },
  quantity: { type: Number, required: true },
  supplier: { type: String },
  status: { type: String, required: true, default: 'REQUESTED', enum: ['REQUESTED', 'ORDERED', 'RECEIVED', 'CANCELLED'] },
  note: { type: String },
  createdAt: { type: Date, default: Date.now },
  user: { type: String },
});

export default model<IInventoryReorder>('InventoryReorder', InventoryReorderSchema); 