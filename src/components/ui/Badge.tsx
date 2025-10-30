import { ReactNode, CSSProperties } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  style?: CSSProperties;
}

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  style = {} 
}: BadgeProps) {
  const variantStyles: Record<string, CSSProperties> = {
    default: {
      backgroundColor: '#F3F4F6',
      color: '#6B7280',
    },
    primary: {
      backgroundColor: '#000000',
      color: '#FFFFFF',
    },
    success: {
      backgroundColor: '#D1FAE5',
      color: '#065F46',
    },
    warning: {
      backgroundColor: '#FEF3C7',
      color: '#92400E',
    },
    danger: {
      backgroundColor: '#FEE2E2',
      color: '#991B1B',
    },
  };

  const sizeStyles: Record<string, CSSProperties> = {
    sm: {
      padding: '4px 8px',
      fontSize: '11px',
      borderRadius: '4px',
    },
    md: {
      padding: '6px 12px',
      fontSize: '12px',
      borderRadius: '6px',
    },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontWeight: '500',
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
    >
      {children}
    </span>
  );
}

