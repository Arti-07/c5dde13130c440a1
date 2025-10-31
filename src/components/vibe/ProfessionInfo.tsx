import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2, Clock, Code, TrendingUp, CheckCircle, XCircle, Briefcase } from 'lucide-react';
import { getProfessionInfo } from '../../api/vibe';
import type { ProfessionInfoResponse, ProfessionInfoCard } from '../../types/vibe';
import { GameLoadingModal } from '../ui/GameLoadingModal';

interface LocationState {
  professionTitle: string;
  professionDescription?: string;
}

export const ProfessionInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [professionData, setProfessionData] = useState<ProfessionInfoResponse | null>(null);
  const [activeCard, setActiveCard] = useState(0);
  const [showGameModal, setShowGameModal] = useState(false);
  
  // Защита от двойного вызова (React.StrictMode в dev режиме)
  const isGenerating = useRef(false);

  useEffect(() => {
    if (!state?.professionTitle) {
      navigate('/vibe/generate');
      return;
    }

    // Защита от двойного вызова
    if (isGenerating.current) {
      console.log('Generation already in progress, skipping...');
      return;
    }

    isGenerating.current = true;
    loadProfessionInfo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const loadProfessionInfo = async () => {
    try {
      setLoading(true);
      setShowGameModal(true);
      setError(null);

      const response = await getProfessionInfo({
        profession_title: state.professionTitle,
        profession_description: state.professionDescription,
      });

      setProfessionData(response);
      setLoading(false);
      setShowGameModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки информации');
      setLoading(false);
      setShowGameModal(false);
    } finally {
      isGenerating.current = false;
    }
  };

  const renderCardContent = (card: ProfessionInfoCard) => {
    switch (card.type) {
      case 'daily_schedule':
        return <DailyScheduleCard content={card.content} />;
      case 'tech_stack':
        return <TechStackCard content={card.content} />;
      case 'company_value':
        return <CompanyValueCard content={card.content} />;
      case 'market_overview':
        return <MarketOverviewCard content={card.content} />;
      case 'pros_cons':
        return <ProsConsCard content={card.content} />;
      case 'work_environment':
        return <WorkEnvironmentCard content={card.content} />;
      case 'typical_projects':
        return <TypicalProjectsCard content={card.content} />;
    }
  };

  if (loading || showGameModal) {
    return (
      <>
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Загрузка информации о профессии...</p>
          </div>
        </div>
        <GameLoadingModal 
          open={showGameModal} 
          onClose={() => {}}
          title="Генерация информации"
          subtitle="Создаём детальные карточки о профессии..." 
        />
      </>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Вернуться назад
          </button>
        </div>
      </div>
    );
  }

  if (!professionData) {
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '40px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background effects */}
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
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateX(-4px)';
              e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            }}
          >
            <ArrowLeft size={18} />
            Назад
          </button>

          {/* Road Map Button */}
          <button
            onClick={() => navigate('/roadmap', { 
              state: { 
                professionTitle: state.professionTitle,
                professionDescription: state.professionDescription 
              } 
            })}
            style={{
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(102, 126, 234, 0.4)',
              borderRadius: '16px',
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(4px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)';
            }}
          >
            <span>Road Map</span>
          </button>
        </div>

        {/* Title */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          animation: 'fadeIn 0.8s ease-out'
        }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '700',
            color: '#FFFFFF',
            letterSpacing: '0.02em',
            margin: 0,
            textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}>
            {professionData.profession_title}
          </h1>
        </div>

        {/* Navigation Pills */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '32px',
          justifyContent: 'center',
        }}>
          {professionData.cards.map((card, index) => (
            <button
              key={card.id}
              onClick={() => setActiveCard(index)}
              style={{
                padding: '12px 20px',
                background: activeCard === index
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: activeCard === index
                  ? '1px solid rgba(102, 126, 234, 0.4)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: activeCard === index
                  ? '0 8px 24px rgba(102, 126, 234, 0.4)'
                  : '0 4px 12px rgba(0, 0, 0, 0.2)',
              }}
              onMouseEnter={(e) => {
                if (activeCard !== index) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeCard !== index) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                }
              }}
            >
              <span>{card.title}</span>
            </button>
          ))}
        </div>

        {/* Card Content */}
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          marginBottom: '100px',
        }}>
          {professionData.cards[activeCard] && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '40px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
              animation: 'slideUp 0.5s ease-out',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Gradient background */}
              <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-20%',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(40px)',
                pointerEvents: 'none',
              }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  marginBottom: '32px',
                  paddingBottom: '24px',
                  borderBottom: '2px solid rgba(102, 126, 234, 0.3)',
                }}>
                  <h2 style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    margin: 0,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    {professionData.cards[activeCard].title}
                  </h2>
                </div>
                {renderCardContent(professionData.cards[activeCard])}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        <div style={{
          position: 'fixed',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '16px',
          zIndex: 50,
        }}>
          <button
            onClick={() => setActiveCard(Math.max(0, activeCard - 1))}
            disabled={activeCard === 0}
            style={{
              padding: '14px 32px',
              background: activeCard === 0
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              color: activeCard === 0 ? 'rgba(255, 255, 255, 0.3)' : '#FFFFFF',
              fontSize: '15px',
              fontWeight: '600',
              cursor: activeCard === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
            }}
            onMouseEnter={(e) => {
              if (activeCard !== 0) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeCard !== 0) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
              }
            }}
          >
            ← Назад
          </button>
          <button
            onClick={() => setActiveCard(Math.min(professionData.cards.length - 1, activeCard + 1))}
            disabled={activeCard === professionData.cards.length - 1}
            style={{
              padding: '14px 32px',
              background: activeCard === professionData.cards.length - 1
                ? 'rgba(102, 126, 234, 0.3)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(102, 126, 234, 0.4)',
              borderRadius: '16px',
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: '600',
              cursor: activeCard === professionData.cards.length - 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: activeCard === professionData.cards.length - 1
                ? 'none'
                : '0 8px 24px rgba(102, 126, 234, 0.4)',
            }}
            onMouseEnter={(e) => {
              if (activeCard !== professionData.cards.length - 1) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeCard !== professionData.cards.length - 1) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)';
              }
            }}
          >
            Далее →
          </button>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        /* Hide scrollbar */
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

