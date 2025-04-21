// Tipos que correspondem ao esquema compartilhado

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface Supplier {
  id: number;
  name: string;
  contact?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  parentId?: number;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  barcode?: string;
  description?: string;
  categoryId?: number;
  supplierId?: number;
  costPrice?: number;
  salePrice?: number;
  stock: number;
  minStock: number;
  imageUrls?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Alert {
  id: number;
  type: string;
  message: string;
  productId?: number;
  read: boolean;
  createdAt: string;
}

// Tipos para o dashboard
export interface DashboardData {
  totalProducts: number;
  stockValue: number;
  lowStockCount: number;
  recentSales: number;
  alerts: Alert[];
}
