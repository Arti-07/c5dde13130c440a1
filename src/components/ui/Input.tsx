import { CSSProperties } from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'search';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: CSSProperties;
}

export function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  label,
  disabled = false,
  fullWidth = false,
  style = {},
}: InputProps) {
  return (
    <div style={{ width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: '500',
            marginBottom: '8px',
            color: '#6B7280',
          }}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        style={{
          width: fullWidth ? '100%' : 'auto',
          backgroundColor: '#F9FAFB',
          padding: '12px 16px',
          borderRadius: '8px',
          border: '1px solid #E5E7EB',
          fontSize: '14px',
          color: '#1F2937',
          ...style,
        }}
      />
    </div>
  );
}

