'use client';

import { generateId } from '@/lib/utils';
import type { CreateTodoRequest, Todo, TodoFilters, TodoState, UpdateTodoRequest } from '@/types';
import { create } from 'zustand';

export interface TodoSlice extends TodoState {
  fetchTodos: () => Promise<void>;
  createTodo: (todo: CreateTodoRequest) => Promise<void>;
  updateTodo: (id: string, updates: UpdateTodoRequest) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  setFilters: (filters: Partial<TodoFilters>) => void;
  clearFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const initialFilters: TodoFilters = {
  search: '',
  priority: 'all',
  completed: 'all',
  tags: [],
};

const mockTodos: Todo[] = [
  {
    id: '1',
    title: 'Complete project setup',
    description: 'Set up the Next.js boilerplate with all necessary configurations',
    completed: false,
    priority: 'high',
    dueDate: '2026-12-31',
    tags: ['development', 'setup'],
    userId: '1',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Write documentation',
    description: 'Create comprehensive documentation for the boilerplate',
    completed: false,
    priority: 'medium',
    dueDate: '2026-12-25',
    tags: ['documentation'],
    userId: '1',
    createdAt: '2026-01-02T00:00:00Z',
    updatedAt: '2026-01-02T00:00:00Z',
  },
  {
    id: '3',
    title: 'Add unit tests',
    description: 'Implement unit tests for all components and utilities',
    completed: true,
    priority: 'high',
    tags: ['testing'],
    userId: '1',
    createdAt: '2026-01-03T00:00:00Z',
    updatedAt: '2026-01-03T00:00:00Z',
  },
];

export const useTodoStore = create<TodoSlice>((set, get) => ({
  todos: [],
  isLoading: false,
  error: null,
  filters: initialFilters,

  fetchTodos: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({ todos: mockTodos, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch todos',
      });
    }
  },

  createTodo: async (todoData) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const newTodo: Todo = {
        id: generateId(),
        ...todoData,
        completed: false,
        tags: todoData.tags || [],
        userId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const { todos } = get();
      set({ todos: [newTodo, ...todos], isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create todo',
      });
    }
  },

  updateTodo: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const { todos } = get();
      set({
        todos: todos.map((t) =>
          t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
        ),
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update todo',
      });
    }
  },

  deleteTodo: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const { todos } = get();
      set({ todos: todos.filter((t) => t.id !== id), isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete todo',
      });
    }
  },

  toggleTodo: async (id) => {
    const { todos, updateTodo } = get();
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      await updateTodo(id, { completed: !todo.completed });
    }
  },

  setFilters: (newFilters) => {
    const { filters } = get();
    set({ filters: { ...filters, ...newFilters } });
  },

  clearFilters: () => set({ filters: initialFilters }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
