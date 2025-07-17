import db from '../db';
import { typedAll } from '../utils/dbHelpers';

export interface IProductionPlan {
  id?: number;
  productName: string;
  quantity: number;
  startDate: string;
  endDate: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'CANCELLED';
  progress: number;
  assignedWorkers: number;
  estimatedHours: number;
  actualHours: number;
}

// Example: Fetch all production plans
export function getAllProductionPlans(): IProductionPlan[] {
  return typedAll<IProductionPlan>(db.prepare('SELECT * FROM production_plans'));
}
