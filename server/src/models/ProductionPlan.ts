import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProductionPlan extends Document {
  productName: string;
  quantity: number;
  startDate: string;
  endDate: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'CANCELLED';
  progress: number;
  assignedWorkers: number;
  estimatedHours: number;
  actualHours: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

const ProductionPlanSchema: Schema = new Schema({
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  startDate: { type: String },
  endDate: { type: String },
  status: { type: String, required: true, enum: ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'DELAYED', 'CANCELLED'] },
  progress: { type: Number, default: 0 },
  assignedWorkers: { type: Number, required: true },
  estimatedHours: { type: Number, required: true },
  actualHours: { type: Number, default: 0 },
  priority: { type: String, required: true, enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Explicitly define the 'id' virtual
ProductionPlanSchema.virtual('id').get(function(this: { _id: Types.ObjectId }) {
  return this._id.toHexString();
});

export const ProductionPlan = mongoose.model<IProductionPlan>('ProductionPlan', ProductionPlanSchema);
