import mongoose, { Schema, Document } from 'mongoose';

// Order Interface
export interface IOrder extends Document {
  orderNumber: string;
  productId: mongoose.Types.ObjectId;
  quantity: number;
  status: string;
  priority: string;
  totalValue: number;
  customerName: string;
  productType: string;
  assignedTo: string;
  createdAt: Date;
  updatedAt: Date;
}

// Order Schema
const OrderSchema: Schema = new Schema({
  orderNumber: { type: String, required: true, unique: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  status: { type: String, required: true, enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] },
  priority: { type: String, required: true, enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] },
  totalValue: { type: Number, required: true },
  customerName: { type: String, required: true },
  productType: { type: String, required: true },
  assignedTo: { type: String, required: true },
}, { timestamps: true }); // timestamps will add createdAt and updatedAt fields automatically

export default mongoose.model<IOrder>('Order', OrderSchema);