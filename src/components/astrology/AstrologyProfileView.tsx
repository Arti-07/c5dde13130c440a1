import { useState } from 'react';
import { Edit2, Trash2, Star, Zap, TrendingUp, Target, Briefcase, Heart, Sun, Moon, Hash, AlertTriangle, X } from 'lucide-react';
import type { AstrologyProfile } from '../../types/astrology';

interface AstrologyProfileViewProps {
  profile: AstrologyProfile;
  onEdit: () => void;
  onDelete: () => void;
}

export function AstrologyProfileView({ profile, onEdit, onDelete }: AstrologyProfileViewProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    onDelete();
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto',
      animation: 'fadeInUp 0.8s ease-out'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '40px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ 
            color: '#E9D5FF',
            fontSize: '36px',
            fontWeight: '400',
            marginBottom: '8px',
            letterSpacing: '0.05em'
          }}>
            Ваш космический профиль
          </h1>
          <p style={{
            color: '#C4B5FD',
            fontSize: '14px',
            opacity: 0.8
          }}>
            Откройте тайны вашей личности через призму звезд
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={onEdit}
            style={{
              padding: '12px 24px',
              cursor: 'pointer',
              borderRadius: '12px',
              border: '1px solid rgba(167, 139, 250, 0.4)',
              background: 'rgba(30, 27, 75, 0.6)',
              backdropFilter: 'blur(10px)',
              color: '#E9D5FF',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(30, 27, 75, 0.9)';
              e.currentTarget.style.borderColor = 'rgba(167, 139, 250, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(30, 27, 75, 0.6)';
              e.currentTarget.style.borderColor = 'rgba(167, 139, 250, 0.4)';
            }}
          >
            <Edit2 size={16} />
            Редактировать
          </button>
          <button 
            onClick={handleDeleteClick}
            style={{
              padding: '12px 24px',
              cursor: 'pointer',
              borderRadius: '12px',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.3) 100%)',
              backdropFilter: 'blur(10px)',
              color: '#FCA5A5',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.5) 0%, rgba(220, 38, 38, 0.5) 100%)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.3) 100%)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
            }}
          >
            <Trash2 size={16} />
            Удалить
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '24px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(109, 40, 217, 0.2) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(139, 92, 246, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
        }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Sun size={28} color="#A78BFA" />
            <h2 style={{ 
              color: '#E9D5FF', 
              fontSize: '24px',
              fontWeight: '500',
              letterSpacing: '0.05em'
            }}>
              Солнечный знак
            </h2>
          </div>
          <div style={{ 
            fontSize: '48px', 
            fontWeight: '600',
            background: 'linear-gradient(135deg, #E9D5FF 0%, #A78BFA 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px'
          }}>
            {profile.zodiac_sign}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{
              padding: '8px 16px',
              background: 'rgba(139, 92, 246, 0.3)',
              borderRadius: '20px',
              color: '#DDD6FE',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {profile.zodiac_element}
            </span>
            <span style={{
              padding: '8px 16px',
              background: 'rgba(109, 40, 217, 0.3)',
              borderRadius: '20px',
              color: '#DDD6FE',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {profile.zodiac_quality}
            </span>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(219, 39, 119, 0.2) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(236, 72, 153, 0.3)',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(236, 72, 153, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
        }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Moon size={28} color="#F9A8D4" />
            <h2 style={{ 
              color: '#FCE7F3', 
              fontSize: '24px',
              fontWeight: '500',
              letterSpacing: '0.05em'
            }}>
              Восточный знак
            </h2>
          </div>
          <div style={{ 
            fontSize: '48px', 
            fontWeight: '600',
            background: 'linear-gradient(135deg, #FCE7F3 0%, #F9A8D4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>
            {profile.chinese_zodiac}
          </div>
          <p style={{ color: '#FBCFE8', opacity: 0.8, fontSize: '14px' }}>
            Китайская астрология
          </p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
        }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Hash size={28} color="#93C5FD" />
            <h2 style={{ 
              color: '#DBEAFE', 
              fontSize: '24px',
              fontWeight: '500',
              letterSpacing: '0.05em'
            }}>
              Нумерология
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontSize: '42px', 
                fontWeight: '600',
                background: 'linear-gradient(135deg, #DBEAFE 0%, #93C5FD 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {profile.life_path_number}
              </div>
              <p style={{ color: '#BFDBFE', fontSize: '12px', opacity: 0.8 }}>
                Путь жизни
              </p>
            </div>
            {profile.soul_number && (
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: '42px', 
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #DBEAFE 0%, #93C5FD 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {profile.soul_number}
                </div>
                <p style={{ color: '#BFDBFE', fontSize: '12px', opacity: 0.8 }}>
                  Число души
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{
        background: 'rgba(30, 27, 75, 0.4)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(167, 139, 250, 0.2)',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          marginBottom: '24px'
        }}>
          <div>
            <p style={{ color: '#C4B5FD', fontSize: '14px', marginBottom: '8px' }}>
              Дата рождения
            </p>
            <p style={{ color: '#E9D5FF', fontSize: '18px', fontWeight: '500' }}>
              {formatDate(profile.birth_date)}
            </p>
          </div>
          {profile.birth_time && (
            <div>
              <p style={{ color: '#C4B5FD', fontSize: '14px', marginBottom: '8px' }}>
                Время рождения
              </p>
              <p style={{ color: '#E9D5FF', fontSize: '18px', fontWeight: '500' }}>
                {profile.birth_time}
              </p>
            </div>
          )}
          {profile.birth_city && (
            <div>
              <p style={{ color: '#C4B5FD', fontSize: '14px', marginBottom: '8px' }}>
                Место рождения
              </p>
              <p style={{ color: '#E9D5FF', fontSize: '18px', fontWeight: '500' }}>
                {profile.birth_city}
                {profile.birth_country && `, ${profile.birth_country}`}
              </p>
            </div>
          )}
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <Star size={24} color="#6EE7B7" />
          <h2 style={{ 
            color: '#D1FAE5', 
            fontSize: '24px',
            fontWeight: '500',
            letterSpacing: '0.05em'
          }}>
            Черты личности
          </h2>
        </div>
        <p style={{ 
          color: '#A7F3D0',
          lineHeight: '1.8',
          fontSize: '16px'
        }}>
          {profile.personality_traits}
        </p>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(251, 191, 36, 0.3)',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <Zap size={24} color="#FCD34D" />
          <h2 style={{ 
            color: '#FEF3C7', 
            fontSize: '24px',
            fontWeight: '500',
            letterSpacing: '0.05em'
          }}>
            Сильные стороны
          </h2>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {profile.strengths.split(', ').map((strength, index) => (
            <span
              key={index}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, rgba(245, 158, 11, 0.3) 100%)',
                border: '1px solid rgba(251, 191, 36, 0.4)',
                borderRadius: '24px',
                color: '#FDE68A',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {strength}
            </span>
          ))}
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(147, 51, 234, 0.15) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <TrendingUp size={24} color="#C084FC" />
          <h2 style={{ 
            color: '#EDE9FE', 
            fontSize: '24px',
            fontWeight: '500',
            letterSpacing: '0.05em'
          }}>
            Области для развития
          </h2>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {profile.challenges.split(', ').map((challenge, index) => (
            <span
              key={index}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(147, 51, 234, 0.3) 100%)',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                borderRadius: '24px',
                color: '#DDD6FE',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {challenge}
            </span>
          ))}
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <Briefcase size={24} color="#93C5FD" />
          <h2 style={{ 
            color: '#DBEAFE', 
            fontSize: '24px',
            fontWeight: '500',
            letterSpacing: '0.05em'
          }}>
            Рекомендации по карьере
          </h2>
        </div>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '12px'
        }}>
          {profile.career_recommendations.split(', ').map((career, index) => (
            <div
              key={index}
              style={{
                padding: '16px',
                background: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                borderRadius: '12px',
                textAlign: 'center',
                color: '#BFDBFE',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Target size={16} style={{ marginBottom: '8px' }} />
              <div>{career}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, rgba(244, 114, 182, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(244, 114, 182, 0.3)',
        borderRadius: '20px',
        padding: '32px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <Heart size={24} color="#F9A8D4" />
          <h2 style={{ 
            color: '#FCE7F3', 
            fontSize: '24px',
            fontWeight: '500',
            letterSpacing: '0.05em'
          }}>
            Совместимость
          </h2>
        </div>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '12px',
          justifyContent: 'center'
        }}>
          {profile.compatibility_signs.map((sign, index) => (
            <div
              key={index}
              style={{
                padding: '16px 28px',
                background: 'linear-gradient(135deg, rgba(244, 114, 182, 0.3) 0%, rgba(236, 72, 153, 0.3) 100%)',
                border: '1px solid rgba(244, 114, 182, 0.4)',
                borderRadius: '20px',
                color: '#FBCFE8',
                fontSize: '18px',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(244, 114, 182, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {sign}
            </div>
          ))}
        </div>
      </div>

      {showDeleteModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '24px',
            animation: 'fadeIn 0.3s ease-out'
          }}
          onClick={handleCancelDelete}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(15, 12, 41, 0.95) 0%, rgba(48, 43, 99, 0.95) 50%, rgba(36, 36, 62, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '40px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 100px rgba(239, 68, 68, 0.3)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              position: 'relative',
              animation: 'slideUp 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCancelDelete}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: '#E9D5FF'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <X size={18} />
            </button>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)',
                border: '2px solid rgba(239, 68, 68, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                animation: 'pulse 2s infinite'
              }}>
                <AlertTriangle size={40} color="#FCA5A5" />
              </div>

              <h2 style={{
                fontSize: '28px',
                fontWeight: '600',
                color: '#FCA5A5',
                marginBottom: '12px',
                letterSpacing: '0.02em'
              }}>
                Удалить профиль?
              </h2>

              <p style={{
                fontSize: '16px',
                color: '#E9D5FF',
                lineHeight: '1.6',
                marginBottom: '32px',
                opacity: 0.9
              }}>
                Вы уверены, что хотите удалить свой астрологический профиль? Это действие нельзя будет отменить.
              </p>

              <div style={{
                display: 'flex',
                gap: '12px',
                width: '100%'
              }}>
                <button
                  onClick={handleCancelDelete}
                  style={{
                    flex: 1,
                    padding: '14px 24px',
                    borderRadius: '12px',
                    border: '2px solid rgba(167, 139, 250, 0.4)',
                    background: 'rgba(30, 27, 75, 0.6)',
                    backdropFilter: 'blur(10px)',
                    color: '#E9D5FF',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(30, 27, 75, 0.9)';
                    e.currentTarget.style.borderColor = 'rgba(167, 139, 250, 0.6)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(30, 27, 75, 0.6)';
                    e.currentTarget.style.borderColor = 'rgba(167, 139, 250, 0.4)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Отмена
                </button>

                <button
                  onClick={handleConfirmDelete}
                  style={{
                    flex: 1,
                    padding: '14px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                    color: '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(239, 68, 68, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
                  }}
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(50px) scale(0.9); 
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1); 
          }
        }
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
          }
          50% { 
            transform: scale(1.05);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
