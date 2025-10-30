import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2, Clock, Code, TrendingUp, Award, Users, BookOpen, CheckCircle, XCircle, Briefcase } from 'lucide-react';
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
      case 'career_path':
        return <CareerPathCard content={card.content} />;
      case 'market_overview':
        return <MarketOverviewCard content={card.content} />;
      case 'skills':
        return <SkillsCard content={card.content} />;
      case 'education':
        return <EducationCard content={card.content} />;
      case 'pros_cons':
        return <ProsConsCard content={card.content} />;
      case 'work_environment':
        return <WorkEnvironmentCard content={card.content} />;
      case 'typical_projects':
        return <TypicalProjectsCard content={card.content} />;
      default:
        return <div>Неизвестный тип карточки</div>;
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
            marginBottom: '32px',
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
          gap: '12px',
          marginBottom: '32px',
          overflowX: 'auto',
          paddingBottom: '8px',
          scrollbarWidth: 'none',
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
              <span style={{ fontSize: '20px' }}>{card.icon}</span>
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '32px',
                  paddingBottom: '24px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                }}>
                  <span style={{ fontSize: '48px' }}>{professionData.cards[activeCard].icon}</span>
                  <h2 style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    margin: 0,
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
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
    {content.schedule?.map((item: any, index: number) => (
      <div key={index} style={{
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        transition: 'all 0.3s ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      >
        <span style={{ fontSize: '32px' }}>{item.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Clock size={16} color="#A78BFA" />
            <span style={{ color: '#A78BFA', fontWeight: '600', fontSize: '14px' }}>{item.time}</span>
          </div>
          <h3 style={{ fontWeight: '600', fontSize: '18px', marginBottom: '4px', color: '#FFFFFF' }}>{item.activity}</h3>
          {item.description && <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>{item.description}</p>}
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
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          {category.icon && <span style={{ fontSize: '28px' }}>{category.icon}</span>}
          <h3 style={{ fontWeight: '600', fontSize: '18px', color: '#FFFFFF' }}>{category.name}</h3>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {category.items?.map((item: string, itemIndex: number) => (
            <span
              key={itemIndex}
              style={{
                padding: '8px 16px',
                background: 'rgba(102, 126, 234, 0.15)',
                color: '#C4B5FD',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '500',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                transition: 'all 0.2s ease',
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CompanyValueCard = ({ content }: { content: any }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
    {content.metrics?.map((metric: any, index: number) => (
      <div key={index} style={{
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span style={{ fontSize: '28px' }}>{metric.icon}</span>
          <span style={{ fontSize: '28px', fontWeight: '700', color: '#10B981' }}>{metric.value}</span>
        </div>
        <h3 style={{ fontWeight: '600', marginBottom: '4px', color: '#FFFFFF' }}>{metric.metric}</h3>
        {metric.description && <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>{metric.description}</p>}
      </div>
    ))}
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CareerPathCard = ({ content }: { content: any }) => (
  <div className="space-y-4">
    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
    {content.levels?.map((level: any, index: number) => (
      <div key={index} className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{level.icon}</span>
          <div className="flex-1">
            <h3 className="font-semibold text-xl">{level.level}</h3>
            <p className="text-sm text-gray-400">{level.duration}</p>
          </div>
          <div className="text-right">
            <p className="text-green-400 font-semibold">{level.salary_range}</p>
          </div>
        </div>
        <p className="text-gray-300 mb-2">{level.description}</p>
        {level.responsibilities && (
          <div className="mt-2">
            <ul className="text-sm text-gray-400 space-y-1">
              {level.responsibilities.map((resp: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    ))}
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MarketOverviewCard = ({ content }: { content: any }) => (
  <div className="space-y-4">
    <div className="grid md:grid-cols-2 gap-4">
      <div className="p-4 bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-lg border border-green-500/30">
        <h3 className="font-semibold mb-2">Спрос на рынке</h3>
        <p className="text-2xl font-bold text-green-400 mb-1">{content.demand}</p>
        <p className="text-sm text-gray-300">{content.demand_description}</p>
        <p className="text-sm text-purple-400 mt-2">{content.vacancies_count}</p>
      </div>
      
      <div className="p-4 bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-lg border border-purple-500/30">
        <h3 className="font-semibold mb-2">Конкуренция</h3>
        <p className="text-2xl font-bold text-purple-400 mb-1">{content.competition}</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 bg-gray-700 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full"
              style={{ width: `${(content.competition_level / 10) * 100}%` }}
            />
          </div>
          <span className="text-sm">{content.competition_level}/10</span>
        </div>
      </div>
    </div>

    <div className="p-4 bg-gray-800/50 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className="w-5 h-5 text-green-400" />
        <h3 className="font-semibold">Потенциал роста</h3>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 bg-gray-700 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${(content.growth_potential / 10) * 100}%` }}
          />
        </div>
        <span className="text-sm text-green-400">{content.growth_potential}/10</span>
      </div>
      <p className="text-gray-300">{content.future_outlook}</p>
    </div>

    <div className="p-4 bg-gradient-to-r from-yellow-600/20 to-green-600/20 rounded-lg border border-yellow-500/30">
      <h3 className="font-semibold mb-2">Диапазон зарплат</h3>
      <p className="text-2xl font-bold text-yellow-400">{content.salary_range}</p>
    </div>
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SkillsCard = ({ content }: { content: any }) => (
  <div className="space-y-6">
    <div>
      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
        <Code className="w-5 h-5 text-purple-400" />
        Hard Skills
      </h3>
      <div className="grid md:grid-cols-2 gap-3">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {content.hard_skills?.map((skill: any, index: number) => (
          <div key={index} className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg">
            <span className="text-xl">{skill.icon}</span>
            <div className="flex-1">
              <p className="font-medium">{skill.skill}</p>
              <p className="text-xs text-gray-400">{skill.importance}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div>
      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
        <Users className="w-5 h-5 text-blue-400" />
        Soft Skills
      </h3>
      <div className="grid md:grid-cols-2 gap-3">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {content.soft_skills?.map((skill: any, index: number) => (
          <div key={index} className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg">
            <span className="text-xl">{skill.icon}</span>
            <div className="flex-1">
              <p className="font-medium">{skill.skill}</p>
              <p className="text-xs text-gray-400">{skill.importance}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EducationCard = ({ content }: { content: any }) => (
  <div className="space-y-6">
    <div className="p-4 bg-gray-800/50 rounded-lg">
      <h3 className="font-semibold mb-2 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-purple-400" />
        Формальное образование
      </h3>
      <p className="text-gray-300">{content.formal_education}</p>
    </div>

    {content.alternative_paths && (
      <div className="p-4 bg-gray-800/50 rounded-lg">
        <h3 className="font-semibold mb-3">Альтернативные пути</h3>
        <div className="flex flex-wrap gap-2">
          {content.alternative_paths.map((path: string, index: number) => (
            <span key={index} className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm border border-blue-500/30">
              {path}
            </span>
          ))}
        </div>
      </div>
    )}

    {content.courses && (
      <div className="p-4 bg-gray-800/50 rounded-lg">
        <h3 className="font-semibold mb-3">Рекомендуемые курсы</h3>
        <div className="space-y-2">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {content.courses.map((course: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
              <div>
                <p className="font-medium">{course.course}</p>
                <p className="text-sm text-gray-400">{course.platform}</p>
              </div>
              <span className="text-sm text-purple-400">{course.duration}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="p-4 bg-purple-600/20 rounded-lg border border-purple-500/30">
      <p className="text-sm text-gray-300">
        <span className="font-semibold text-purple-300">Срок обучения:</span> {content.learning_time}
      </p>
    </div>

    {content.certifications && (
      <div className="p-4 bg-gray-800/50 rounded-lg">
        <h3 className="font-semibold mb-3">Полезные сертификации</h3>
        <div className="flex flex-wrap gap-2">
          {content.certifications.map((cert: string, index: number) => (
            <span key={index} className="px-3 py-1 bg-green-600/20 text-green-300 rounded-full text-sm border border-green-500/30">
              <Award className="w-3 h-3 inline mr-1" />
              {cert}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProsConsCard = ({ content }: { content: any }) => (
  <div className="grid md:grid-cols-2 gap-6">
    <div>
      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-green-400">
        <CheckCircle className="w-5 h-5" />
        Плюсы
      </h3>
      <div className="space-y-2">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {content.pros?.map((pro: any, index: number) => (
          <div key={index} className="flex items-start gap-2 p-3 bg-green-600/10 rounded-lg border border-green-500/20">
            <span className="text-xl">{pro.icon}</span>
            <p className="flex-1 text-gray-300">{pro.text}</p>
          </div>
        ))}
      </div>
    </div>

    <div>
      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-red-400">
        <XCircle className="w-5 h-5" />
        Минусы и вызовы
      </h3>
      <div className="space-y-2">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {content.cons?.map((con: any, index: number) => (
          <div key={index} className="flex items-start gap-2 p-3 bg-red-600/10 rounded-lg border border-red-500/20">
            <span className="text-xl">{con.icon}</span>
            <p className="flex-1 text-gray-300">{con.text}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WorkEnvironmentCard = ({ content }: { content: any }) => (
  <div className="space-y-4">
    <div className="p-4 bg-gray-800/50 rounded-lg">
      <h3 className="font-semibold mb-2 flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-purple-400" />
        Рабочая обстановка
      </h3>
      <p className="text-gray-300">{content.environment}</p>
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      <div className="p-4 bg-gray-800/50 rounded-lg">
        <h3 className="font-semibold mb-2">Формат работы</h3>
        <div className="flex flex-wrap gap-2">
          {content.work_format?.map((format: string, index: number) => (
            <span key={index} className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm">
              {format}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4 bg-gray-800/50 rounded-lg">
        <h3 className="font-semibold mb-2">Размер команды</h3>
        <p className="text-gray-300">{content.team_size}</p>
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      <div className="p-4 bg-gray-800/50 rounded-lg">
        <h3 className="font-semibold mb-2">Корпоративная культура</h3>
        <p className="text-gray-300">{content.culture}</p>
      </div>

      <div className="p-4 bg-gray-800/50 rounded-lg">
        <h3 className="font-semibold mb-2">Дресс-код</h3>
        <p className="text-gray-300">{content.dress_code}</p>
      </div>
    </div>

    {content.equipment && (
      <div className="p-4 bg-purple-600/20 rounded-lg border border-purple-500/30">
        <h3 className="font-semibold mb-2">Типичное оборудование</h3>
        <p className="text-gray-300">{content.equipment}</p>
      </div>
    )}
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TypicalProjectsCard = ({ content }: { content: any }) => (
  <div className="space-y-4">
    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
    {content.projects?.map((project: any, index: number) => (
      <div key={index} className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-3xl">{project.icon}</span>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
            <p className="text-gray-300 mb-2">{project.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>Сложность: <span className="text-purple-400">{project.complexity}</span></span>
              <span>Длительность: <span className="text-purple-400">{project.duration}</span></span>
            </div>
          </div>
        </div>
        {project.technologies && (
          <div className="flex flex-wrap gap-2 mt-3">
            {project.technologies.map((tech: string, techIndex: number) => (
              <span key={techIndex} className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded text-xs border border-purple-500/30">
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
);

