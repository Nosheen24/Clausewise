import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ className, variant = 'primary', size = 'md', asChild = false, ...props }: ButtonProps) {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-secondary text-primary hover:bg-secondary/90',
    danger: 'bg-danger text-white hover:bg-danger/90',
    ghost: 'text-primary hover:bg-primary/10',
    accent: 'bg-accent text-primary hover:bg-accent/90',
  };

  const sizes = {
    sm: 'h-8 py-1 text-sm rounded',
    md: 'h-10 py-2 text-base rounded',
    lg: 'h-12 py-3 text-lg rounded',
  };

  const cls = cn(
    'inline-flex items-center justify-center rounded font-medium',
    variants[variant],
    sizes[size],
    className,
  );

  if (asChild) {
    return <span className={cls}>{props.children}</span>;
  }

  return (
    <button className={cls} {...props}>
      {props.children}
    </button>
  );
}