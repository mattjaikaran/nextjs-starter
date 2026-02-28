import type { CreateTodoRequest, QueryParams, Todo, UpdateTodoRequest } from '@/types';
import { createQueryKeyFactory } from '../utils/query-keys';
import { BaseService } from './base.service';

export const todoKeys = {
  ...createQueryKeyFactory('todos'),
  stats: () => ['todos', 'stats'] as const,
  byPriority: (priority: string) => ['todos', 'priority', priority] as const,
  byStatus: (completed: boolean) => ['todos', 'status', completed] as const,
};

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  byPriority: Record<string, number>;
}

export interface BulkDeleteResponse {
  message: string;
  deletedCount: number;
}

class TodoServiceClass extends BaseService<Todo, CreateTodoRequest, UpdateTodoRequest> {
  constructor() {
    super({ basePath: '/todos' });
  }

  async toggle(id: string): Promise<Todo> {
    return this.patch<Todo>(`/${id}/toggle`);
  }

  async bulkUpdate(ids: string[], updates: UpdateTodoRequest): Promise<Todo[]> {
    return this.patch<Todo[]>('/bulk', { ids, updates });
  }

  async bulkDelete(ids: string[]): Promise<BulkDeleteResponse> {
    return this.post<BulkDeleteResponse>('/bulk-delete', { ids });
  }

  async getStats(): Promise<TodoStats> {
    return this.get<TodoStats>('/stats');
  }

  async getByPriority(
    priority: 'low' | 'medium' | 'high',
    params?: Omit<QueryParams, 'filters'>
  ): Promise<Todo[]> {
    const response = await this.getAll({ ...params, filters: { priority } });
    return response.data;
  }

  async getByStatus(
    completed: boolean,
    params?: Omit<QueryParams, 'filters'>
  ): Promise<Todo[]> {
    const response = await this.getAll({ ...params, filters: { completed } });
    return response.data;
  }

  async search(query: string, params?: QueryParams): Promise<Todo[]> {
    const response = await this.getAll({ ...params, search: query });
    return response.data;
  }

  async getOverdue(): Promise<Todo[]> {
    return this.get<Todo[]>('/overdue');
  }

  async getDueToday(): Promise<Todo[]> {
    return this.get<Todo[]>('/due-today');
  }

  async archiveCompleted(): Promise<{ message: string; archivedCount: number }> {
    return this.post<{ message: string; archivedCount: number }>('/archive-completed');
  }
}

export const todoService = new TodoServiceClass();
