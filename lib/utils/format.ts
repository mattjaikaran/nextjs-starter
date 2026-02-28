export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(date: string | Date, base = new Date()): string {
  const diff = new Date(date).getTime() - base.getTime();
  const seconds = Math.floor(Math.abs(diff) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const suffix = diff < 0 ? 'ago' : 'from now';
  if (days > 0) return `${days} day${days === 1 ? '' : 's'} ${suffix}`;
  if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ${suffix}`;
  if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ${suffix}`;
  return `${seconds} second${seconds === 1 ? '' : 's'} ${suffix}`;
}