// Card Components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DailyScheduleCard = ({ content }: { content: any }) => (
  <div style={{ 
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px' 
  }}>
    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
    {content.schedule?.map((item: any, index: number) => (
      <div key={index} style={{
        position: 'relative',
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '1px solid rgba(167, 139, 250, 0.2)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(167, 139, 250, 0.15) 0%, rgba(139, 92, 246, 0.08) 100%)';
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(167, 139, 250, 0.3)';
        e.currentTarget.style.borderColor = 'rgba(167, 139, 250, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)';
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'rgba(167, 139, 250, 0.2)';
      }}
      >
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: '60px',
          height: '60px',
          background: 'radial-gradient(circle, rgba(167, 139, 250, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(20px)',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: '12px',
            padding: '6px 12px',
            background: 'rgba(167, 139, 250, 0.2)',
            borderRadius: '8px',
            border: '1px solid rgba(167, 139, 250, 0.3)',
          }}>
            <Clock size={16} color="#A78BFA" />
            <span style={{ color: '#C4B5FD', fontWeight: '700', fontSize: '14px' }}>{item.time}</span>
          </div>
          <h3 style={{ 
            fontWeight: '700', 
            fontSize: '19px', 
            marginBottom: '8px', 
            color: '#E9D5FF',
            lineHeight: '1.3'
          }}>{item.activity}</h3>
          {item.description && <p style={{ 
            color: 'rgba(255, 255, 255, 0.7)', 
            fontSize: '14px',
            lineHeight: '1.6'
          }}>{item.description}</p>}
        </div>
      </div>
    ))}
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TechStackCard = ({ content }: { content: any }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
    {content.categories?.map((category: any, index: number) => (
      <div key={index} style={{
        position: 'relative',
        padding: '28px',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.08) 100%)';
        e.currentTarget.style.transform = 'translateX(4px)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(59, 130, 246, 0.25)';
        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)';
        e.currentTarget.style.transform = 'translateX(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.2)';
      }}
      >
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '100px',
          height: '100px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(30px)',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            marginBottom: '20px',
            paddingBottom: '12px',
            borderBottom: '2px solid rgba(59, 130, 246, 0.2)',
          }}>
            <Code size={24} color="#60A5FA" />
            <h3 style={{ fontWeight: '700', fontSize: '20px', color: '#BFDBFE' }}>{category.name}</h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {category.items?.map((item: string, itemIndex: number) => (
              <span
                key={itemIndex}
                style={{
                  padding: '10px 18px',
                  background: 'rgba(59, 130, 246, 0.2)',
                  color: '#BFDBFE',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CompanyValueCard = ({ content }: { content: any }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
    {content.metrics?.map((metric: any, index: number) => (
      <div key={index} style={{
        position: 'relative',
        padding: '28px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.06) 100%)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(5, 150, 105, 0.1) 100%)';
        e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)';
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(16, 185, 129, 0.3)';
        e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.06) 100%)';
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.25)';
      }}
      >
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '120px',
          height: '120px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ 
            display: 'inline-flex',
            padding: '12px 20px',
            background: 'rgba(16, 185, 129, 0.2)',
            borderRadius: '12px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            marginBottom: '16px',
          }}>
            <TrendingUp size={24} color="#10B981" />
          </div>
          <div style={{ 
            fontSize: '36px', 
            fontWeight: '800', 
            color: '#6EE7B7',
            marginBottom: '8px',
            textShadow: '0 2px 8px rgba(16, 185, 129, 0.4)',
          }}>{metric.value}</div>
          <h3 style={{ 
            fontWeight: '700', 
            fontSize: '18px',
            marginBottom: '8px', 
            color: '#D1FAE5'
          }}>{metric.metric}</h3>
          {metric.description && <p style={{ 
            fontSize: '14px', 
            color: 'rgba(255, 255, 255, 0.7)',
            lineHeight: '1.5'
          }}>{metric.description}</p>}
        </div>
      </div>
    ))}
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MarketOverviewCard = ({ content }: { content: any }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
      gap: '20px' 
    }}>
      <div 
        style={{
          position: 'relative',
          padding: '28px',
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(21, 128, 61, 0.08) 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.03)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(34, 197, 94, 0.3)';
          e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.3)';
        }}
      >
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '120px',
          height: '120px',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h3 style={{ 
            fontWeight: '700', 
            marginBottom: '16px', 
            color: '#D1FAE5',
            fontSize: '18px'
          }}>📊 Спрос на рынке</h3>
          <p style={{ 
            fontSize: '32px', 
            fontWeight: '800', 
            color: '#6EE7B7', 
            marginBottom: '8px',
            textShadow: '0 2px 8px rgba(34, 197, 94, 0.4)',
          }}>{content.demand}</p>
          <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.5' }}>
            {content.demand_description}
          </p>
          <p style={{ 
            fontSize: '14px', 
            color: '#C4B5FD', 
            marginTop: '12px',
            fontWeight: '600'
          }}>{content.vacancies_count}</p>
        </div>
      </div>
      
      <div 
        style={{
          position: 'relative',
          padding: '28px',
          background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(126, 34, 206, 0.08) 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(147, 51, 234, 0.3)',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.03)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(147, 51, 234, 0.3)';
          e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.3)';
        }}
      >
        <div style={{
          position: 'absolute',
          bottom: '-40px',
          left: '-40px',
          width: '120px',
          height: '120px',
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h3 style={{ 
            fontWeight: '700', 
            marginBottom: '16px', 
            color: '#E9D5FF',
            fontSize: '18px'
          }}>⚔️ Конкуренция</h3>
          <p style={{ 
            fontSize: '32px', 
            fontWeight: '800', 
            color: '#C4B5FD', 
            marginBottom: '12px',
            textShadow: '0 2px 8px rgba(147, 51, 234, 0.4)',
          }}>{content.competition}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
            <div style={{ 
              flex: 1, 
              background: 'rgba(255, 255, 255, 0.1)', 
              borderRadius: '12px', 
              height: '10px',
              overflow: 'hidden'
            }}>
              <div
                style={{ 
                  background: 'linear-gradient(90deg, #A78BFA 0%, #8B5CF6 100%)', 
                  height: '10px', 
                  borderRadius: '12px',
                  width: `${(content.competition_level / 10) * 100}%`,
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
            <span style={{ 
              fontSize: '16px', 
              fontWeight: '700',
              color: '#C4B5FD'
            }}>{content.competition_level}/10</span>
          </div>
        </div>
      </div>
    </div>

    <div 
      style={{
        position: 'relative',
        padding: '28px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
        borderRadius: '20px',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.08) 100%)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(16, 185, 129, 0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <TrendingUp size={24} color="#10B981" />
        <h3 style={{ fontWeight: '700', color: '#D1FAE5', fontSize: '18px' }}>
          Потенциал роста
        </h3>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ 
          flex: 1, 
          background: 'rgba(255, 255, 255, 0.1)', 
          borderRadius: '12px', 
          height: '10px',
          overflow: 'hidden'
        }}>
          <div
            style={{ 
              background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)', 
              height: '10px', 
              borderRadius: '12px',
              width: `${(content.growth_potential / 10) * 100}%`,
              transition: 'width 0.5s ease',
            }}
          />
        </div>
        <span style={{ 
          fontSize: '16px', 
          fontWeight: '700',
          color: '#6EE7B7'
        }}>{content.growth_potential}/10</span>
      </div>
      <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
        {content.future_outlook}
      </p>
    </div>

    <div 
      style={{
        position: 'relative',
        padding: '28px',
        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)',
        borderRadius: '20px',
        border: '1px solid rgba(251, 191, 36, 0.3)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(251, 191, 36, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{
        position: 'absolute',
        top: '50%',
        right: '-50px',
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        transform: 'translateY(-50%)',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h3 style={{ 
          fontWeight: '700', 
          marginBottom: '16px', 
          color: '#FEF3C7',
          fontSize: '18px'
        }}>💰 Диапазон зарплат</h3>
        <p style={{ 
          fontSize: '36px', 
          fontWeight: '800', 
          color: '#FCD34D',
          textShadow: '0 2px 8px rgba(251, 191, 36, 0.4)',
        }}>{content.salary_range}</p>
      </div>
    </div>
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProsConsCard = ({ content }: { content: any }) => (
  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
    gap: '24px' 
  }}>
    <div>
      <h3 style={{
        fontWeight: '700',
        fontSize: '20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: '#6EE7B7',
      }}>
        <div style={{
          padding: '10px',
          background: 'rgba(16, 185, 129, 0.2)',
          borderRadius: '10px',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          display: 'flex',
        }}>
          <CheckCircle size={20} color="#10B981" />
        </div>
        Плюсы
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {content.pros?.map((pro: any, index: number) => (
          <div 
            key={index} 
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '20px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
              borderRadius: '16px',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.08) 100%)';
              e.currentTarget.style.transform = 'translateX(4px)';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)';
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.2)';
            }}
          >
            <p style={{ 
              flex: 1, 
              color: 'rgba(255, 255, 255, 0.85)',
              lineHeight: '1.6',
              fontSize: '15px'
            }}>{pro.text}</p>
          </div>
        ))}
      </div>
    </div>

    <div>
      <h3 style={{
        fontWeight: '700',
        fontSize: '20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: '#FCA5A5',
      }}>
        <div style={{
          padding: '10px',
          background: 'rgba(239, 68, 68, 0.2)',
          borderRadius: '10px',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          display: 'flex',
        }}>
          <XCircle size={20} color="#EF4444" />
        </div>
        Минусы и вызовы
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {content.cons?.map((con: any, index: number) => (
          <div 
            key={index} 
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '20px',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
              borderRadius: '16px',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.08) 100%)';
              e.currentTarget.style.transform = 'translateX(4px)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)';
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
            }}
          >
            <p style={{ 
              flex: 1, 
              color: 'rgba(255, 255, 255, 0.85)',
              lineHeight: '1.6',
              fontSize: '15px'
            }}>{con.text}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WorkEnvironmentCard = ({ content }: { content: any }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    <div 
      style={{
        padding: '28px',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(124, 58, 237, 0.06) 100%)',
        borderRadius: '20px',
        border: '1px solid rgba(139, 92, 246, 0.25)',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.18) 0%, rgba(124, 58, 237, 0.1) 100%)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(139, 92, 246, 0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(124, 58, 237, 0.06) 100%)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <h3 style={{ 
        fontWeight: '700', 
        marginBottom: '16px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        color: '#E9D5FF',
        fontSize: '18px'
      }}>
        <Briefcase size={20} color="#A78BFA" />
        Рабочая обстановка
      </h3>
      <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>{content.environment}</p>
    </div>

    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
      gap: '20px' 
    }}>
      <div 
        style={{
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.08) 100%)';
          e.currentTarget.style.transform = 'scale(1.02)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <h3 style={{ 
          fontWeight: '700', 
          marginBottom: '16px', 
          color: '#BFDBFE',
          fontSize: '16px'
        }}>Формат работы</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {content.work_format?.map((format: string, index: number) => (
            <span 
              key={index} 
              style={{
                padding: '8px 14px',
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#BFDBFE',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '600',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              {format}
            </span>
          ))}
        </div>
      </div>

      <div 
        style={{
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.08) 100%)';
          e.currentTarget.style.transform = 'scale(1.02)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <h3 style={{ 
          fontWeight: '700', 
          marginBottom: '12px', 
          color: '#D1FAE5',
          fontSize: '16px'
        }}>Размер команды</h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>{content.team_size}</p>
      </div>
    </div>

    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
      gap: '20px' 
    }}>
      <div 
        style={{
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(219, 39, 119, 0.05) 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(236, 72, 153, 0.25)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(219, 39, 119, 0.08) 100%)';
          e.currentTarget.style.transform = 'scale(1.02)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(219, 39, 119, 0.05) 100%)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <h3 style={{ 
          fontWeight: '700', 
          marginBottom: '12px', 
          color: '#FDF2F8',
          fontSize: '16px'
        }}>Корпоративная культура</h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>{content.culture}</p>
      </div>

      <div 
        style={{
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(234, 88, 12, 0.05) 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(249, 115, 22, 0.25)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(234, 88, 12, 0.08) 100%)';
          e.currentTarget.style.transform = 'scale(1.02)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(234, 88, 12, 0.05) 100%)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <h3 style={{ 
          fontWeight: '700', 
          marginBottom: '12px', 
          color: '#FED7AA',
          fontSize: '16px'
        }}>Дресс-код</h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>{content.dress_code}</p>
      </div>
    </div>

    {content.equipment && (
      <div 
        style={{
          padding: '28px',
          background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.15) 0%, rgba(139, 92, 246, 0.08) 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(167, 139, 250, 0.3)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(167, 139, 250, 0.2) 0%, rgba(139, 92, 246, 0.12) 100%)';
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(167, 139, 250, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(167, 139, 250, 0.15) 0%, rgba(139, 92, 246, 0.08) 100%)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <h3 style={{ 
          fontWeight: '700', 
          marginBottom: '16px', 
          color: '#E9D5FF',
          fontSize: '18px'
        }}>⚙️ Типичное оборудование</h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>{content.equipment}</p>
      </div>
    )}
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TypicalProjectsCard = ({ content }: { content: any }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
    {content.projects?.map((project: any, index: number) => (
      <div 
        key={index} 
        style={{
          position: 'relative',
          padding: '32px',
          background: `linear-gradient(135deg, rgba(${index % 3 === 0 ? '59, 130, 246' : index % 3 === 1 ? '16, 185, 129' : '236, 72, 153'}, 0.1) 0%, rgba(${index % 3 === 0 ? '37, 99, 235' : index % 3 === 1 ? '5, 150, 105' : '219, 39, 119'}, 0.05) 100%)`,
          borderRadius: '20px',
          border: `1px solid rgba(${index % 3 === 0 ? '59, 130, 246' : index % 3 === 1 ? '16, 185, 129' : '236, 72, 153'}, 0.25)`,
          transition: 'all 0.3s ease',
          overflow: 'hidden',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = `linear-gradient(135deg, rgba(${index % 3 === 0 ? '59, 130, 246' : index % 3 === 1 ? '16, 185, 129' : '236, 72, 153'}, 0.15) 0%, rgba(${index % 3 === 0 ? '37, 99, 235' : index % 3 === 1 ? '5, 150, 105' : '219, 39, 119'}, 0.08) 100%)`;
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = `0 12px 32px rgba(${index % 3 === 0 ? '59, 130, 246' : index % 3 === 1 ? '16, 185, 129' : '236, 72, 153'}, 0.25)`;
          e.currentTarget.style.borderColor = `rgba(${index % 3 === 0 ? '59, 130, 246' : index % 3 === 1 ? '16, 185, 129' : '236, 72, 153'}, 0.4)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = `linear-gradient(135deg, rgba(${index % 3 === 0 ? '59, 130, 246' : index % 3 === 1 ? '16, 185, 129' : '236, 72, 153'}, 0.1) 0%, rgba(${index % 3 === 0 ? '37, 99, 235' : index % 3 === 1 ? '5, 150, 105' : '219, 39, 119'}, 0.05) 100%)`;
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = `rgba(${index % 3 === 0 ? '59, 130, 246' : index % 3 === 1 ? '16, 185, 129' : '236, 72, 153'}, 0.25)`;
        }}
      >
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          background: `radial-gradient(circle, rgba(${index % 3 === 0 ? '59, 130, 246' : index % 3 === 1 ? '16, 185, 129' : '236, 72, 153'}, 0.15) 0%, transparent 70%)`,
          borderRadius: '50%',
          filter: 'blur(40px)',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ 
              fontWeight: '800', 
              fontSize: '22px', 
              marginBottom: '12px', 
              color: index % 3 === 0 ? '#BFDBFE' : index % 3 === 1 ? '#D1FAE5' : '#FDF2F8'
            }}>{project.title}</h3>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              marginBottom: '16px',
              lineHeight: '1.6',
              fontSize: '15px'
            }}>{project.description}</p>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '20px', 
              flexWrap: 'wrap'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}>
                <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>⚡ Сложность:</span>
                <span style={{ 
                  fontSize: '14px',
                  fontWeight: '700',
                  color: index % 3 === 0 ? '#93C5FD' : index % 3 === 1 ? '#6EE7B7' : '#F9A8D4'
                }}>{project.complexity}</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}>
                <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>⏱️ Длительность:</span>
                <span style={{ 
                  fontSize: '14px',
                  fontWeight: '700',
                  color: index % 3 === 0 ? '#93C5FD' : index % 3 === 1 ? '#6EE7B7' : '#F9A8D4'
                }}>{project.duration}</span>
              </div>
            </div>
          </div>
          {project.technologies && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
              {project.technologies.map((tech: string, techIndex: number) => (
                <span 
                  key={techIndex} 
                  style={{
                    padding: '8px 14px',
                    background: `rgba(${index % 3 === 0 ? '59, 130, 246' : index % 3 === 1 ? '16, 185, 129' : '236, 72, 153'}, 0.2)`,
                    color: index % 3 === 0 ? '#BFDBFE' : index % 3 === 1 ? '#D1FAE5' : '#FDF2F8',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '600',
                    border: `1px solid rgba(${index % 3 === 0 ? '59, 130, 246' : index % 3 === 1 ? '16, 185, 129' : '236, 72, 153'}, 0.3)`,
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `rgba(${index % 3 === 0 ? '59, 130, 246' : index % 3 === 1 ? '16, 185, 129' : '236, 72, 153'}, 0.3)`;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `rgba(${index % 3 === 0 ? '59, 130, 246' : index % 3 === 1 ? '16, 185, 129' : '236, 72, 153'}, 0.2)`;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
);

