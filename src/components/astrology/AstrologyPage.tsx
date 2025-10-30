import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';
import {
  getAstrologyProfile,
  createOrUpdateAstrologyProfile,
  deleteAstrologyProfile,
} from '../../api/astrology';
import { BirthDataForm } from './BirthDataForm';
import { AstrologyProfileView } from './AstrologyProfileView';
import { StarryBackground } from './StarryBackground';
import type { AstrologyProfile, CreateAstrologyProfileRequest } from '../../types/astrology';

export function AstrologyPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<AstrologyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAstrologyProfile();
      setProfile(data);
      setIsEditing(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки';
      if (errorMessage.includes('не найден')) {
        setProfile(null);
        setIsEditing(true);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: CreateAstrologyProfileRequest) => {
    try {
      setSubmitting(true);
      setError('');
      const newProfile = await createOrUpdateAstrologyProfile(data);
      setProfile(newProfile);
      setIsEditing(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка создания профиля';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
  };

  const handleDelete = async () => {
    try {
      setSubmitting(true);
      setError('');
      await deleteAstrologyProfile();
      setProfile(null);
      setIsEditing(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка удаления профиля';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    if (profile) {
      setIsEditing(false);
      setError('');
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <Sparkles size={48} color="#A78BFA" style={{ 
            animation: 'pulse 2s infinite',
            marginBottom: '20px'
          }} />
          <h2 style={{ 
            color: '#E9D5FF', 
            fontSize: '24px',
            fontWeight: '400',
            letterSpacing: '0.05em'
          }}>
            Загрузка профиля...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <StarryBackground />
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                         radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.3) 0%, transparent 50%),
                         radial-gradient(circle at 40% 20%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)`,
        pointerEvents: 'none'
      }} />
      
      <div style={{ position: 'relative', zIndex: 1, padding: '40px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '24px',
              padding: '12px 24px',
              cursor: 'pointer',
              borderRadius: '12px',
              border: '1px solid rgba(167, 139, 250, 0.3)',
              backgroundColor: 'rgba(30, 27, 75, 0.5)',
              color: '#E9D5FF',
              fontSize: '14px',
              fontWeight: '500',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(30, 27, 75, 0.8)';
              e.currentTarget.style.borderColor = 'rgba(167, 139, 250, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(30, 27, 75, 0.5)';
              e.currentTarget.style.borderColor = 'rgba(167, 139, 250, 0.3)';
            }}
          >
            <ArrowLeft size={18} />
            На главную
          </button>

          <div style={{ 
            textAlign: 'center', 
            marginBottom: '48px',
            animation: 'fadeIn 0.8s ease-out'
          }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '12px',
              marginBottom: '16px' 
            }}>
              <Sparkles size={32} color="#A78BFA" />
              <h1 style={{ 
                fontSize: '48px',
                fontWeight: '400',
                background: 'linear-gradient(135deg, #E9D5FF 0%, #A78BFA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.05em'
              }}>
                Астрология
              </h1>
              <Sparkles size={32} color="#A78BFA" />
            </div>
            <p style={{ 
              color: '#C4B5FD',
              fontSize: '16px',
              letterSpacing: '0.05em',
              opacity: 0.9
            }}>
              Откройте тайны вашей судьбы через звезды
            </p>
          </div>

          {isEditing || !profile ? (
            <div>
              {profile && (
                <button
                  onClick={handleCancelEdit}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '24px',
                    padding: '12px 24px',
                    cursor: 'pointer',
                    borderRadius: '12px',
                    border: '1px solid rgba(167, 139, 250, 0.3)',
                    backgroundColor: 'rgba(30, 27, 75, 0.5)',
                    color: '#E9D5FF',
                    fontSize: '14px',
                    fontWeight: '500',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(30, 27, 75, 0.8)';
                    e.currentTarget.style.borderColor = 'rgba(167, 139, 250, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(30, 27, 75, 0.5)';
                    e.currentTarget.style.borderColor = 'rgba(167, 139, 250, 0.3)';
                  }}
                >
                  <ArrowLeft size={18} />
                  Вернуться к профилю
                </button>
              )}
              <BirthDataForm
                onSubmit={handleSubmit}
                loading={submitting}
                error={error}
                initialData={profile ? {
                  birth_date: profile.birth_date,
                  birth_time: profile.birth_time || '',
                  birth_city: profile.birth_city || '',
                  birth_country: profile.birth_country || '',
                } : undefined}
              />
            </div>
          ) : (
            <>
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
              <AstrologyProfileView
                profile={profile}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

