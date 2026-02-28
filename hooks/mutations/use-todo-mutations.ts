'use client';

import { todoKeys, todoService } from '@/lib/api/services';
import { useUI } from '@/lib/store';
import type { CreateTodoRequest, Todo, UpdateTodoRequest } from '@/types';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';

export const useCreateTodo = (
  options?: Omit<
    UseMutationOptions<Todo, Error, CreateTodoRequest>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();
  const { addNotification } = useUI();

  return useMutation<Todo, Error, CreateTodoRequest>({
    mutationFn: (data) => todoService.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      queryClient.invalidateQueries({ queryKey: todoKeys.stats() });
      addNotification({
        type: 'success',
        title: 'Todo created',
        message: `"${data.title}" has been created successfully.`,
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Failed to create todo',
        message: error.message,
      });
    },
    ...options,
  });
};

export const useUpdateTodo = (
  options?: Omit<
    UseMutationOptions<Todo, Error, { id: string; updates: UpdateTodoRequest }>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();
  const { addNotification } = useUI();

  return useMutation<Todo, Error, { id: string; updates: UpdateTodoRequest }>({
    mutationFn: ({ id, updates }) => todoService.update(id, updates),
    onSuccess: (data) => {
      queryClient.setQueryData(todoKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      queryClient.invalidateQueries({ queryKey: todoKeys.stats() });
      addNotification({
        type: 'success',
        title: 'Todo updated',
        message: `"${data.title}" has been updated successfully.`,
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Failed to update todo',
        message: error.message,
      });
    },
    ...options,
  });
};

export const useDeleteTodo = (
  options?: Omit<
    UseMutationOptions<{ message: string }, Error, string>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();
  const { addNotification } = useUI();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: (id) => todoService.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: todoKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      queryClient.invalidateQueries({ queryKey: todoKeys.stats() });
      addNotification({
        type: 'success',
        title: 'Todo deleted',
        message: 'Todo has been deleted successfully.',
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Failed to delete todo',
        message: error.message,
      });
    },
    ...options,
  });
};

export const useToggleTodo = (
  options?: Omit<UseMutationOptions<Todo, Error, string>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();

  return useMutation<Todo, Error, string>({
    mutationFn: async (id) => {
      const todo = await todoService.getById(id);
      return todoService.update(id, { completed: !todo.completed });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(todoKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      queryClient.invalidateQueries({ queryKey: todoKeys.stats() });
    },
    ...options,
  });
};

export const useBulkUpdateTodos = (
  options?: Omit<
    UseMutationOptions<Todo[], Error, { ids: string[]; updates: UpdateTodoRequest }>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();
  const { addNotification } = useUI();

  return useMutation<Todo[], Error, { ids: string[]; updates: UpdateTodoRequest }>({
    mutationFn: ({ ids, updates }) => todoService.bulkUpdate(ids, updates),
    onSuccess: (data, { ids }) => {
      data.forEach((todo) => {
        queryClient.setQueryData(todoKeys.detail(todo.id), todo);
      });
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      queryClient.invalidateQueries({ queryKey: todoKeys.stats() });
      addNotification({
        type: 'success',
        title: 'Todos updated',
        message: `${ids.length} todos have been updated.`,
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Bulk update failed',
        message: error.message,
      });
    },
    ...options,
  });
};

export const useBulkDeleteTodos = (
  options?: Omit<
    UseMutationOptions<{ message: string; deletedCount: number }, Error, string[]>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();
  const { addNotification } = useUI();

  return useMutation<{ message: string; deletedCount: number }, Error, string[]>({
    mutationFn: (ids) => todoService.bulkDelete(ids),
    onSuccess: (data, ids) => {
      ids.forEach((id) => {
        queryClient.removeQueries({ queryKey: todoKeys.detail(id) });
      });
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      queryClient.invalidateQueries({ queryKey: todoKeys.stats() });
      addNotification({
        type: 'success',
        title: 'Todos deleted',
        message: `${data.deletedCount} todos have been deleted.`,
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Bulk delete failed',
        message: error.message,
      });
    },
    ...options,
  });
};

export const useArchiveCompletedTodos = (
  options?: Omit<
    UseMutationOptions<{ message: string; archivedCount: number }, Error, void>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();
  const { addNotification } = useUI();

  return useMutation<{ message: string; archivedCount: number }, Error, void>({
    mutationFn: () => todoService.archiveCompleted(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all });
      addNotification({
        type: 'success',
        title: 'Todos archived',
        message: `${data.archivedCount} completed todos have been archived.`,
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Archive failed',
        message: error.message,
      });
    },
    ...options,
  });
};
