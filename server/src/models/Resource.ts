import db from '../db';
import { typedAll } from '../utils/dbHelpers';

export interface IResource {
  id?: number;
  name: string;
  type: 'MACHINE' | 'WORKER' | 'MATERIAL';
  capacity: number;
  allocated: number;
  available: number;
  efficiency: number;
  createdAt?: string;
  updatedAt?: string;
}

// Example: Fetch all resources
export function getAllResources(): IResource[] {
  return typedAll<IResource>(db.prepare('SELECT * FROM resources'));
}
