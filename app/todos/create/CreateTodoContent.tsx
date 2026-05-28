'use client';

import { TodoForm } from '@/forms/todos/TodoForm';
import { useRouter } from 'next/navigation';

export function CreateTodoContent() {
  const { push } = useRouter();

  const handleSuccess = () => {
    push('/todos');
  };

  const handleCancel = () => {
    push('/todos');
  };

  return (
    <div className="page-container">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Todo</h1>
            <p className="text-muted-foreground">
              Add a new task to your todo list
            </p>
          </div>
        </div>

        <div className="card-container p-6">
          <TodoForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  );
}
