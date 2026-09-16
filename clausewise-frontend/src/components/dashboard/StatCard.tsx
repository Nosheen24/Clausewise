import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  color?: 'info' | 'success' | 'warning' | 'danger';
  icon?: React.ComponentType<{ className?: string }>;
}

export function StatCard({ title, value, color = 'info' }: StatCardProps) {
  const colors = {
    info: 'bg-blue-50 border-blue-200 text-blue-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    warning: 'bg-amber-50 border-amber-200 text-amber-700',
    danger: 'bg-red-50 border-red-200 text-red-700',
  };

  return (
    <div className={cn(
      'p-4 rounded-xl border border-gray-200',
      colors[color]
    )}>
      <div className="text-sm font-medium text-gray-500 mb-2">{title}</div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}
