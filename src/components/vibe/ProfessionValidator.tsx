import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Loader, Info } from 'lucide-react';
import { validateProfession } from '../../api/vibe';
import type { ProfessionValidateResponse } from '../../types/vibe';
import { GameLoadingModal } from '../ui/GameLoadingModal';

interface ProfessionValidatorProps {
  professionTitle: string;
  onValidationComplete: (isValid: boolean, validationData: ProfessionValidateResponse) => void;
  onCancel: () => void;
}

export function ProfessionValidator({ 
  professionTitle, 
  onValidationComplete, 
  onCancel 
}: ProfessionValidatorProps) {
  const [loading, setLoading] = useState(true);
  const [validationResult, setValidationResult] = useState<ProfessionValidateResponse | null>(null);
  const [error, setError] = useState('');
  const [showGameModal, setShowGameModal] = useState(false);

  useEffect(() => {
    performValidation();
  }, []);

  const performValidation = async () => {
    try {
      setLoading(true);
      setShowGameModal(true);
      setError('');
      
      const result = await validateProfession(professionTitle);
      setValidationResult(result);
      setLoading(false);
      setShowGameModal(false);
    } catch (error) {
      console.error('Validation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Ошибка валидации';
      setError(errorMessage);
      setLoading(false);
      setShowGameModal(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle2 size={48} color="#10B981" />;
      case 'rare':
        return <Info size={48} color="#F59E0B" />;
      case 'invalid':
      case 'obsolete':
        return <XCircle size={48} color="#EF4444" />;
      case 'too_general':
        return <AlertTriangle size={48} color="#F59E0B" />;
      default:
        return <AlertTriangle size={48} color="#6B7280" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return {
          bg: 'rgba(16, 185, 129, 0.15)',
          border: 'rgba(16, 185, 129, 0.3)',
          text: '#10B981'
        };
      case 'rare':
        return {
          bg: 'rgba(245, 158, 11, 0.15)',
          border: 'rgba(245, 158, 11, 0.3)',
          text: '#F59E0B'
        };
      case 'invalid':
      case 'obsolete':
        return {
          bg: 'rgba(239, 68, 68, 0.15)',
          border: 'rgba(239, 68, 68, 0.3)',
          text: '#EF4444'
        };
      case 'too_general':
        return {
          bg: 'rgba(245, 158, 11, 0.15)',
          border: 'rgba(245, 158, 11, 0.3)',
          text: '#F59E0B'
        };
      default:
        return {
          bg: 'rgba(107, 114, 128, 0.15)',
          border: 'rgba(107, 114, 128, 0.3)',
          text: '#9CA3AF'
        };
    }
  };

  const handleContinue = () => {
    if (validationResult) {
      onValidationComplete(validationResult.is_valid, validationResult);
    }
  };

  const handleBack = () => {
    onCancel();
  };

  return (
    <>
      {!loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
          <div style={{
            maxWidth: '600px',
            width: '100%',
            background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.98) 0%, rgba(22, 33, 62, 0.98) 100%)',
            borderRadius: '24px',
            padding: '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.5)',
            animation: 'modalSlideIn 0.3s ease-out',
          }}>
            {error ? (
          <div style={{ textAlign: 'center' }}>
            <XCircle size={48} color="#EF4444" style={{ marginBottom: '20px' }} />
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#FFFFFF',
              marginBottom: '12px',
            }}>
              Ошибка валидации
            </h2>
            <p style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '32px',
            }}>
              {error}
            </p>
            <button
              onClick={handleBack}
              style={{
                padding: '12px 32px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              Назад
            </button>
          </div>
        ) : validationResult ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '20px' }}>
              {getStatusIcon(validationResult.status)}
            </div>
            
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#FFFFFF',
              marginBottom: '12px',
            }}>
              {validationResult.status === 'valid' ? 'Профессия подтверждена!' : 
               validationResult.status === 'rare' ? 'Редкая профессия' :
               validationResult.status === 'too_general' ? 'Слишком общее название' :
               'Профессия не найдена'}
            </h2>

            <div style={{
              padding: '16px 20px',
              background: getStatusColor(validationResult.status).bg,
              border: `1px solid ${getStatusColor(validationResult.status).border}`,
              borderRadius: '12px',
              marginBottom: '24px',
            }}>
              <p style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.9)',
                margin: 0,
                lineHeight: '1.6',
              }}>
                {validationResult.message}
              </p>
            </div>

            {validationResult.hh_total_found > 0 && (
              <div style={{
                padding: '16px',
                background: 'rgba(102, 126, 234, 0.1)',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                borderRadius: '12px',
                marginBottom: '24px',
              }}>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '8px',
                }}>
                  Найдено вакансий на HH.ru: <strong style={{ color: '#FFFFFF' }}>{validationResult.hh_total_found}</strong>
                </p>
                {validationResult.sample_vacancies.length > 0 && (
                  <div style={{
                    marginTop: '12px',
                    textAlign: 'left',
                  }}>
                    <p style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '8px',
                    }}>
                      Примеры вакансий:
                    </p>
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                    }}>
                      {validationResult.sample_vacancies.slice(0, 3).map((vacancy, idx) => (
                        <li key={idx} style={{
                          fontSize: '13px',
                          color: 'rgba(255, 255, 255, 0.8)',
                          marginBottom: '4px',
                          paddingLeft: '12px',
                          position: 'relative',
                        }}>
                          <span style={{
                            position: 'absolute',
                            left: 0,
                            color: '#667eea',
                          }}>•</span>
                          {vacancy}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {validationResult.suggestions.length > 0 && (
              <div style={{
                padding: '16px',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: '12px',
                marginBottom: '24px',
                textAlign: 'left',
              }}>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '8px',
                }}>
                  Возможные альтернативы:
                </p>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                }}>
                  {validationResult.suggestions.map((suggestion, idx) => (
                    <li key={idx} style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.9)',
                      marginBottom: '4px',
                      paddingLeft: '12px',
                      position: 'relative',
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        color: '#F59E0B',
                      }}>→</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              marginTop: '32px',
            }}>
              {(validationResult.is_valid || validationResult.status === 'rare') && (
                <button
                  onClick={handleContinue}
                  style={{
                    padding: '14px 32px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)';
                  }}
                >
                  Продолжить анализ
                </button>
              )}
              <button
                onClick={handleBack}
                style={{
                  padding: '14px 32px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                {validationResult.is_valid || validationResult.status === 'rare' ? 'Изменить профессию' : 'Выбрать другую'}
              </button>
            </div>
          </div>
        ) : null}
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalSlideIn {
          from { 
            opacity: 0; 
            transform: translateY(-20px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <GameLoadingModal
        open={showGameModal}
        onClose={() => {}}
        title="Проверяем профессию"
        subtitle={`Анализируем рынок труда для "${professionTitle}"`}
      />
    </>
  );
}

