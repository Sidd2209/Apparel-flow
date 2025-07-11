import mongoose, { Schema, Document } from 'mongoose';

export interface IResource extends Document {
  name: string;
  type: 'MACHINE' | 'WORKER' | 'MATERIAL';
  capacity: number;
  allocated: number;
  available: number;
  efficiency: number;
}

const ResourceSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['MACHINE', 'WORKER', 'MATERIAL'] },
  capacity: { type: Number, required: true },
  allocated: { type: Number, default: 0 },
  available: { type: Number, default: function(this: IResource) { return this.capacity; } },
  efficiency: { type: Number, required: true },
}, { timestamps: true });

ResourceSchema.pre<IResource>('save', function(next) {
  this.available = this.capacity - this.allocated;
  next();
});

export const Resource = mongoose.model<IResource>('Resource', ResourceSchema);
