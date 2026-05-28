'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTodos } from '@/hooks';
import { useAuth } from '@/lib/store';
import type { Todo } from '@/types';
import { CheckCircle2, Circle, Plus, Search, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function TodosContent() {
  const { isAuthenticated } = useAuth();
  const { push } = useRouter();
  const { data: todosResponse, isLoading } = useTodos();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'completed' | 'pending'
  >('all');

  if (!isAuthenticated) {
    push('/login');
    return null;
  }

  const todos = todosResponse?.data ?? (Array.isArray(todosResponse) ? todosResponse : []);
  const filteredTodos = (Array.isArray(todos) ? todos : []).filter(
    (todo: Todo) => {
      const matchesSearch =
        todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (todo as { description?: string }).description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'completed' && todo.completed) ||
        (statusFilter === 'pending' && !todo.completed);
      return matchesSearch && matchesStatus;
    }
  );

  return (
    <div className="page-container">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Todos</h1>
            <p className="text-muted-foreground">
              Manage your tasks and stay organized
            </p>
          </div>
          <Button asChild>
            <Link href="/todos/create">
              <Plus className="mr-2 size-4" />
              Add Todo
            </Link>
          </Button>
        </div>

        <div className="card-container p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 transform text-muted-foreground" />
                <Input
                  placeholder="Search todos..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value: 'all' | 'completed' | 'pending') =>
                setStatusFilter(value)
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="card-container p-6 text-center">
              <p className="text-muted-foreground">Loading todos…</p>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="card-container p-6 text-center">
              <p className="text-muted-foreground">
                {todos.length === 0
                  ? 'No todos yet. Create your first todo to get started!'
                  : 'No todos match your current filters.'}
              </p>
              {todos.length === 0 && (
                <Button asChild className="mt-4">
                  <Link href="/todos/create">
                    <Plus className="mr-2 size-4" />
                    Create Your First Todo
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            filteredTodos.map((todo: Todo) => (
              <div key={todo.id} className="card-container p-4">
                <div className="flex items-start gap-3">
                  <button type="button" className="mt-1">
                    {todo.completed ? (
                      <CheckCircle2 className="size-5 text-green-600" />
                    ) : (
                      <Circle className="size-5 text-muted-foreground" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h3
                        className={`font-medium ${todo.completed ? 'text-muted-foreground line-through' : ''}`}
                      >
                        {todo.title}
                      </h3>
                    </div>

                    {(todo as { description?: string }).description && (
                      <p
                        className={`mb-2 text-sm text-muted-foreground ${todo.completed ? 'line-through' : ''}`}
                      >
                        {(todo as { description: string }).description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
