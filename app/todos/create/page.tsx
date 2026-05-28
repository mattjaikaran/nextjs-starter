import type { Metadata } from 'next';
import { CreateTodoContent } from './CreateTodoContent';

export const metadata: Metadata = {
  title: 'Create Todo | Next.js Starter',
  description: 'Add a new task to your todo list.',
};

export default function CreateTodoPage() {
  return <CreateTodoContent />;
}
