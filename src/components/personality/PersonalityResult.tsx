import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Brain, Zap, TrendingUp, AlertTriangle, Briefcase, History, RefreshCw, ArrowLeft } from 'lucide-react';
import type { PersonalityResult as ResultType } from '../../types/personality';
import { getLatestPersonalityResult } from '../../api/personality';

export function PersonalityResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState<ResultType | null>(
    location.state?.result || null
  );
  const [loading, setLoading] = useState(!location.state?.result);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!location.state?.result) {
      loadLatestResult();
    }
  }, []);

  const loadLatestResult = async () => {
    try {
      const data = await getLatestPersonalityResult();
      setResult(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки результата');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <Brain size={48} color="#FFFFFF" style={{ 
            animation: 'pulse 2s infinite',
            marginBottom: '20px'
          }} />
          <h2 style={{ 
            color: '#FFFFFF', 
            fontSize: '24px',
            fontWeight: '400'
          }}>
            Загрузка результата...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '24px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '40px',
          borderRadius: '24px',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <AlertTriangle size={48} color="#DC2626" style={{ marginBottom: '16px' }} />
          <p style={{ color: '#DC2626', marginBottom: '24px', fontSize: '18px' }}>{error}</p>
          <button 
            onClick={() => navigate('/personality/test')}
            style={{
              padding: '12px 32px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
            }}
          >
            Пройти тест
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return <div>Результат не найден</div>;
  }

  const traitColors = [
    { bg: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', light: 'rgba(59, 130, 246, 0.1)' },
    { bg: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', light: 'rgba(245, 158, 11, 0.1)' },
    { bg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', light: 'rgba(16, 185, 129, 0.1)' },
    { bg: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', light: 'rgba(139, 92, 246, 0.1)' },
    { bg: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)', light: 'rgba(236, 72, 153, 0.1)' },
  ];

  const traits = [
    { label: 'Интроверсия / Экстраверсия', score: result.mind_score, color: traitColors[0] },
    { label: 'Сенсорика / Интуиция', score: result.energy_score, color: traitColors[1] },
    { label: 'Чувства / Мышление', score: result.nature_score, color: traitColors[2] },
    { label: 'Восприятие / Суждение', score: result.tactics_score, color: traitColors[3] },
    { label: 'Уверенность / Турбулентность', score: result.identity_score, color: traitColors[4] },
  ];

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '40px 24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.15) 0%, transparent 40%),
                         radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.15) 0%, transparent 40%),
                         radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`,
        pointerEvents: 'none'
      }} />
      
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 8s ease-in-out infinite',
        pointerEvents: 'none'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '5%',
        width: '250px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 10s ease-in-out infinite reverse',
        pointerEvents: 'none'
      }} />

      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            textDecoration: 'none',
            color: '#667eea',
            fontSize: '15px',
            fontWeight: '500',
            marginBottom: '24px',
            border: '2px solid rgba(102, 126, 234, 0.2)',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
            e.currentTarget.style.transform = 'translateX(-4px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
          }}
        >
          <ArrowLeft size={18} />
          На главную
        </Link>

        <div style={{
          textAlign: 'center',
          marginBottom: '48px',
          animation: 'fadeIn 0.8s ease-out'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
            padding: '16px 32px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '50px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Brain size={32} color="#667eea" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
            <h1 style={{
              fontSize: '32px',
              fontWeight: '600',
              color: '#FFFFFF',
              letterSpacing: '0.02em',
              margin: 0
            }}>
              Ваш Тип Личности
            </h1>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '32px',
          padding: '60px 48px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          marginBottom: '40px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            pointerEvents: 'none'
          }} />
          
          <div style={{
            position: 'relative',
            zIndex: 1,
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px'
          }}>
            <div style={{
              padding: '24px 48px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '24px',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4), inset 0 -2px 8px rgba(0, 0, 0, 0.2)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)'
              }} />
              <h2 style={{
                fontSize: '64px',
                fontWeight: '800',
                color: '#FFFFFF',
                margin: 0,
                letterSpacing: '0.15em',
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
              }}>
                {result.code}
              </h2>
            </div>
            
            <div>
              <h3 style={{
                fontSize: '36px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}>
                {result.personality_type}
              </h3>
              <p style={{
                fontSize: '18px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontStyle: 'italic',
                maxWidth: '700px',
                margin: '0 auto',
                lineHeight: '1.7'
              }}>
                "{result.description}"
              </p>
            </div>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '32px',
          padding: '48px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          marginBottom: '40px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '40px'
          }}>
            <div style={{
              padding: '12px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
              borderRadius: '16px',
              border: '1px solid rgba(102, 126, 234, 0.3)'
            }}>
              <Brain size={28} color="#667eea" />
            </div>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#FFFFFF',
              margin: 0
            }}>
              Показатели личности
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {traits.map((trait, index) => (
              <div key={index} style={{
                padding: '28px',
                background: `linear-gradient(135deg, ${trait.color.bg.replace('linear-gradient(135deg, ', '').replace(')', '')}15)`,
                borderRadius: '20px',
                border: `1px solid ${trait.color.bg.match(/#[A-F0-9]{6}/i)?.[0]}40`,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(8px)';
                e.currentTarget.style.boxShadow = `0 12px 32px ${trait.color.bg.match(/#[A-F0-9]{6}/i)?.[0]}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
              }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <span style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#FFFFFF'
                  }}>
                    {trait.label}
                  </span>
                  <div style={{
                    padding: '8px 20px',
                    background: trait.color.bg,
                    borderRadius: '12px',
                    boxShadow: `0 4px 12px ${trait.color.bg.match(/#[A-F0-9]{6}/i)?.[0]}60`
                  }}>
                    <span style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#FFFFFF'
                    }}>
                      {trait.score}%
                    </span>
                  </div>
                </div>
                <div style={{
                  width: '100%',
                  height: '12px',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)'
                }}>
                  <div style={{
                    width: `${trait.score}%`,
                    height: '100%',
                    background: trait.color.bg,
                    borderRadius: '6px',
                    transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: `0 0 20px ${trait.color.bg.match(/#[A-F0-9]{6}/i)?.[0]}80`,
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                      animation: 'shimmer 2s infinite'
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '28px',
            padding: '32px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{
                padding: '10px',
                background: 'rgba(16, 185, 129, 0.2)',
                borderRadius: '12px',
                border: '1px solid rgba(16, 185, 129, 0.4)'
              }}>
                <Zap size={24} color="#10B981" />
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#FFFFFF',
                margin: 0
              }}>
                Сильные стороны
              </h3>
            </div>
            <p style={{
              color: 'rgba(255, 255, 255, 0.85)',
              lineHeight: '1.8',
              fontSize: '16px'
            }}>
              {result.strengths}
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: '28px',
            padding: '32px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{
                padding: '10px',
                background: 'rgba(251, 191, 36, 0.2)',
                borderRadius: '12px',
                border: '1px solid rgba(251, 191, 36, 0.4)'
              }}>
                <TrendingUp size={24} color="#F59E0B" />
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#FFFFFF',
                margin: 0
              }}>
                Области развития
              </h3>
            </div>
            <p style={{
              color: 'rgba(255, 255, 255, 0.85)',
              lineHeight: '1.8',
              fontSize: '16px'
            }}>
              {result.weaknesses}
            </p>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '28px',
          padding: '40px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          marginBottom: '40px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div style={{
              padding: '10px',
              background: 'rgba(102, 126, 234, 0.2)',
              borderRadius: '12px',
              border: '1px solid rgba(102, 126, 234, 0.4)'
            }}>
              <Briefcase size={24} color="#667eea" />
            </div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#FFFFFF',
              margin: 0
            }}>
              Карьерные рекомендации
            </h3>
          </div>
          <p style={{
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '1.8',
            fontSize: '16px',
            marginBottom: '24px'
          }}>
            {result.career_advice}
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '12px'
          }}>
            {result.careers.map((career, index) => (
              <div
              key={index}
              style={{
                padding: '16px',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                borderRadius: '12px',
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '15px',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {career}
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '28px',
          padding: '40px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{
              padding: '10px',
              background: 'rgba(102, 126, 234, 0.2)',
              borderRadius: '12px',
              border: '1px solid rgba(102, 126, 234, 0.4)'
            }}>
              <Brain size={24} color="#667eea" />
            </div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#FFFFFF',
              margin: 0
            }}>
              Полное описание
            </h3>
          </div>
          <p style={{
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '1.8',
            fontSize: '16px'
          }}>
            {result.full_description}
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: '16px',
          marginTop: '40px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <Link
            to="/personality/history"
            style={{
              padding: '16px 32px',
              background: 'rgba(255, 255, 255, 0.95)',
              border: '2px solid rgba(102, 126, 234, 0.3)',
              borderRadius: '12px',
              color: '#667eea',
              fontSize: '16px',
              fontWeight: '500',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }}
          >
            <History size={20} />
            История тестов
          </Link>
          <button
            onClick={() => navigate('/personality/test')}
            style={{
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
            }}
          >
            <RefreshCw size={20} />
            Пройти тест заново
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
