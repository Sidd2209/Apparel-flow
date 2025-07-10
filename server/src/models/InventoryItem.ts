import { Schema, model, Document } from 'mongoose';

// This interface defines the properties of an inventory item document in MongoDB
export interface IInventoryItem extends Document {
  name: string;
  category: 'RAW_MATERIALS' | 'WIP' | 'FINISHED_GOODS';
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  unitCost: number;
  location: string;
  supplier?: string;
  totalValue: number;
  lastUpdated: string;
}

const InventoryItemSchema = new Schema<IInventoryItem>(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['RAW_MATERIALS', 'WIP', 'FINISHED_GOODS'],
    },
    currentStock: { type: Number, required: true },
    minStock: { type: Number, required: true },
    maxStock: { type: Number, required: true },
    unit: { type: String, required: true },
    unitCost: { type: Number, required: true },
    location: { type: String, required: true },
    supplier: { type: String },
    // These fields are calculated by the resolver, but stored in the DB
    totalValue: { type: Number, required: true },
    lastUpdated: { type: String, required: true },
  },
  {
    // Use a virtual `id` field that maps to the `_id` field from MongoDB
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create and export the Mongoose model
const InventoryItem = model<IInventoryItem>('InventoryItem', InventoryItemSchema);

export default InventoryItem;
