import { ReactNode, CSSProperties } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: ReactNode;
  disabled?: boolean;
  style?: CSSProperties;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  disabled = false,
  style = {},
}: ButtonProps) {
  const baseStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : 'auto',
  };

  const variantStyles: Record<string, CSSProperties> = {
    primary: {
      backgroundColor: '#000000',
      color: '#FFFFFF',
    },
    secondary: {
      backgroundColor: '#F3F4F6',
      color: '#1F2937',
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#1F2937',
      border: '1px solid #E5E7EB',
    },
  };

  const sizeStyles: Record<string, CSSProperties> = {
    sm: {
      padding: '8px 16px',
      fontSize: '14px',
      borderRadius: '8px',
    },
    md: {
      padding: '12px 24px',
      fontSize: '16px',
      borderRadius: '12px',
    },
    lg: {
      padding: '16px 32px',
      fontSize: '18px',
      borderRadius: '16px',
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...baseStyle,
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
    >
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </button>
  );
}

