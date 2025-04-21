// This file contains additional types that aren't already defined in schema.ts

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface FilterParams {
  category?: string;
  supplier?: string;
  minStock?: boolean;
  search?: string;
}

export interface ExportOptions {
  format: 'pdf' | 'excel';
  filters?: FilterParams;
}
