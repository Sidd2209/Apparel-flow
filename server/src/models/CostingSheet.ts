import { Schema, model, Document } from 'mongoose';

// Sub-schema for MaterialCost
const MaterialCostSchema = new Schema({
  name: { type: String, required: true },
  supplier: { type: String },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  unitCost: { type: Number, required: true },
  currency: { type: String, required: true, enum: ['USD', 'EUR', 'GBP', 'INR', 'CNY'] },
  total: { type: Number },
},{ _id: true });

// Sub-schema for LaborCost
const LaborCostSchema = new Schema({
  operation: { type: String, required: true },
  timeMinutes: { type: Number, required: true },
  ratePerHour: { type: Number, required: true },
  currency: { type: String, required: true, enum: ['USD', 'EUR', 'GBP', 'INR', 'CNY'] },
  total: { type: Number },
}, { _id: true });

// Sub-schema for OverheadCost
const OverheadCostSchema = new Schema({
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, enum: ['USD', 'EUR', 'GBP', 'INR', 'CNY'] },
  type: { type: String, required: true, enum: ['FIXED', 'PERCENTAGE'] },
},{ _id: true });

// Sub-schema for CostBreakdown
const CostBreakdownSchema = new Schema({
  materials: [MaterialCostSchema],
  labor: [LaborCostSchema],
  overheads: [OverheadCostSchema],
},{ _id: true });

// Sub-schema for TaxConfiguration
const TaxConfigurationSchema = new Schema({
  vatRate: { type: Number, required: true },
  customsDuty: { type: Number, required: true },
  otherTaxes: { type: Number, required: true },
},{ _id: true });

// Main schema for CostingSheet
const CostingSheetSchema = new Schema({
  name: { type: String, required: true, default: 'Untitled Costing Sheet' },
  costBreakdown: { type: CostBreakdownSchema, required: true },
  taxConfig: { type: TaxConfigurationSchema, required: true },
  profitMargin: { type: Number, required: true },
  selectedCurrency: { type: String, required: true, enum: ['USD', 'EUR', 'GBP', 'INR', 'CNY'] },
}, { timestamps: true });

export interface IMaterialCost extends Document {
  name: string;
  supplier?: string;
  quantity: number;
  unit: string;
  unitCost: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CNY';
  total?: number;
}

export interface ILaborCost extends Document {
  operation: string;
  timeMinutes: number;
  ratePerHour: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CNY';
  total?: number;
}

export interface IOverheadCost extends Document {
  category: string;
  amount: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CNY';
  type: 'FIXED' | 'PERCENTAGE';
}

export interface ICostBreakdown extends Document {
  materials: IMaterialCost[];
  labor: ILaborCost[];
  overheads: IOverheadCost[];
}

export interface ITaxConfiguration extends Document {
  vatRate: number;
  customsDuty: number;
  otherTaxes: number;
}

export interface ICostingSheet extends Document {
  name: string;
  costBreakdown: ICostBreakdown;
  taxConfig: ITaxConfiguration;
  profitMargin: number;
  selectedCurrency: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CNY';
}

export const CostingSheet = model<ICostingSheet>('CostingSheet', CostingSheetSchema);
