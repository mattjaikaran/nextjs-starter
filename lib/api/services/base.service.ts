import { api, handleApiResponse } from '@/lib/api';
import type { ApiResponse, PaginatedResponse, QueryParams } from '@/types';
import type { AxiosRequestConfig } from 'axios';
import { handlePaginatedResponse } from '../utils/response';

export interface ServiceConfig {
  basePath: string;
}

export abstract class BaseService<
  TEntity,
  TCreateDto = Partial<TEntity>,
  TUpdateDto = Partial<TEntity>,
> {
  protected readonly basePath: string;

  constructor(config: ServiceConfig) {
    this.basePath = config.basePath;
  }

  async getAll(params?: QueryParams): Promise<PaginatedResponse<TEntity>> {
    const response = await api.get<ApiResponse<PaginatedResponse<TEntity>>>(
      this.basePath,
      { params }
    );
    return handlePaginatedResponse(response);
  }

  async getById(id: string): Promise<TEntity> {
    const response = await api.get<ApiResponse<TEntity>>(
      `${this.basePath}/${id}`
    );
    return handleApiResponse(response);
  }

  async create(data: TCreateDto): Promise<TEntity> {
    const response = await api.post<ApiResponse<TEntity>>(this.basePath, data);
    return handleApiResponse(response);
  }

  async update(id: string, data: TUpdateDto): Promise<TEntity> {
    const response = await api.patch<ApiResponse<TEntity>>(
      `${this.basePath}/${id}`,
      data
    );
    return handleApiResponse(response);
  }

  async replace(id: string, data: TCreateDto): Promise<TEntity> {
    const response = await api.put<ApiResponse<TEntity>>(
      `${this.basePath}/${id}`,
      data
    );
    return handleApiResponse(response);
  }

  async delete(id: string): Promise<{ message: string }> {
    const response = await api.delete<ApiResponse<{ message: string }>>(
      `${this.basePath}/${id}`
    );
    return handleApiResponse(response);
  }

  protected async get<T>(
    path: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await api.get<ApiResponse<T>>(
      `${this.basePath}${path}`,
      config
    );
    return handleApiResponse(response);
  }

  protected async post<T>(
    path: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await api.post<ApiResponse<T>>(
      `${this.basePath}${path}`,
      data,
      config
    );
    return handleApiResponse(response);
  }

  protected async patch<T>(
    path: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await api.patch<ApiResponse<T>>(
      `${this.basePath}${path}`,
      data,
      config
    );
    return handleApiResponse(response);
  }
}
