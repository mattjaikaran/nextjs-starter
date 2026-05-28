import type { Metadata } from 'next';
import { TodosContent } from './TodosContent';

export const metadata: Metadata = {
  title: 'Todos | Next.js Starter',
  description: 'Manage your tasks and stay organized.',
};

export default function TodosPage() {
  return <TodosContent />;
}
