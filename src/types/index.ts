
// Core types for the Apparel Merchandising Software
export interface User {
  id: string;
  name: string;
  email: string;
  department: Department;
  role: Role;
  avatar?: string;
}

export type Department = 'merchandising' | 'logistics' | 'procurement' | 'sampling' | 'management';

export type Role = 'admin' | 'manager' | 'coordinator' | 'associate';

export interface Order {
  id: string;
  customerName: string;
  orderNumber: string;
  productType: string;
  quantity: number;
  deadline: string;
  status: OrderStatus;
  priority: Priority;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  totalValue: number;
}

export type OrderStatus = 'pending' | 'in-progress' | 'sampling' | 'approved' | 'production' | 'shipped' | 'delivered' | 'cancelled';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  season: string;
  designer: string;
  status: ProductStatus;
  developmentStage: DevelopmentStage;
  samples: Sample[];
  designFiles: DesignFile[];
  createdAt: string;
  updatedAt: string;
}

export type ProductStatus = 'concept' | 'design' | 'sampling' | 'approved' | 'production-ready' | 'discontinued';

export type DevelopmentStage = 'ideation' | 'initial-design' | 'tech-pack' | 'proto-sample' | 'fit-sample' | 'final-approval';

export interface Sample {
  id: string;
  productId: string;
  version: number;
  status: SampleStatus;
  feedback: string;
  createdAt: string;
  approvedBy?: string;
}

export type SampleStatus = 'requested' | 'in-production' | 'ready-review' | 'approved' | 'rejected' | 'revision-needed';

export interface DesignFile {
  id: string;
  productId: string;
  fileName: string;
  fileType: string;
  version: number;
  uploadedBy: string;
  uploadedAt: string;
  isLatest: boolean;
}

export interface KPI {
  label: string;
  value: string | number;
  change?: number;
  trend: 'up' | 'down' | 'neutral';
  color: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  department: Department;
  isRead: boolean;
  createdAt: string;
}
