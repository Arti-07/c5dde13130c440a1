import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2, Download } from 'lucide-react';
import { generateRoadmap } from '../../api/roadmap';
import type { ProfessionRoadmap } from '../../types/roadmap';
import { RoadmapOverviewComponent } from './RoadmapOverview';
import { RoadmapTimeline } from './RoadmapTimeline';
import { exportRoadmapToPDF } from '../../utils/exportRoadmapToPDF';

export function RoadmapGenerator() {
  const location = useLocation();
  const [professionTitle, setProfessionTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [roadmap, setRoadmap] = useState<ProfessionRoadmap | null>(null);

  // Проверяем, пришли ли мы из списка сохранённых
  useEffect(() => {
    if (location.state?.savedRoadmap) {
      setRoadmap(location.state.savedRoadmap);
    }
  }, [location.state]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!professionTitle.trim()) {
      setError('Пожалуйста, введите название профессии');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await generateRoadmap(professionTitle);
      setRoadmap(response.roadmap);
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при генерации roadmap. Попробуйте снова.');
      console.error('Error generating roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setRoadmap(null);
    setProfessionTitle('');
    setError('');
  };

  if (roadmap) {
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
                           radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.15) 0%, transparent 40%)`,
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
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}>
            <button
              onClick={handleBack}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <ArrowLeft size={20} color="#FFFFFF" />
            </button>

            {/* Кнопка экспорта в PDF */}
            <button
              onClick={() => exportRoadmapToPDF(roadmap)}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#FFFFFF',
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.3)';
              }}
            >
              <Download size={18} />
              Скачать PDF
            </button>
          </div>

          {/* Overview */}
          <RoadmapOverviewComponent overview={roadmap.overview} profession={roadmap.profession} />

          {/* Content */}
          <RoadmapTimeline stages={roadmap.stages} />
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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
                         radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.15) 0%, transparent 40%)`,
        pointerEvents: 'none'
      }} />

      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '48px',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        zIndex: 1,
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#FFFFFF',
          marginBottom: '12px',
          textAlign: 'center',
        }}>
          Создать Roadmap
        </h1>

        <p style={{
          fontSize: '16px',
          color: 'rgba(255, 255, 255, 0.8)',
          textAlign: 'center',
          lineHeight: '1.6',
          marginBottom: '32px',
        }}>
          Получи персонализированный план развития в выбранной профессии на основе твоей личности и астрологии
        </p>

        <form onSubmit={handleGenerate}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#FFFFFF',
              marginBottom: '8px',
            }}>
              Профессия
            </label>
            <input
              type="text"
              value={professionTitle}
              onChange={(e) => setProfessionTitle(e.target.value)}
              placeholder="Например: Backend Python разработчик"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '15px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                outline: 'none',
                transition: 'all 0.2s ease',
                backgroundColor: loading ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            />
          </div>

          {error && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              border: '2px solid #EF4444',
              color: '#FCA5A5',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '14px',
              marginBottom: '20px',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? 'rgba(156, 163, 175, 0.3)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#FFFFFF',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: loading ? 'none' : '0 4px 16px rgba(102, 126, 234, 0.3)',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.3)';
              }
            }}
          >
            {loading ? (
              <>
                <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Генерируем твой roadmap...</span>
              </>
            ) : (
              <span>Создать Roadmap</span>
            )}
          </button>

          {loading && (
            <p style={{
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.6)',
              textAlign: 'center',
              marginTop: '16px',
              fontStyle: 'italic',
            }}>
              💡 Это может занять до 30 секунд
            </p>
          )}
        </form>
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

