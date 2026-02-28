export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string | string[]>;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface ValidationErrorResponse {
  detail: ValidationError[];
}

export interface DjangoPaginatedResponse<T> {
  items: T[];
  count: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function normalizePaginatedResponse<T>(
  response: DjangoPaginatedResponse<T>
): PaginatedResponse<T> {
  return {
    data: response.items,
    pagination: {
      page: response.page,
      limit: response.page_size,
      total: response.count,
      totalPages: response.pages,
    },
  };
}

export interface QueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
  filters?: Record<string, string | number | boolean>;
}

export type FilterOperator =
  | 'eq'
  | 'ne'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'contains'
  | 'icontains'
  | 'in'
  | 'isnull';

export interface FilterParam {
  field: string;
  operator: FilterOperator;
  value: string | number | boolean | (string | number)[];
}
