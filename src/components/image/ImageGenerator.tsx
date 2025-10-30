import { useState, useEffect } from 'react';
import { generateImage, getStyles, checkServiceStatus } from '../../api/image';
import type { StyleInfo } from '../../types/image';

const SIZE_PRESETS = [
  { name: 'Квадрат (1:1)', width: 1024, height: 1024 },
  { name: 'Портрет (2:3)', width: 704, height: 1024 },
  { name: 'Альбом (3:2)', width: 1024, height: 704 },
  { name: 'Вертикальное (9:16)', width: 576, height: 1024 },
  { name: 'Горизонтальное (16:9)', width: 1024, height: 576 }
];

export function ImageGenerator() {
  const token = localStorage.getItem('access_token');
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [styles, setStyles] = useState<StyleInfo[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serviceAvailable, setServiceAvailable] = useState(true);

  useEffect(() => {
    loadStyles();
    checkStatus();
  }, []);

  const loadStyles = async () => {
    if (!token) return;
    try {
      const data = await getStyles(token);
      setStyles(data.styles);
    } catch (err) {
      console.error('Ошибка загрузки стилей:', err);
    }
  };

  const checkStatus = async () => {
    if (!token) return;
    try {
      const status = await checkServiceStatus(token);
      setServiceAvailable(status.available);
      if (!status.available) {
        setError(status.status);
      }
    } catch (err) {
      console.error('Ошибка проверки статуса:', err);
    }
  };

  const handleGenerate = async () => {
    if (!token) return;
    if (!prompt.trim()) {
      setError('Введите описание изображения');
      return;
    }

    if (prompt.length > 1000) {
      setError('Описание не должно превышать 1000 символов');
      return;
    }

    setLoading(true);
    setError(null);
    setImage(null);

    try {
      const preset = SIZE_PRESETS[selectedSize];
      const result = await generateImage(token, {
        prompt,
        width: preset.width,
        height: preset.height,
        style: selectedStyle || null,
        negative_prompt: negativePrompt || null
      });

      setImage(result.image_base64);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при генерации');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${image}`;
    link.download = `generated-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F9FAFB',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          marginBottom: '8px',
          color: '#111827'
        }}>
          🎨 Генератор изображений AI
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#6B7280',
          marginBottom: '32px'
        }}>
          Создавайте уникальные изображения с помощью искусственного интеллекта
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32px'
        }}>
          {/* Форма */}
          <div>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#374151'
              }}>
                Описание изображения *
              </label>
              <textarea
                value={prompt}
                onChange={(e) => {
                  if (e.target.value.length <= 1000) {
                    setPrompt(e.target.value);
                  }
                }}
                placeholder="Например: Космический корабль в стиле ретро-футуризма"
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  marginBottom: '4px',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{
                fontSize: '12px',
                color: '#9CA3AF',
                textAlign: 'right',
                marginBottom: '16px'
              }}>
                {prompt.length}/1000
              </div>

              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#374151'
              }}>
                Негативный промпт (что НЕ должно быть)
              </label>
              <textarea
                value={negativePrompt}
                onChange={(e) => {
                  if (e.target.value.length <= 1000) {
                    setNegativePrompt(e.target.value);
                  }
                }}
                placeholder="Например: размытость, низкое качество"
                rows={2}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  marginBottom: '16px',
                  boxSizing: 'border-box'
                }}
              />

              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#374151'
              }}>
                Размер изображения
              </label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  marginBottom: '16px',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                {SIZE_PRESETS.map((preset, index) => (
                  <option key={index} value={index}>
                    {preset.name} - {preset.width}x{preset.height}
                  </option>
                ))}
              </select>

              {styles.length > 0 && (
                <>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: '#374151'
                  }}>
                    Стиль (опционально)
                  </label>
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      marginBottom: '16px',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">Без стиля</option>
                    {styles.map((style) => (
                      <option key={style.name} value={style.name}>
                        {style.title}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {!serviceAvailable && (
                <div style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '16px',
                  color: '#991B1B',
                  fontSize: '14px'
                }}>
                  ⚠️ Сервис временно недоступен
                </div>
              )}

              {error && (
                <div style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '16px',
                  color: '#991B1B',
                  fontSize: '14px'
                }}>
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading || !serviceAvailable || !prompt.trim()}
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  backgroundColor: loading || !serviceAvailable || !prompt.trim() ? '#9CA3AF' : '#000000',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading || !serviceAvailable || !prompt.trim() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {loading ? '⏳ Генерация... (1-2 минуты)' : '🎨 Сгенерировать изображение'}
              </button>

              <div style={{
                marginTop: '12px',
                fontSize: '12px',
                color: '#6B7280',
                textAlign: 'center'
              }}>
                ⏱️ Генерация обычно занимает 1-2 минуты
              </div>
            </div>
          </div>

          {/* Результат */}
          <div>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {loading && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '48px',
                    marginBottom: '16px',
                    animation: 'spin 2s linear infinite'
                  }}>
                    🎨
                  </div>
                  <p style={{
                    fontSize: '16px',
                    color: '#6B7280',
                    marginBottom: '8px'
                  }}>
                    Создаём ваше изображение...
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: '#9CA3AF'
                  }}>
                    Это может занять 1-2 минуты
                  </p>
                </div>
              )}

              {!loading && !image && (
                <div style={{ textAlign: 'center', color: '#9CA3AF' }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>🖼️</div>
                  <p style={{ fontSize: '16px' }}>
                    Сгенерированное изображение появится здесь
                  </p>
                </div>
              )}

              {!loading && image && (
                <div style={{ width: '100%' }}>
                  <img
                    src={`data:image/png;base64,${image}`}
                    alt="Generated"
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '8px',
                      marginBottom: '16px'
                    }}
                  />
                  <button
                    onClick={handleDownload}
                    style={{
                      width: '100%',
                      padding: '12px 24px',
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    💾 Скачать изображение
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
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

