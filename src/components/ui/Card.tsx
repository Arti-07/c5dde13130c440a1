import { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'light' | 'dark' | 'muted';
  padding?: 'sm' | 'md' | 'lg';
  style?: CSSProperties;
}

export function Card({ 
  children, 
  variant = 'light', 
  padding = 'md',
  style = {} 
}: CardProps) {
  const variantStyles: Record<string, CSSProperties> = {
    light: {
      backgroundColor: '#FFFFFF',
      color: '#1F2937',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    },
    dark: {
      backgroundColor: '#1F2937',
      color: '#FFFFFF',
    },
    muted: {
      backgroundColor: '#F9FAFB',
      color: '#1F2937',
    },
  };

  const paddingStyles: Record<string, CSSProperties> = {
    sm: { padding: '16px' },
    md: { padding: '24px' },
    lg: { padding: '32px' },
  };

  return (
    <div
      style={{
        borderRadius: '16px',
        ...variantStyles[variant],
        ...paddingStyles[padding],
        ...style,
      }}
    >
      {children}
    </div>
  );
}

