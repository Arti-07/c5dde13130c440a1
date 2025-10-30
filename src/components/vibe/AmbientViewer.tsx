import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
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

  const playSound = (ambientId: string, soundPath?: string) => {
    if (!soundPath) return;
    
    const audio = soundRefs.current[ambientId];
    if (audio) {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  };

  const handleVoiceHover = (ambientId: string) => {
    const audio = voiceRefs.current[ambientId];
    if (audio && audio.paused) {
      audio.play();
    }
  };

  const playVoice = (ambientId: string) => {
    const audio = voiceRefs.current[ambientId];
    if (audio) {
      audio.currentTime = 0;
      audio.play();
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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '40px 24px 80px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `radial-gradient(circle at 30% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
                         radial-gradient(circle at 70% 80%, rgba(244, 114, 182, 0.3) 0%, transparent 50%)`,
        pointerEvents: 'none'
      }} />

      <div style={{ 
        maxWidth: '900px', 
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '32px',
            padding: '12px 24px',
            cursor: 'pointer',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: '500',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
          }}
        >
          <ArrowLeft size={20} />
          Назад
        </button>

        {/* Title */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}>
          <h1 style={{ 
            color: '#FFFFFF', 
            fontSize: '36px',
            fontWeight: '700',
            marginBottom: '12px',
            textAlign: 'center'
          }}>
            {textData.profession_title}
          </h1>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            fontSize: '16px',
            textAlign: 'center',
            marginBottom: '0'
          }}>
            Погрузитесь в атмосферу профессии через иммерсивные окружения
          </p>
          
          {hasMediaLoading && (
            <div style={{
              marginTop: '16px',
              padding: '12px 20px',
              background: 'rgba(59, 130, 246, 0.2)',
              borderRadius: '12px',
              display: 'inline-block',
              width: '100%',
              textAlign: 'center'
            }}>
              <span style={{ 
                color: '#FFFFFF',
                fontSize: '14px',
                animation: 'pulse 2s infinite'
              }}>
                ⏳ Генерация медиа в процессе...
              </span>
            </div>
          )}
        </div>

        {/* Ambients - вертикально */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {ambientsWithMedia.map((ambient, index) => {
            const isMediaLoading = mediaLoadingStatus[ambient.id];
            
            return (
              <div key={ambient.id} style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}>
                {/* Ambient Header */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    <span style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontSize: '18px',
                      fontWeight: '600'
                    }}>
                      {index + 1}
                    </span>
                    <h2 style={{ 
                      color: '#FFFFFF', 
                      fontSize: '24px',
                      fontWeight: '600',
                      margin: 0
                    }}>
                      {ambient.name}
                    </h2>
                    {isMediaLoading && (
                      <span style={{
                        marginLeft: 'auto',
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                        animation: 'pulse 2s infinite'
                      }}>
                        ⏳ Загрузка...
                      </span>
                    )}
                  </div>
                  <p style={{ 
                    color: 'rgba(255, 255, 255, 0.95)', 
                    fontSize: '16px',
                    lineHeight: '1.7',
                    margin: 0
                  }}>
                    {ambient.text}
                  </p>
                </div>

                {/* Image */}
                {(ambient.image_prompt || ambient.image_path) && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ 
                      color: '#FFFFFF', 
                      fontSize: '16px',
                      fontWeight: '600',
                      marginBottom: '12px'
                    }}>
                      🖼️ Визуальное окружение
                    </h3>
                    {isMediaLoading && !ambient.image_path && !ambient.image_error ? (
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '40px',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          display: 'inline-block',
                          width: '40px',
                          height: '40px',
                          border: '3px solid rgba(255, 255, 255, 0.3)',
                          borderTopColor: '#FFFFFF',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                          marginBottom: '12px'
                        }} />
                        <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                          Генерируется изображение...
                        </p>
                      </div>
                    ) : ambient.image_error ? (
                      <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '12px',
                        padding: '16px',
                        color: 'rgba(255, 255, 255, 0.9)'
                      }}>
                        Ошибка: {ambient.image_error}
                      </div>
                    ) : ambient.image_path ? (
                      <img 
                        src={getFullMediaUrl(ambient.image_path) || ''}
                        alt={ambient.name}
                        style={{
                          width: '100%',
                          borderRadius: '12px',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                        }}
                      />
                    ) : null}
                  </div>
                )}

                {/* Sound */}
                {(ambient.sound_prompt || ambient.sound_path) && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ 
                      color: '#FFFFFF', 
                      fontSize: '16px',
                      fontWeight: '600',
                      marginBottom: '12px'
                    }}>
                      🔊 Звуковое окружение
                    </h3>
                    {isMediaLoading && !ambient.sound_path && !ambient.sound_error ? (
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '40px',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          display: 'inline-block',
                          width: '40px',
                          height: '40px',
                          border: '3px solid rgba(255, 255, 255, 0.3)',
                          borderTopColor: '#FFFFFF',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                          marginBottom: '12px'
                        }} />
                        <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                          Генерируется звук...
                        </p>
                      </div>
                    ) : ambient.sound_error ? (
                      <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '12px',
                        padding: '16px',
                        color: 'rgba(255, 255, 255, 0.9)'
                      }}>
                        Ошибка: {ambient.sound_error}
                      </div>
                    ) : ambient.sound_path ? (
                      <>
                        {ambient.sound_prompt && (
                          <p style={{ 
                            color: 'rgba(255, 255, 255, 0.8)', 
                            fontSize: '14px',
                            marginBottom: '12px'
                          }}>
                            {ambient.sound_prompt}
                          </p>
                        )}
                        <audio
                          ref={(el) => {
                            soundRefs.current[ambient.id] = el;
                          }}
                          src={getFullMediaUrl(ambient.sound_path) || ''}
                          loop
                          controls
                          style={{
                            width: '100%',
                            marginBottom: '12px'
                          }}
                        />
                        <button
                          onClick={() => playSound(ambient.id, ambient.sound_path)}
                          style={{
                            padding: '10px 20px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '8px',
                            color: '#FFFFFF',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                          }}
                        >
                          {soundRefs.current[ambient.id]?.paused ? '▶️ Воспроизвести' : '⏸️ Пауза'}
                        </button>
                      </>
                    ) : null}
                  </div>
                )}

                {/* Voice */}
                {ambient.voice && (
                  <div>
                    <h3 style={{ 
                      color: '#FFFFFF', 
                      fontSize: '16px',
                      fontWeight: '600',
                      marginBottom: '12px'
                    }}>
                      🗣️ Голос из окружения
                    </h3>
                    <div style={{
                      background: 'rgba(167, 139, 250, 0.1)',
                      border: '1px solid rgba(167, 139, 250, 0.3)',
                      borderRadius: '12px',
                      padding: '16px',
                      marginBottom: '12px'
                    }}>
                      <p style={{ 
                        color: '#FFFFFF', 
                        fontSize: '15px',
                        fontStyle: 'italic',
                        margin: 0
                      }}>
                        "{ambient.voice}"
                      </p>
                    </div>
                    {isMediaLoading && !ambient.voice_path && !ambient.voice_error ? (
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '40px',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          display: 'inline-block',
                          width: '40px',
                          height: '40px',
                          border: '3px solid rgba(255, 255, 255, 0.3)',
                          borderTopColor: '#FFFFFF',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                          marginBottom: '12px'
                        }} />
                        <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                          Генерируется голос...
                        </p>
                      </div>
                    ) : ambient.voice_error ? (
                      <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '12px',
                        padding: '16px',
                        color: 'rgba(255, 255, 255, 0.9)'
                      }}>
                        Ошибка: {ambient.voice_error}
                      </div>
                    ) : ambient.voice_path ? (
                      <>
                        <audio
                          ref={(el) => {
                            voiceRefs.current[ambient.id] = el;
                          }}
                          src={getFullMediaUrl(ambient.voice_path) || ''}
                          controls
                          style={{
                            width: '100%',
                            marginBottom: '12px'
                          }}
                          onMouseEnter={() => handleVoiceHover(ambient.id)}
                        />
                        <button
                          onClick={() => playVoice(ambient.id)}
                          style={{
                            padding: '10px 20px',
                            background: 'rgba(167, 139, 250, 0.3)',
                            border: '1px solid rgba(167, 139, 250, 0.5)',
                            borderRadius: '8px',
                            color: '#FFFFFF',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(167, 139, 250, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(167, 139, 250, 0.3)';
                          }}
                        >
                          🔊 Воспроизвести голос
                        </button>
                        <p style={{ 
                          color: 'rgba(255, 255, 255, 0.6)', 
                          fontSize: '12px',
                          marginTop: '8px',
                          marginBottom: 0
                        }}>
                          Наведите на плеер для автовоспроизведения
                        </p>
                      </>
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Tools Section */}
        <div style={{
          marginTop: '32px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}>
          <h2 style={{ 
            color: '#FFFFFF', 
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '20px'
          }}>
            {textData.tools.title}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '12px'
          }}>
            {textData.tools.items.map((tool, index) => (
              <div key={index} style={{
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                color: 'rgba(255, 255, 255, 0.95)',
                fontSize: '14px',
                lineHeight: '1.4'
              }}>
                {tool}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
