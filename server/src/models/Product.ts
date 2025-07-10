import mongoose, { Schema, Document } from 'mongoose';

// Interface for Sample sub-document
export interface ISample extends Document {
  type: string;
  status: string;
  notes?: string;
  version: number;
  feedback?: string;
  approvedBy?: string;
  createdAt: Date;
}

// Schema for Sample sub-document
const SampleSchema: Schema = new Schema({
  type: { type: String, required: true },
  status: { type: String, required: true, enum: ['REQUESTED', 'IN_PROGRESS', 'READY_REVIEW', 'REVISION_NEEDED', 'APPROVED'] },
  notes: { type: String },
  version: { type: Number, default: 1 },
  feedback: { type: String },
  approvedBy: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Interface for DesignFile sub-document
export interface IDesignFile extends Document {
  fileName: string;
  fileType?: string;
  url?: string;
  version: number;
  isLatest: boolean;
  uploadedBy?: string;
  uploadedAt: Date;
}

// Schema for DesignFile sub-document
const DesignFileSchema: Schema = new Schema({
  fileName: { type: String, required: true },
  fileType: { type: String },
  url: { type: String },
  version: { type: Number, default: 1 },
  isLatest: { type: Boolean, default: false },
  uploadedBy: { type: String },
  uploadedAt: { type: Date, default: Date.now },
});

// Main Product Interface
export interface IProduct extends Document {
  name: string;
  sku?: string;
  category?: string;
  season?: string;
  designer?: string;
  status: string;
  developmentStage: string;
  samples: ISample[];
  designFiles: IDesignFile[];
  actualHours: number;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
}

// Main Product Schema
const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  sku: { type: String, unique: true, sparse: true },
  category: { type: String },
  season: { type: String },
  designer: { type: String },
  status: { type: String, required: true, enum: ['CONCEPT', 'DESIGN', 'SAMPLING', 'APPROVED', 'PRODUCTION_READY', 'DISCONTINUED'] },
  developmentStage: { type: String, required: true, enum: ['IDEATION', 'INITIAL_DESIGN', 'TECH_PACK', 'PROTO_SAMPLE', 'FIT_SAMPLE', 'FINAL_APPROVAL'] },
  samples: [SampleSchema],
  designFiles: [DesignFileSchema],
  actualHours: { type: Number, default: 0 },
  priority: { type: String, required: true, enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] },
}, { timestamps: true }); // timestamps will add createdAt and updatedAt fields automatically

export default mongoose.model<IProduct>('Product', ProductSchema);