import type { QueryParams } from '@/types';

type PrimitiveValue = string | number | boolean | null | undefined;
type QueryParamValue =
  | PrimitiveValue
  | PrimitiveValue[]
  | Record<string, PrimitiveValue>;
type QueryParamsObject = Record<string, QueryParamValue>;

export const serializeParams = (params?: QueryParamsObject): string => {
  if (!params) return '';

  const sortedParams = Object.keys(params)
    .sort()
    .reduce((result, key) => {
      const value = params[key];
      if (value !== undefined && value !== null) {
        result[key] = value;
      }
      return result;
    }, {} as QueryParamsObject);

  return JSON.stringify(sortedParams);
};

export const createQueryKey = (
  base: readonly string[],
  params?: QueryParams | QueryParamsObject
): readonly unknown[] => {
  if (!params || Object.keys(params).length === 0) {
    return base;
  }
  return [...base, serializeParams(params as QueryParamsObject)];
};

export const createPaginatedKey = (
  base: readonly string[],
  page?: number,
  limit?: number,
  filters?: Record<string, PrimitiveValue>
): readonly unknown[] => {
  const params: QueryParamsObject = {};
  if (page !== undefined) params.page = page;
  if (limit !== undefined) params.limit = limit;
  if (filters) params.filters = JSON.stringify(filters);
  return createQueryKey(base, params);
};

export const createQueryKeyFactory = <T extends string>(domain: T) => ({
  all: [domain] as const,
  lists: () => [...createQueryKeyFactory(domain).all, 'list'] as const,
  list: (params?: QueryParams) =>
    createQueryKey(createQueryKeyFactory(domain).lists(), params),
  details: () => [...createQueryKeyFactory(domain).all, 'detail'] as const,
  detail: (id: string) =>
    [...createQueryKeyFactory(domain).details(), id] as const,
});
