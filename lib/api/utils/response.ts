import type {
  ApiResponse,
  DjangoPaginatedResponse,
  PaginatedResponse,
} from '@/types';
import type { AxiosResponse } from 'axios';

const isWrappedResponse = <T>(data: unknown): data is ApiResponse<T> => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    'data' in data
  );
};

const isDjangoPaginated = <T>(
  data: unknown
): data is DjangoPaginatedResponse<T> => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'items' in data &&
    'count' in data &&
    'page' in data
  );
};

export const handleApiResponse = <T>(
  response: AxiosResponse<ApiResponse<T> | T>
): T => {
  const data = response.data;

  if (isWrappedResponse<T>(data)) {
    if (data.success) {
      return data.data;
    }
    throw new Error(data.message || 'API request failed');
  }

  if (typeof data === 'object' && data !== null && 'detail' in data) {
    const detail = (data as { detail: string | { msg: string }[] }).detail;
    if (typeof detail === 'string') {
      throw new Error(detail);
    }
    if (Array.isArray(detail)) {
      throw new Error(detail.map((d) => d.msg).join(', '));
    }
  }

  return data as T;
};

export const handlePaginatedResponse = <T>(
  response: AxiosResponse<
    | ApiResponse<PaginatedResponse<T>>
    | DjangoPaginatedResponse<T>
    | PaginatedResponse<T>
  >
): PaginatedResponse<T> => {
  const data = response.data;

  if (isWrappedResponse<PaginatedResponse<T>>(data)) {
    if (data.success) {
      return data.data;
    }
    throw new Error(data.message || 'API request failed');
  }

  if (isDjangoPaginated<T>(data)) {
    return {
      data: data.items,
      pagination: {
        page: data.page,
        limit: data.page_size,
        total: data.count,
        totalPages: data.pages,
      },
    };
  }

  if ('data' in data && 'pagination' in data) {
    return data as PaginatedResponse<T>;
  }

  throw new Error('Unexpected response format');
};

export const createSuccessResponse = <T>(
  data: T,
  message?: string
): ApiResponse<T> => ({
  success: true,
  data,
  message,
});

export const createErrorResponse = <T = null>(
  message: string,
  data?: T
): ApiResponse<T> => ({
  success: false,
  data: data as T,
  message,
});
