import { useState } from 'react';
import { Calendar, Clock, MapPin, Globe, Sparkles } from 'lucide-react';
import type { CreateAstrologyProfileRequest } from '../../types/astrology';

interface BirthDataFormProps {
  onSubmit: (data: CreateAstrologyProfileRequest) => void;
  loading: boolean;
  error: string;
  initialData?: Partial<CreateAstrologyProfileRequest>;
}

export function BirthDataForm({ onSubmit, loading, error, initialData }: BirthDataFormProps) {
  const [formData, setFormData] = useState<CreateAstrologyProfileRequest>({
    birth_date: initialData?.birth_date || '',
    birth_time: initialData?.birth_time || '',
    birth_city: initialData?.birth_city || '',
    birth_country: initialData?.birth_country || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSend: CreateAstrologyProfileRequest = {
      birth_date: formData.birth_date,
    };

    if (formData.birth_time) dataToSend.birth_time = formData.birth_time;
    if (formData.birth_city) dataToSend.birth_city = formData.birth_city;
    if (formData.birth_country) dataToSend.birth_country = formData.birth_country;

    onSubmit(dataToSend);
  };

  const today = new Date().toISOString().split('T')[0];

  const inputStyle = {
    width: '100%',
    padding: '14px 16px 14px 46px',
    fontSize: '16px',
    borderRadius: '12px',
    border: '1px solid rgba(167, 139, 250, 0.2)',
    backgroundColor: 'rgba(30, 27, 75, 0.5)',
    color: '#E9D5FF',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{ 
        maxWidth: '600px', 
        margin: '0 auto',
        animation: 'slideUp 0.6s ease-out'
      }}
    >
      <div style={{
        background: 'rgba(30, 27, 75, 0.4)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(167, 139, 250, 0.2)',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ 
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <h2 style={{ 
            color: '#E9D5FF',
            fontSize: '28px',
            fontWeight: '400',
            marginBottom: '8px',
            letterSpacing: '0.05em'
          }}>
            Данные о рождении
          </h2>
          <p style={{
            color: '#C4B5FD',
            fontSize: '14px',
            opacity: 0.8
          }}>
            Введите информацию для создания вашего космического профиля
          </p>
        </div>

        {error && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#FCA5A5',
            padding: '16px',
            marginBottom: '24px',
            borderRadius: '12px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '24px', position: 'relative' }}>
          <label 
            htmlFor="birth_date" 
            style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#E9D5FF', 
              fontWeight: '500',
              fontSize: '14px',
              letterSpacing: '0.05em'
            }}
          >
            Дата рождения <span style={{ color: '#F87171' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <Calendar 
              size={20} 
              color="#A78BFA" 
              style={{ 
                position: 'absolute', 
                left: '16px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }} 
            />
            <input
              type="date"
              id="birth_date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              required
              max={today}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(167, 139, 250, 0.5)';
                e.target.style.backgroundColor = 'rgba(30, 27, 75, 0.7)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(167, 139, 250, 0.2)';
                e.target.style.backgroundColor = 'rgba(30, 27, 75, 0.5)';
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '24px', position: 'relative' }}>
          <label 
            htmlFor="birth_time" 
            style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#E9D5FF', 
              fontWeight: '500',
              fontSize: '14px',
              letterSpacing: '0.05em'
            }}
          >
            Время рождения
          </label>
          <div style={{ position: 'relative' }}>
            <Clock 
              size={20} 
              color="#A78BFA" 
              style={{ 
                position: 'absolute', 
                left: '16px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }} 
            />
            <input
              type="time"
              id="birth_time"
              name="birth_time"
              value={formData.birth_time}
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(167, 139, 250, 0.5)';
                e.target.style.backgroundColor = 'rgba(30, 27, 75, 0.7)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(167, 139, 250, 0.2)';
                e.target.style.backgroundColor = 'rgba(30, 27, 75, 0.5)';
              }}
            />
          </div>
          <small style={{ 
            color: '#C4B5FD', 
            fontSize: '12px',
            marginTop: '4px',
            display: 'block',
            opacity: 0.7
          }}>
            Для более точного расчета асцендента
          </small>
        </div>

        <div style={{ marginBottom: '24px', position: 'relative' }}>
          <label 
            htmlFor="birth_city" 
            style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#E9D5FF', 
              fontWeight: '500',
              fontSize: '14px',
              letterSpacing: '0.05em'
            }}
          >
            Город рождения
          </label>
          <div style={{ position: 'relative' }}>
            <MapPin 
              size={20} 
              color="#A78BFA" 
              style={{ 
                position: 'absolute', 
                left: '16px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }} 
            />
            <input
              type="text"
              id="birth_city"
              name="birth_city"
              value={formData.birth_city}
              onChange={handleChange}
              placeholder="Например: Москва"
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(167, 139, 250, 0.5)';
                e.target.style.backgroundColor = 'rgba(30, 27, 75, 0.7)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(167, 139, 250, 0.2)';
                e.target.style.backgroundColor = 'rgba(30, 27, 75, 0.5)';
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '32px', position: 'relative' }}>
          <label 
            htmlFor="birth_country" 
            style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#E9D5FF', 
              fontWeight: '500',
              fontSize: '14px',
              letterSpacing: '0.05em'
            }}
          >
            Страна рождения
          </label>
          <div style={{ position: 'relative' }}>
            <Globe 
              size={20} 
              color="#A78BFA" 
              style={{ 
                position: 'absolute', 
                left: '16px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }} 
            />
            <input
              type="text"
              id="birth_country"
              name="birth_country"
              value={formData.birth_country}
              onChange={handleChange}
              placeholder="Например: Россия"
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(167, 139, 250, 0.5)';
                e.target.style.backgroundColor = 'rgba(30, 27, 75, 0.7)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(167, 139, 250, 0.2)';
                e.target.style.backgroundColor = 'rgba(30, 27, 75, 0.5)';
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !formData.birth_date}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '16px',
            fontWeight: '500',
            background: loading 
              ? 'rgba(100, 100, 100, 0.3)' 
              : 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            letterSpacing: '0.05em',
            boxShadow: loading ? 'none' : '0 4px 20px rgba(167, 139, 250, 0.4)'
          }}
          onMouseEnter={(e) => {
            if (!loading && formData.birth_date) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(167, 139, 250, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(167, 139, 250, 0.4)';
          }}
        >
          {loading ? (
            <>
              <Sparkles size={20} style={{ animation: 'pulse 2s infinite' }} />
              Расчет профиля...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Создать астрологический профиль
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(0.7) sepia(1) saturate(3) hue-rotate(240deg);
          cursor: pointer;
        }
      `}</style>
    </form>
  );
}

