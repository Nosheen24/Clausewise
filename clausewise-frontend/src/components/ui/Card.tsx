import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function Card({ children, title, className }: CardProps) {
  return (
    <div className={cn(
      'bg-white rounded-xl shadow-sm border border-gray-200 p-6',
      className
    )}>
      {title && (
        <h3 className="text-lg font-semibold text-primary mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
}
