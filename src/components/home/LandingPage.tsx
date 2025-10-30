import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  User,
  Briefcase,
  Brain,
  Star,
  LogOut,
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { getAllPersonalityResults } from '../../api/personality';
import { getAstrologyProfile } from '../../api/astrology';
import type { PersonalityResult } from '../../types/personality';
import type { AstrologyProfile } from '../../types/astrology';
import './LandingPage.css';

export function LandingPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [hasPersonalityTest, setHasPersonalityTest] = useState(true);
  const [hasAstrologyProfile, setHasAstrologyProfile] = useState(true);
  const [latestPersonalityResult, setLatestPersonalityResult] = useState<PersonalityResult | null>(null);
  const [astrologyProfile, setAstrologyProfile] = useState<AstrologyProfile | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const openLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    handleLogout();
  };

  useEffect(() => {
    const checkUserTests = async () => {
      try {
        const personalityData = await getAllPersonalityResults();
        const hasPersonality = personalityData && personalityData.length > 0;
        setHasPersonalityTest(hasPersonality);
        
        if (hasPersonality && personalityData.length > 0) {
          setLatestPersonalityResult(personalityData[0]);
        }

        let hasAstrology = false;
        let profileData = null;
        try {
          profileData = await getAstrologyProfile();
          hasAstrology = true;
          setAstrologyProfile(profileData);
        } catch {
          hasAstrology = false;
        }
        setHasAstrologyProfile(hasAstrology);

        if (!hasPersonality || !hasAstrology) {
          setShowWelcomeModal(true);
        }
      } catch (error) {
        console.error('Error checking user tests:', error);
      }
    };

    checkUserTests();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#E5E7EB',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
    }}>
      <div className="abstract-shape-left" />
      <div className="abstract-shape-right" />
      <div className="abstract-shape-top" />
      <div className="abstract-shape-bottom" />

      {/* Header */}
      <header style={{
        backgroundColor: 'transparent',
        padding: '20px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 100,
      }}>
        <Link 
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '20px',
            fontWeight: '500',
            color: '#000000',
            textDecoration: 'none',
          }}
        >
          <div style={{
            width: '8px',
            height: '8px',
            backgroundColor: '#000000',
            borderRadius: '50%',
          }}></div>
          <div style={{
            width: '8px',
            height: '8px',
            backgroundColor: '#000000',
            borderRadius: '50%',
          }}></div>
          <span style={{ marginLeft: '4px' }}>talentry</span>
        </Link>


        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>

          <button
            onClick={openLogoutModal}
            style={{
              backgroundColor: '#000000',              
              color: '#FFFFFF',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '400',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            <User size={16} />
            <span>{user?.username}</span>
          </button>

          <button
            onClick={openLogoutModal}
            style={{
              backgroundColor: '#F3F4F6',
              color: '#6B7280',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '400',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            <LogOut size={16} />
            Выйти
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '10px 48px 40px 48px',
        backgroundColor: 'transparent',
        position: 'relative',
        zIndex: 100,
      }}>
        <h1 className="landing-hero-title">
          Не ищи работу
          <br />
          ищи вайб
        </h1>

        <p style={{
          fontSize: '18px',
          fontWeight: '400',
          fontStyle: 'italic',
          color: '#6B7280',
          textAlign: 'center',
          lineHeight: '1.6',
          maxWidth: '900px',
          margin: '0 auto 40px auto',
        }}>
          Погрузись в реальные будни профессии и пойми, твоё это или нет
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Link
            to="/vibe"
            className="hero-cta-button"
            style={{
              backgroundColor: '#000000',
              color: '#FFFFFF',
              padding: '20px 56px',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '8px',
              textDecoration: 'none',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <span style={{
              position: 'relative',
              zIndex: 1,
              display: 'inline-block',
              transition: 'transform 0.4s ease',
            }}>
              Найти свой вайб
            </span>
            <div className="button-shine" style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
              transition: 'left 0.6s ease',
              pointerEvents: 'none',
            }} />
            <div className="button-expand" style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '0',
              height: '0',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              transform: 'translate(-50%, -50%)',
              transition: 'width 0.6s ease, height 0.6s ease',
              pointerEvents: 'none',
            }} />
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="landing-features-grid">
        {/* Feature 2 - Image Card (Jobs) */}
        <Link
          to="/jobs"
          style={{
            backgroundColor: '#D4C4B0',
            borderRadius: '16px',
            overflow: 'hidden',
            minHeight: '280px',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            position: 'relative',
          }}
        >
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(31,41,55,0.8) 0%, rgba(107,114,128,0.6) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <Briefcase size={48} color="#FFFFFF" />
            <span style={{
              color: '#FFFFFF',
              fontSize: '20px',
              fontWeight: '600',
            }}>
              Вакансии по вайбу
            </span>
          </div>
        </Link>

        {/* Feature 4 - Personality Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '24px',
            borderRadius: '20px',
            minHeight: '280px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.3)';
          }}
        >
          <div style={{
            position: 'absolute',
            right: '20px',
            top: '20px',
            width: '80px',
            height: '80px',
            opacity: 0.2,
            animation: 'float 6s ease-in-out infinite',
          }}>
            <Brain size={80} color="rgba(255, 255, 255, 0.3)" strokeWidth={1.5} />
          </div>

          <div style={{
            position: 'absolute',
            right: '10px',
            bottom: '40px',
            width: '30px',
            height: '30px',
            opacity: 0.15,
            animation: 'float 4s ease-in-out infinite',
            animationDelay: '1s',
          }}>
            <Sparkles size={30} color="rgba(255, 255, 255, 0.4)" />
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px',
            position: 'relative',
            zIndex: 1,
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Brain size={22} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF' }}>
                Тест Личности
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}>
                Узнай свой тип
              </div>
            </div>
          </div>

          {latestPersonalityResult ? (
            <>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                padding: '12px',
                borderRadius: '12px',
                marginBottom: '16px',
                position: 'relative',
                zIndex: 1,
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}>
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '6px',
                }}>
                  Последний результат:
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  letterSpacing: '2px',
                }}>
                  {latestPersonalityResult.personality_type}
                </div>
              </div>

              <div style={{ 
                marginTop: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                position: 'relative',
                zIndex: 1,
              }}>
                <Link
                  to="/personality/result"
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#667eea',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    fontWeight: '600',
                    fontSize: '14px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(4px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Посмотреть результат
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/personality/history"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    color: '#FFFFFF',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    fontWeight: '600',
                    fontSize: '14px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  История тестов
                  <ArrowRight size={18} />
                </Link>
              </div>
            </>
          ) : (
            <>
              <p style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '13px',
                lineHeight: '1.5',
                marginBottom: '20px',
                position: 'relative',
                zIndex: 1,
              }}>
                Пройди психологический тест и открой свои сильные стороны для карьеры
              </p>

              <div style={{ 
                marginTop: 'auto',
                position: 'relative',
                zIndex: 1,
              }}>
                <Link
                  to="/personality/test"
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#667eea',
                    padding: '14px 20px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    fontWeight: '600',
                    fontSize: '14px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(4px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Пройти тест
                  <ArrowRight size={18} />
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Feature 5 - Astrology Card */}
        <Link
          to="/astrology"
          style={{
            background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
            borderRadius: '20px',
            overflow: 'hidden',
            minHeight: '280px',
            position: 'relative',
            textDecoration: 'none',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 8px 32px rgba(15, 12, 41, 0.4)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(15, 12, 41, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(15, 12, 41, 0.4)';
          }}
        >
          <div style={{
            position: 'absolute',
            right: '15px',
            top: '15px',
            width: '70px',
            height: '70px',
            opacity: 0.25,
            animation: 'rotate 20s linear infinite',
          }}>
            <Star size={70} color="#A78BFA" strokeWidth={1.5} fill="rgba(167, 139, 250, 0.1)" />
          </div>

          <div style={{
            position: 'absolute',
            right: '10px',
            bottom: '40px',
            width: '25px',
            height: '25px',
            opacity: 0.2,
            animation: 'pulse 3s ease-in-out infinite',
          }}>
            <Star size={25} color="#C4B5FD" fill="rgba(196, 181, 253, 0.3)" />
          </div>

          <div style={{
            position: 'absolute',
            left: '15px',
            top: '50%',
            width: '20px',
            height: '20px',
            opacity: 0.15,
            animation: 'pulse 3s ease-in-out infinite',
            animationDelay: '1.5s',
          }}>
            <Sparkles size={20} color="#A78BFA" />
          </div>

          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(167, 139, 250, 0.15) 0%, transparent 50%),
                             radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)`,
            pointerEvents: 'none',
          }} />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px',
            position: 'relative',
            zIndex: 1,
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(167, 139, 250, 0.2)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Star size={22} color="#A78BFA" />
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#E9D5FF' }}>
                Астрология
              </div>
              <div style={{ fontSize: '12px', color: '#C4B5FD' }}>
                Космический профиль
              </div>
            </div>
          </div>

          {astrologyProfile ? (
            <>
              <div style={{
                backgroundColor: 'rgba(167, 139, 250, 0.15)',
                backdropFilter: 'blur(10px)',
                padding: '12px',
                borderRadius: '12px',
                marginBottom: '16px',
                position: 'relative',
                zIndex: 1,
                border: '1px solid rgba(167, 139, 250, 0.2)',
              }}>
                <div style={{
                  fontSize: '12px',
                  color: '#C4B5FD',
                  marginBottom: '6px',
                }}>
                  Твой профиль:
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#E9D5FF',
                  marginBottom: '4px',
                }}>
                  {astrologyProfile.zodiac_sign && `☀️ ${astrologyProfile.zodiac_sign}`}
                </div>
                {astrologyProfile.chinese_zodiac && (
                  <div style={{
                    fontSize: '14px',
                    color: '#C4B5FD',
                  }}>
                    🐉 {astrologyProfile.chinese_zodiac}
                  </div>
                )}
              </div>

              <div style={{
                marginTop: 'auto',
                backgroundColor: 'rgba(167, 139, 250, 0.2)',
                backdropFilter: 'blur(10px)',
                color: '#E9D5FF',
                padding: '14px 20px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '14px',
                fontWeight: '600',
                border: '1px solid rgba(167, 139, 250, 0.3)',
                position: 'relative',
                zIndex: 1,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(167, 139, 250, 0.3)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(167, 139, 250, 0.2)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
              >
                Посмотреть профиль
                <ArrowRight size={18} />
              </div>
            </>
          ) : (
            <>
              <p style={{
                color: '#C4B5FD',
                fontSize: '13px',
                lineHeight: '1.5',
                marginBottom: '20px',
                position: 'relative',
                zIndex: 1,
              }}>
                Узнай, что говорят звёзды о твоем карьерном пути и скрытых талантах
              </p>

              <div style={{
                marginTop: 'auto',
                backgroundColor: 'rgba(167, 139, 250, 0.2)',
                backdropFilter: 'blur(10px)',
                color: '#E9D5FF',
                padding: '14px 20px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '14px',
                fontWeight: '600',
                border: '1px solid rgba(167, 139, 250, 0.3)',
                position: 'relative',
                zIndex: 1,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(167, 139, 250, 0.3)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(167, 139, 250, 0.2)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
              >
                Создать профиль
                <ArrowRight size={18} />
              </div>
            </>
          )}
        </Link>
      </section>

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.3s ease-out',
          }}
          onClick={() => setShowWelcomeModal(false)}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.4)',
              animation: 'slideUp 0.4s ease-out',
              position: 'relative',
              color: '#ffffff',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowWelcomeModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
            >
              <X size={20} color="#ffffff" />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Sparkles size={32} color="#ffffff" />
              </div>
              <h2
                style={{
                  fontSize: '26px',
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: '12px',
                  lineHeight: '1.2',
                }}
              >
                Давай найдём твой вайб!
              </h2>
              <p
                style={{
                  fontSize: '15px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: '1.5',
                  marginBottom: '0',
                }}
              >
                Хочешь понять, каково это — работать в профессии на самом деле? Мы покажем тебе реальные будни, атмосферу и вайб каждой специальности. Но сначала познакомимся поближе!
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              {!hasPersonalityTest && (
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    padding: '16px',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <Brain size={20} />
                    <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>
                      Кто ты по вайбу?
                    </h3>
                  </div>
                  <p style={{ fontSize: '13px', opacity: 0.9, margin: '4px 0 0 0' }}>
                    Тест личности покажет твои сильные стороны и поможет найти профессии, в которых ты зайдёшь на все 100
                  </p>
                </div>
              )}

              {!hasAstrologyProfile && (
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <Star size={20} />
                    <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>
                      А что говорят звёзды?
                    </h3>
                  </div>
                  <p style={{ fontSize: '13px', opacity: 0.9, margin: '4px 0 0 0' }}>
                    Астрологический профиль раскроет твои скрытые таланты и покажет, в каких сферах вселенная на твоей стороне
                  </p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {!hasPersonalityTest && (
                <Link
                  to="/personality/test"
                  onClick={() => setShowWelcomeModal(false)}
                  style={{
                    padding: '14px 20px',
                    backgroundColor: '#ffffff',
                    color: '#667eea',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textDecoration: 'none',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Brain size={18} />
                  Пройти тест личности
                </Link>
              )}
              {!hasAstrologyProfile && (
                <Link
                  to="/astrology"
                  onClick={() => setShowWelcomeModal(false)}
                  style={{
                    padding: '14px 20px',
                    backgroundColor: '#ffffff',
                    color: '#667eea',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textDecoration: 'none',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Star size={18} />
                  Создать астро-профиль
                </Link>
              )}
              <button
                onClick={() => setShowWelcomeModal(false)}
                style={{
                  padding: '10px',
                  backgroundColor: 'transparent',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Пропустить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.2s ease-out',
          }}
          onClick={closeLogoutModal}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              animation: 'slideUp 0.3s ease-out',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeLogoutModal}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X size={20} color="#6B7280" />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  backgroundColor: '#FEE2E2',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <LogOut size={28} color="#DC2626" />
              </div>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#1F2937',
                  marginBottom: '8px',
                }}
              >
                Выйти из аккаунта?
              </h2>
              <p
                style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  lineHeight: '1.5',
                }}
              >
                Вы уверены, что хотите выйти? Вам нужно будет войти снова, чтобы получить доступ к своему аккаунту.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={closeLogoutModal}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#B91C1C';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#DC2626';
                }}
              >
                Отмена
              </button>
              <button
                onClick={confirmLogout}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  backgroundColor: '#F3F4F6',
                  color: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E5E7EB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                }}
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-15px) rotate(5deg); 
          }
        }
        @keyframes rotate {
          from { 
            transform: rotate(0deg); 
          }
          to { 
            transform: rotate(360deg); 
          }
        }
        @keyframes pulse {
          0%, 100% { 
            opacity: 0.2;
            transform: scale(1);
          }
          50% { 
            opacity: 0.4;
            transform: scale(1.1);
          }
        }
        
        .hero-cta-button:hover {
          transform: translateY(-6px) scale(1.05) !important;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4) !important;
        }
        
        .hero-cta-button:hover span {
          transform: scale(1.05);
        }
        
        .hero-cta-button:hover .button-shine {
          left: 100% !important;
        }
        
        .hero-cta-button:hover .button-expand {
          width: 300px !important;
          height: 300px !important;
        }
        
        .hero-cta-button:active {
          transform: translateY(-2px) scale(1.02) !important;
          transition: all 0.1s ease !important;
        }
      `}</style>
    </div>
  );
}

