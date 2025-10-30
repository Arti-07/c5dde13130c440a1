import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Sparkles, ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight } from 'lucide-react';
import type { 
  AmbientsGenerateResponse, 
  AmbientEnvironment,
  AmbientEnvironmentWithMedia 
} from '../../types/vibe';
import { 
  generateProfessionAmbients, 
  generateMediaForAmbient,
} from '../../api/vibe';

const BASE_URL = 'http://127.0.0.1:8000';

export function AmbientViewer() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [textData, setTextData] = useState<AmbientsGenerateResponse | null>(null);
  const [ambientsWithMedia, setAmbientsWithMedia] = useState<AmbientEnvironmentWithMedia[]>([]);
  const [mediaLoadingStatus, setMediaLoadingStatus] = useState<{ [key: string]: boolean }>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showFinalChoice, setShowFinalChoice] = useState(false);
  
  // Refs для аудио элементов
  const soundRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
  const voiceRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
  
  // Ref для защиты от двойного вызова
  const isGenerating = useRef(false);
  
  // Получаем данные из location state
  const { professionTitle, questionAnswers, useTemplate } = location.state || {};

  useEffect(() => {
    if (!professionTitle || !questionAnswers) {
      setError('Недостаточно данных для генерации окружений');
      setLoading(false);
      return;
    }

    // Защита от двойного вызова (React.StrictMode в dev режиме)
    if (isGenerating.current) {
      console.log('Generation already in progress, skipping...');
      return;
    }

    isGenerating.current = true;
    generateAmbients();
  }, [professionTitle, questionAnswers]);

  const generateAmbients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Шаг 1: Получаем текст и промпты (быстро)
      const result = await generateProfessionAmbients(
        professionTitle,
        questionAnswers
      );
      
      setTextData(result);
      
      // Инициализируем окружения с текстом
      const initialAmbients: AmbientEnvironmentWithMedia[] = result.ambients.map(amb => ({
        id: amb.id,
        name: amb.name,
        text: amb.text,
        image_prompt: amb.image_prompt,
        sound_prompt: amb.sound_prompt,
        voice: amb.voice,
        image_path: undefined,
        sound_path: undefined,
        voice_path: undefined,
        image_error: undefined,
        sound_error: undefined,
        voice_error: undefined,
      }));
      
      setAmbientsWithMedia(initialAmbients);
      setLoading(false);
      
      // Шаг 2: Запускаем генерацию медиа в фоне
      generateMediaForAmbients(result.ambients);
      
    } catch (err: any) {
      setError(err.message || 'Ошибка генерации окружений');
      setLoading(false);
    }
  };

  const generateMediaForAmbients = async (ambients: AmbientEnvironment[]) => {
    // Генерируем медиа для каждого окружения последовательно
    for (const ambient of ambients) {
      // Помечаем как загружающееся
      setMediaLoadingStatus(prev => ({ ...prev, [ambient.id]: true }));
      
      try {
        const mediaResult = await generateMediaForAmbient({
          ambient_id: ambient.id,
          image_prompt: ambient.image_prompt,
          sound_prompt: ambient.sound_prompt,
          voice_text: ambient.voice,
          use_template: useTemplate || false
        });
        
        // Обновляем окружение с медиа
        setAmbientsWithMedia(prev => prev.map(a => 
          a.id === ambient.id 
            ? {
                ...a,
                image_path: mediaResult.image_path,
                image_error: mediaResult.image_error,
                sound_path: mediaResult.sound_path,
                sound_error: mediaResult.sound_error,
                voice_path: mediaResult.voice_path,
                voice_error: mediaResult.voice_error,
              }
            : a
        ));
        
      } catch (err: any) {
        console.error(`Failed to generate media for ambient ${ambient.id}:`, err);
        // Помечаем все медиа как ошибочные
        setAmbientsWithMedia(prev => prev.map(a => 
          a.id === ambient.id 
            ? {
                ...a,
                image_error: ambient.image_prompt ? 'Ошибка генерации' : undefined,
                sound_error: ambient.sound_prompt ? 'Ошибка генерации' : undefined,
                voice_error: ambient.voice ? 'Ошибка генерации' : undefined,
              }
            : a
        ));
      } finally {
        setMediaLoadingStatus(prev => ({ ...prev, [ambient.id]: false }));
      }
    }
  };

  const getFullMediaUrl = (mediaPath?: string): string | null => {
    if (!mediaPath) {
      console.log('getFullMediaUrl: mediaPath is empty or undefined');
      return null;
    }
    
    console.log('getFullMediaUrl: Input mediaPath:', JSON.stringify(mediaPath), 'type:', typeof mediaPath);
    const token = localStorage.getItem('access_token');
    const pathParts = mediaPath.split('/');
    console.log('getFullMediaUrl: pathParts:', JSON.stringify(pathParts), 'length:', pathParts.length);
    
    if (pathParts.length < 3) {
      console.error('getFullMediaUrl: Invalid path format! Expected format: "ambients/TYPE/filename", got:', mediaPath);
      return null;
    }
    
    // Проверяем что все части не пустые
    if (!pathParts[1] || !pathParts[2]) {
      console.error('getFullMediaUrl: Path parts are empty! parts[1]:', pathParts[1], 'parts[2]:', pathParts[2]);
      return null;
    }
    
    const mediaType = pathParts[1];  // "images", "sounds", "voices"
    const filename = pathParts[2];   // "img_xxx.jpg"
    const url = `${BASE_URL}/vibe/media/${mediaType}/${filename}?token=${token}`;
    console.log('getFullMediaUrl: Generated URL:', url);
    return url;
  };


  const goToNext = () => {
    if (isAnimating) return;
    
    // If on the last card, show final choice
    if (currentIndex === ambientsWithMedia.length - 1) {
      setShowFinalChoice(true);
      return;
    }
    
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setIsAnimating(false);
    }, 400);
  };

  const goToPrev = () => {
    if (isAnimating || currentIndex <= 0) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(prev => prev - 1);
      setIsAnimating(false);
    }, 400);
  };

  const handlePositiveVibe = () => {
    console.log('Positive vibe clicked!');
    // TODO: Implement positive vibe logic
  };

  const handleNegativeVibe = () => {
    console.log('Negative vibe clicked!');
    // TODO: Implement negative vibe logic
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
          <div style={{
            display: 'inline-block',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px'
          }}>
            <Sparkles size={48} color="#FFFFFF" />
          </div>
          <h2 style={{ 
            color: '#FFFFFF', 
            fontSize: '24px',
            fontWeight: '400',
            marginBottom: '8px'
          }}>
            Создаем окружения...
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
            Генерируем тексты и промпты для профессии
          </p>
        </div>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
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
          maxWidth: '500px',
          width: '100%',
          padding: '40px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ 
            color: '#FFFFFF', 
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '16px'
          }}>
            Ошибка
          </h2>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            marginBottom: '24px',
            lineHeight: '1.5'
          }}>
            {error}
          </p>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: '12px 32px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            Назад
          </button>
        </div>
      </div>
    );
  }

  if (!textData || ambientsWithMedia.length === 0) {
    return null;
  }

  const hasMediaLoading = Object.values(mediaLoadingStatus).some(Boolean);

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background effects like vibe page */}
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

      {/* Header */}
      <header style={{
        backgroundColor: 'transparent',
        padding: '32px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 100,
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

        <div style={{ textAlign: 'center' }}>
          <h1 style={{ 
            color: '#FFFFFF', 
            fontSize: '28px',
            fontWeight: '700',
            margin: 0,
            letterSpacing: '0.02em'
          }}>
            {textData.profession_title}
          </h1>
          {hasMediaLoading && (
            <span style={{ 
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '13px',
              fontStyle: 'italic',
              animation: 'pulse 2s infinite',
              marginTop: '4px',
              display: 'block'
            }}>
              ⏳ Генерация медиа...
            </span>
          )}
        </div>

        <div style={{ width: '120px' }} />
      </header>

      {/* Main Content Area */}
      <main style={{
        padding: '40px 48px',
        maxWidth: '1400px',
        width: '100%',
        margin: '0 auto',
        position: 'relative',
        zIndex: 100
      }}>
        {showFinalChoice ? (
          /* Final Choice Screen */
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '48px',
            padding: '100px 20px',
            minHeight: '70vh',
            justifyContent: 'center'
          }}>
            <div style={{ textAlign: 'center', animation: 'fadeIn 0.6s ease-out' }}>
              <div style={{
                display: 'inline-block',
                animation: 'pulse 2s ease-in-out infinite',
                marginBottom: '32px'
              }}>
                <Sparkles size={72} color="#A78BFA" />
              </div>
              <h2 style={{
                fontSize: '42px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '20px',
                letterSpacing: '0.02em'
              }}>
                Все окружения просмотрены!
              </h2>
              <p style={{
                fontSize: '20px',
                color: 'rgba(255, 255, 255, 0.7)',
                maxWidth: '650px',
                lineHeight: '1.6'
              }}>
                Как тебе вайб этой профессии? Поделись своим впечатлением
              </p>
            </div>

            <div style={{
              display: 'flex',
              gap: '40px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={handleNegativeVibe}
                style={{
                  padding: '32px 56px',
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.15) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '2px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: '24px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  minWidth: '220px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(239, 68, 68, 0.4)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(220, 38, 38, 0.25) 100%)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.15) 100%)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                }}
              >
                <ThumbsDown size={56} color="#EF4444" strokeWidth={2} />
                <span style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#FCA5A5',
                  letterSpacing: '0.02em'
                }}>
                  Минус вайб
                </span>
              </button>

              <button
                onClick={handlePositiveVibe}
                style={{
                  padding: '32px 56px',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '2px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '24px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  minWidth: '220px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(16, 185, 129, 0.4)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.25) 100%)';
                  e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)';
                  e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)';
                }}
              >
                <ThumbsUp size={56} color="#10B981" strokeWidth={2} />
                <span style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#6EE7B7',
                  letterSpacing: '0.02em'
                }}>
                  Плюс вайб
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* Card Container with Navigation */
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '32px',
            minHeight: '70vh',
            position: 'relative'
          }}>
            {/* Left Navigation Button */}
            <button
              onClick={goToPrev}
              disabled={currentIndex === 0 || isAnimating}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: currentIndex === 0 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: currentIndex === 0 ? 'rgba(255, 255, 255, 0.3)' : '#FFFFFF',
                cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                boxShadow: currentIndex === 0 ? 'none' : '0 4px 20px rgba(0, 0, 0, 0.3)',
                flexShrink: 0,
                opacity: currentIndex === 0 ? 0.4 : 1
              }}
              onMouseEnter={(e) => {
                if (currentIndex > 0 && !isAnimating) {
                  e.currentTarget.style.background = 'rgba(102, 126, 234, 0.3)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
              }}
            >
              <ChevronLeft size={32} strokeWidth={2.5} />
            </button>

            {/* Card Display Area */}
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '900px',
              minHeight: '600px'
            }}>
              {ambientsWithMedia.map((ambient, index) => {
                const isMediaLoading = mediaLoadingStatus[ambient.id];
                
                if (index !== currentIndex) return null;
                
                return (
                  <div
                    key={ambient.id}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      animation: isAnimating ? 'none' : 'fadeIn 0.5s ease-out',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: '32px',
                      padding: '56px',
                      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      maxHeight: '75vh',
                      overflowY: 'auto'
                    }}>
                      {/* Card Header */}
                      <div style={{ marginBottom: '36px' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          marginBottom: '20px'
                        }}>
                          <span style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '22px',
                            fontWeight: '700',
                            flexShrink: 0,
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                          }}>
                            {index + 1}
                          </span>
                          <h2 style={{
                            color: '#FFFFFF',
                            fontSize: '34px',
                            fontWeight: '700',
                            margin: 0,
                            flex: 1,
                            letterSpacing: '0.02em'
                          }}>
                            {ambient.name}
                          </h2>
                          {isMediaLoading && (
                            <span style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '13px',
                              fontStyle: 'italic',
                              animation: 'pulse 2s infinite',
                              background: 'rgba(102, 126, 234, 0.2)',
                              padding: '8px 14px',
                              borderRadius: '8px',
                              border: '1px solid rgba(102, 126, 234, 0.3)'
                            }}>
                              ⏳ Загрузка...
                            </span>
                          )}
                        </div>
                        <p style={{
                          color: 'rgba(255, 255, 255, 0.85)',
                          fontSize: '19px',
                          lineHeight: '1.7',
                          margin: 0
                        }}>
                          {ambient.text}
                        </p>
                      </div>

                      {/* Image */}
                      {(ambient.image_prompt || ambient.image_path) && (
                        <div style={{ marginBottom: '36px' }}>
                          {isMediaLoading && !ambient.image_path && !ambient.image_error ? (
                            <div style={{
                              background: 'rgba(102, 126, 234, 0.1)',
                              borderRadius: '20px',
                              padding: '56px',
                              textAlign: 'center',
                              border: '1px solid rgba(102, 126, 234, 0.2)'
                            }}>
                              <div style={{
                                display: 'inline-block',
                                width: '56px',
                                height: '56px',
                                border: '4px solid rgba(102, 126, 234, 0.3)',
                                borderTopColor: '#667eea',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                marginBottom: '20px'
                              }} />
                              <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0, fontWeight: '500', fontSize: '16px' }}>
                                Генерируется изображение...
                              </p>
                            </div>
                          ) : ambient.image_error ? (
                            <div style={{
                              background: 'rgba(239, 68, 68, 0.15)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '16px',
                              padding: '20px',
                              color: '#FCA5A5'
                            }}>
                              Ошибка: {ambient.image_error}
                            </div>
                          ) : ambient.image_path ? (
                            <img
                              src={getFullMediaUrl(ambient.image_path) || ''}
                              alt={ambient.name}
                              style={{
                                width: '100%',
                                borderRadius: '20px',
                                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                              }}
                            />
                          ) : null}
                        </div>
                      )}

                      {/* Sound */}
                      {(ambient.sound_prompt || ambient.sound_path) && (
                        <div style={{ marginBottom: '36px' }}>
                          {isMediaLoading && !ambient.sound_path && !ambient.sound_error ? (
                            <div style={{
                              background: 'rgba(102, 126, 234, 0.1)',
                              borderRadius: '20px',
                              padding: '56px',
                              textAlign: 'center',
                              border: '1px solid rgba(102, 126, 234, 0.2)'
                            }}>
                              <div style={{
                                display: 'inline-block',
                                width: '56px',
                                height: '56px',
                                border: '4px solid rgba(102, 126, 234, 0.3)',
                                borderTopColor: '#667eea',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                marginBottom: '20px'
                              }} />
                              <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0, fontWeight: '500', fontSize: '16px' }}>
                                Генерируется звук...
                              </p>
                            </div>
                          ) : ambient.sound_error ? (
                            <div style={{
                              background: 'rgba(239, 68, 68, 0.15)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '16px',
                              padding: '20px',
                              color: '#FCA5A5'
                            }}>
                              Ошибка: {ambient.sound_error}
                            </div>
                          ) : ambient.sound_path ? (
                            <div style={{
                              background: 'rgba(139, 92, 246, 0.1)',
                              border: '1px solid rgba(139, 92, 246, 0.3)',
                              borderRadius: '20px',
                              padding: '24px'
                            }}>
                              <audio
                                ref={(el) => {
                                  soundRefs.current[ambient.id] = el;
                                }}
                                src={getFullMediaUrl(ambient.sound_path) || ''}
                                controls
                                style={{
                                  width: '100%',
                                  height: '48px',
                                  borderRadius: '12px',
                                  outline: 'none'
                                }}
                              />
                            </div>
                          ) : null}
                        </div>
                      )}

                      {/* Voice */}
                      {ambient.voice && (
                        <div>
                          <div style={{
                            background: 'rgba(167, 139, 250, 0.15)',
                            border: '1px solid rgba(167, 139, 250, 0.3)',
                            borderRadius: '20px',
                            padding: '28px',
                            marginBottom: '24px'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '12px'
                            }}>
                              <span style={{ fontSize: '24px', flexShrink: 0 }}>🗣️</span>
                              <p style={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '18px',
                                fontStyle: 'italic',
                                margin: 0,
                                lineHeight: '1.7',
                                flex: 1
                              }}>
                                "{ambient.voice}"
                              </p>
                            </div>
                          </div>
                          {isMediaLoading && !ambient.voice_path && !ambient.voice_error ? (
                            <div style={{
                              background: 'rgba(102, 126, 234, 0.1)',
                              borderRadius: '20px',
                              padding: '56px',
                              textAlign: 'center',
                              border: '1px solid rgba(102, 126, 234, 0.2)'
                            }}>
                              <div style={{
                                display: 'inline-block',
                                width: '56px',
                                height: '56px',
                                border: '4px solid rgba(102, 126, 234, 0.3)',
                                borderTopColor: '#667eea',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                marginBottom: '20px'
                              }} />
                              <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0, fontWeight: '500', fontSize: '16px' }}>
                                Генерируется голос...
                              </p>
                            </div>
                          ) : ambient.voice_error ? (
                            <div style={{
                              background: 'rgba(239, 68, 68, 0.15)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '16px',
                              padding: '20px',
                              color: '#FCA5A5'
                            }}>
                              Ошибка: {ambient.voice_error}
                            </div>
                          ) : ambient.voice_path ? (
                            <div style={{
                              background: 'rgba(167, 139, 250, 0.1)',
                              border: '1px solid rgba(167, 139, 250, 0.3)',
                              borderRadius: '20px',
                              padding: '24px'
                            }}>
                              <audio
                                ref={(el) => {
                                  voiceRefs.current[ambient.id] = el;
                                }}
                                src={getFullMediaUrl(ambient.voice_path) || ''}
                                controls
                                style={{
                                  width: '100%',
                                  height: '48px',
                                  borderRadius: '12px',
                                  outline: 'none'
                                }}
                              />
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Navigation Button */}
            <button
              onClick={goToNext}
              disabled={isAnimating}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                cursor: isAnimating ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                flexShrink: 0,
                opacity: isAnimating ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (!isAnimating) {
                  e.currentTarget.style.background = 'rgba(102, 126, 234, 0.3)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
              }}
            >
              <ChevronRight size={32} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </main>

      {/* Progress Counter */}
      {!showFinalChoice && (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          position: 'relative',
          zIndex: 100
        }}>
          <div style={{
            display: 'inline-flex',
            gap: '8px',
            padding: '10px 20px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '24px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {ambientsWithMedia.map((_, index) => (
              <div
                key={index}
                style={{
                  width: index === currentIndex ? '28px' : '10px',
                  height: '10px',
                  borderRadius: '5px',
                  background: index <= currentIndex 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.4s ease',
                  boxShadow: index === currentIndex ? '0 2px 8px rgba(102, 126, 234, 0.4)' : 'none'
                }}
              />
            ))}
          </div>
          <p style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '14px',
            marginTop: '14px',
            marginBottom: 0,
            fontWeight: '500'
          }}>
            {currentIndex + 1} из {ambientsWithMedia.length}
          </p>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
