import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Search, Brain, Star, Zap, RefreshCw } from 'lucide-react';
import { generateProfessionCards } from '../../api/vibe';
import type { ProfessionCard } from '../../types/vibe';

const STORAGE_KEY = 'vibe_profession_cards';
const STORAGE_META_KEY = 'vibe_profession_meta';

// Функции для работы с localStorage
const saveProfessionsToStorage = (
  professions: ProfessionCard[], 
  hasPersonality: boolean, 
  hasAstrology: boolean
) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(professions));
    localStorage.setItem(STORAGE_META_KEY, JSON.stringify({
      hasPersonalityData: hasPersonality,
      hasAstrologyData: hasAstrology,
      timestamp: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const loadProfessionsFromStorage = (): {
  professions: ProfessionCard[];
  hasPersonalityData: boolean;
  hasAstrologyData: boolean;
} | null => {
  try {
    const professionsData = localStorage.getItem(STORAGE_KEY);
    const metaData = localStorage.getItem(STORAGE_META_KEY);
    
    if (professionsData && metaData) {
      const professions = JSON.parse(professionsData);
      const meta = JSON.parse(metaData);
      
      return {
        professions,
        hasPersonalityData: meta.hasPersonalityData,
        hasAstrologyData: meta.hasAstrologyData,
      };
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
  return null;
};

// Функция для очистки кеша (может понадобиться в будущем)
// const clearProfessionsFromStorage = () => {
//   try {
//     localStorage.removeItem(STORAGE_KEY);
//     localStorage.removeItem(STORAGE_META_KEY);
//   } catch (error) {
//     console.error('Error clearing localStorage:', error);
//   }
// };

export function VibeGenerator() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState('');
  const [customProfession, setCustomProfession] = useState('');
  const [recommendedProfessions, setRecommendedProfessions] = useState<ProfessionCard[]>([]);
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [hasPersonalityData, setHasPersonalityData] = useState(false);
  const [hasAstrologyData, setHasAstrologyData] = useState(false);
  const [isDropZoneActive, setIsDropZoneActive] = useState(false);
  const [selectedProfession, setSelectedProfession] = useState<ProfessionCard | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasGeneratedCards, setHasGeneratedCards] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    // Сначала загружаем из localStorage
    const cachedData = loadProfessionsFromStorage();
    if (cachedData && cachedData.professions.length > 0) {
      setRecommendedProfessions(cachedData.professions);
      setHasPersonalityData(cachedData.hasPersonalityData);
      setHasAstrologyData(cachedData.hasAstrologyData);
      setHasGeneratedCards(true);
      console.log('Loaded professions from cache:', cachedData.professions.length);
      // Если есть что загрузить из localStorage, не делаем запрос на сервер
      return;
    }

    // Если данных в localStorage нет — пробуем запросить с сервера
    try {
      setLoading(true);
      setError('');
      
      const response = await generateProfessionCards();
      
      setRecommendedProfessions(response.professions);
      setHasPersonalityData(response.has_personality_data);
      setHasAstrologyData(response.has_astrology_data);
      setHasGeneratedCards(true);
      
      // Сохраняем в localStorage
      saveProfessionsToStorage(
        response.professions,
        response.has_personality_data,
        response.has_astrology_data
      );
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading profession cards:', error);
      const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки карточек';
      
      // Проверяем, является ли ошибка отсутствием данных
      if (errorMessage.includes('тест личности') || errorMessage.includes('астрологический профиль')) {
        // Если нет кеша, оставляем пустой список
        setRecommendedProfessions([]);
        setHasGeneratedCards(false);
        // Если бы был cache, его бы загрузили раньше и сюда бы не попали
      } else {
        // Другие ошибки показываем
        setError(errorMessage);
      }
      
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    try {
      setRegenerating(true);
      setError('');
      
      const response = await generateProfessionCards();
      
      setRecommendedProfessions(response.professions);
      setHasPersonalityData(response.has_personality_data);
      setHasAstrologyData(response.has_astrology_data);
      setHasGeneratedCards(true);
      setSelectedProfession(null); // Сбрасываем выбранную профессию
      
      // Сохраняем новые карточки в localStorage
      saveProfessionsToStorage(
        response.professions,
        response.has_personality_data,
        response.has_astrology_data
      );
      
      setRegenerating(false);
    } catch (error) {
      console.error('Error regenerating profession cards:', error);
      const errorMessage = error instanceof Error ? error.message : 'Ошибка перегенерации карточек';
      
      if (errorMessage.includes('тест личности') || errorMessage.includes('астрологический профиль')) {
        setError('Для генерации карточек необходимо пройти тест личности или создать астрологический профиль');
      } else {
        setError(errorMessage);
      }
      
      setRegenerating(false);
    }
  };

  const handleDragStart = (cardId: string) => {
    setDraggedCard(cardId);
    setIsDropZoneActive(true);
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
    setIsDropZoneActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedCard) {
      const profession = recommendedProfessions.find(p => p.id === draggedCard);
      if (profession) {
        setSelectedProfession(profession);
      }
    }
    setDraggedCard(null);
    setIsDropZoneActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCardClick = (profession: ProfessionCard) => {
    setSelectedProfession(profession);
  };

  const handleAnalyze = async () => {
    if (!selectedProfession) return;
    
    setIsAnalyzing(true);
    
    console.log('Отправка запроса на бэк для анализа профессии:', selectedProfession.title);
    console.log('Данные пользователя:', {
      hasPersonality: hasPersonalityData,
      hasAstrology: hasAstrologyData
    });
    
    setTimeout(() => {
      setIsAnalyzing(false);
      alert(`Анализ профессии "${selectedProfession.title}" завершен! (заглушка)`);
    }, 2000);
  };

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (customProfession.trim()) {
      const customCard: ProfessionCard = {
        id: 'custom-' + Date.now(),
        title: customProfession,
        description: 'Твоя выбранная профессия - мы проанализируем её специально для тебя',
        matchScore: 100,
        basedOn: ['Личность', 'Астрология'],
        icon: '🔍',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      };
      
      setSelectedProfession(customCard);
      setCustomProfession('');
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <Sparkles size={48} color="#667eea" style={{ 
            animation: 'pulse 2s infinite',
            marginBottom: '20px'
          }} />
          <h2 style={{ 
            color: '#FFFFFF', 
            fontSize: '24px',
            fontWeight: '400'
          }}>
            Анализируем твой вайб...
          </h2>
        </div>
      </div>
    );
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
        <button
          onClick={() => navigate('/')}
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
          На главную
        </button>

        <div style={{
          textAlign: 'center',
          marginBottom: '32px',
          animation: 'fadeIn 0.8s ease-out'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '16px',
            padding: '12px 32px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '50px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Sparkles size={32} color="#667eea" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
            <h1 style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#FFFFFF',
              letterSpacing: '0.02em',
              margin: 0
            }}>
              Найди свой вайб
            </h1>
          </div>
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '18px',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            {hasGeneratedCards 
              ? 'Основываясь на твоих тестах, мы подобрали профессии, которые подходят тебе больше всего'
              : 'Введи интересующую профессию или пройди тесты для персональных рекомендаций'}
          </p>
        </div>

        {error && (
          <div style={{
            maxWidth: '800px',
            margin: '0 auto 24px',
            padding: '16px 24px',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.15) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            textAlign: 'center',
          }}>
            <p style={{ color: '#FCA5A5', margin: 0, fontSize: '14px' }}>
              {error}
            </p>
          </div>
        )}

        {!hasPersonalityData && !hasAstrologyData && !hasGeneratedCards && (
          <div style={{
            maxWidth: '800px',
            margin: '0 auto 32px',
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            textAlign: 'center',
          }}>
            <h3 style={{ color: '#FCD34D', fontSize: '18px', marginBottom: '12px', fontWeight: '600' }}>
              Получи персонализированные рекомендации
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '20px', fontSize: '14px' }}>
              Пройди тест личности или создай астрологический профиль, чтобы получить карточки профессий, подобранные специально для тебя
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/personality/test')}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                  transition: 'all 0.2s ease'
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
                Пройти тест личности
              </button>
              <button
                onClick={() => navigate('/astrology')}
                style={{
                  padding: '10px 20px',
                  background: 'rgba(167, 139, 250, 0.2)',
                  color: '#E9D5FF',
                  border: '1px solid rgba(167, 139, 250, 0.3)',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(167, 139, 250, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(167, 139, 250, 0.2)';
                }}
              >
                Создать астро-профиль
              </button>
            </div>
          </div>
        )}

        {(hasPersonalityData || hasAstrologyData) && (
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '48px',
            flexWrap: 'wrap'
          }}>
            {hasPersonalityData && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                border: '1px solid rgba(102, 126, 234, 0.3)',
              }}>
                <Brain size={20} color="#667eea" />
                <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600' }}>
                  Тест личности пройден
                </span>
              </div>
            )}
            {hasAstrologyData && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                border: '1px solid rgba(167, 139, 250, 0.3)',
              }}>
                <Star size={20} color="#A78BFA" />
                <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600' }}>
                  Астропрофиль создан
                </span>
              </div>
            )}
            {hasGeneratedCards && (
              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  background: regenerating 
                    ? 'rgba(102, 126, 234, 0.3)'
                    : 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#10B981',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: regenerating ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: regenerating ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.2)',
                }}
                onMouseEnter={(e) => {
                  if (!regenerating) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.3) 100%)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!regenerating) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.2)';
                  }
                }}
              >
                <RefreshCw 
                  size={20} 
                  style={{ 
                    animation: regenerating ? 'spin 1s linear infinite' : 'none',
                    transition: 'transform 0.3s ease'
                  }} 
                />
                {regenerating ? 'Генерируем...' : 'Перегенерировать'}
              </button>
            )}
          </div>
        )}

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{
            maxWidth: '800px',
            margin: '0 auto 48px',
            padding: '40px',
            background: isDropZoneActive 
              ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)'
              : selectedProfession 
                ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)'
                : 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: isDropZoneActive 
              ? '2px dashed rgba(102, 126, 234, 0.6)' 
              : selectedProfession
                ? '2px solid rgba(102, 126, 234, 0.4)'
                : '2px dashed rgba(255, 255, 255, 0.15)',
            transition: 'all 0.3s ease',
            textAlign: 'center',
            position: 'relative',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          {selectedProfession ? (
            <>
              <div style={{
                fontSize: '64px',
                marginBottom: '8px',
                animation: 'pulse 2s ease-in-out infinite'
              }}>
                {selectedProfession.icon}
              </div>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#FFFFFF',
                margin: '0 0 8px 0'
              }}>
                {selectedProfession.title}
              </h2>
              <p style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.7)',
                margin: '0 0 24px 0',
                maxWidth: '500px'
              }}>
                {selectedProfession.description}
              </p>
              <div style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center'
              }}>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  style={{
                    padding: '14px 32px',
                    background: isAnalyzing 
                      ? 'rgba(102, 126, 234, 0.5)' 
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  onMouseEnter={(e) => {
                    if (!isAnalyzing) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isAnalyzing) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)';
                    }
                  }}
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles size={18} style={{ animation: 'pulse 1s infinite' }} />
                      Анализируем...
                    </>
                  ) : (
                    <>
                      <Zap size={18} />
                      Узнать вайб профессии
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSelectedProfession(null)}
                  style={{
                    padding: '14px 24px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    fontSize: '14px',
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
                  Сбросить
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{
                fontSize: '48px',
                marginBottom: '8px',
                opacity: isDropZoneActive ? 1 : 0.5,
                transform: isDropZoneActive ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.3s ease'
              }}>

              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: isDropZoneActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                margin: 0
              }}>
                {isDropZoneActive 
                  ? 'Отпусти карточку здесь!' 
                  : 'Перетащи карточку сюда или кликни по ней'}
              </h3>
              <p style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.5)',
                margin: 0
              }}>
                Выбери профессию для детального анализа вайба
              </p>
            </>
          )}
        </div>

        <form onSubmit={handleCustomSearch} style={{
          maxWidth: '600px',
          margin: '0 auto 48px',
        }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
          }}>
            <div style={{
              position: 'relative',
              flex: 1,
            }}>
              <Search
                size={20}
                color="#667eea"
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1,
                }}
              />
              <input
                type="text"
                value={customProfession}
                onChange={(e) => setCustomProfession(e.target.value)}
                placeholder="Или введи интересующую профессию..."
                style={{
                  width: '100%',
                  padding: '16px 20px 16px 52px',
                  fontSize: '16px',
                  borderRadius: '16px',
                  border: '2px solid rgba(102, 126, 234, 0.3)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  color: '#FFFFFF',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.6)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.3)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
                }}
              />
            </div>
            <button
              type="submit"
              disabled={!customProfession.trim()}
              style={{
                padding: '16px 28px',
                background: customProfession.trim() 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'rgba(102, 126, 234, 0.3)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '16px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: customProfession.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                boxShadow: customProfession.trim() 
                  ? '0 8px 24px rgba(102, 126, 234, 0.4)'
                  : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                if (customProfession.trim()) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (customProfession.trim()) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)';
                }
              }}
            >
              <Search size={18} />
              Искать
            </button>
          </div>
        </form>

        {recommendedProfessions.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '40px',
          }}>
            {recommendedProfessions.map((profession, index) => (
            <div
              key={profession.id}
              draggable
              onDragStart={() => handleDragStart(profession.id)}
              onDragEnd={handleDragEnd}
              onClick={() => handleCardClick(profession)}
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '28px',
                cursor: 'grab',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                animation: `slideUp ${0.3 + index * 0.1}s ease-out`,
                opacity: draggedCard === profession.id ? 0.5 : 1,
                transform: draggedCard === profession.id ? 'scale(0.95)' : 'scale(1)',
              }}
              onMouseEnter={(e) => {
                if (draggedCard !== profession.id) {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.4)';
                  e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (draggedCard !== profession.id) {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-20%',
                width: '200px',
                height: '200px',
                background: profession.gradient,
                opacity: 0.1,
                borderRadius: '50%',
                filter: 'blur(40px)',
                pointerEvents: 'none',
              }} />

              <div style={{
                position: 'relative',
                zIndex: 1,
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}>
                  <div style={{
                    fontSize: '48px',
                    lineHeight: 1,
                  }}>
                    {profession.icon}
                  </div>
                  <div style={{
                    padding: '8px 16px',
                    background: profession.gradient,
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  }}>
                    <span style={{
                      color: '#FFFFFF',
                      fontSize: '16px',
                      fontWeight: '700',
                    }}>
                      {profession.matchScore}%
                    </span>
                  </div>
                </div>

                <h3 style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '8px',
                }}>
                  {profession.title}
                </h3>

                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: '1.6',
                  marginBottom: '16px',
                }}>
                  {profession.description}
                </p>

                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}>
                  {profession.basedOn.map((basis: string, idx: number) => (
                    <div
                      key={idx}
                      style={{
                        padding: '6px 12px',
                        background: 'rgba(102, 126, 234, 0.15)',
                        borderRadius: '8px',
                        border: '1px solid rgba(102, 126, 234, 0.3)',
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {basis === 'Личность' ? <Brain size={12} /> : <Star size={12} />}
                      {basis}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}

