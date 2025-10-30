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
        backgroundColor: '#E5E7EB',
        padding: '24px',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          {/* Header */}
          <div style={{
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}>
              <button
                onClick={handleBack}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #E5E7EB',
                  borderRadius: '12px',
                  padding: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                  e.currentTarget.style.borderColor = '#D1D5DB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#E5E7EB';
                }}
              >
                <ArrowLeft size={20} color="#1F2937" />
              </button>
              <h1 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#1F2937',
                margin: 0,
              }}>
                Career Roadmap
              </h1>
            </div>

            {/* Кнопка экспорта в PDF */}
            <button
              onClick={() => exportRoadmapToPDF(roadmap)}
              style={{
                backgroundColor: '#000000',
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
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1F2937';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#000000';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
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
      backgroundColor: '#E5E7EB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '48px',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#1F2937',
          marginBottom: '12px',
          textAlign: 'center',
        }}>
          🗺️ Создать Career Roadmap
        </h1>

        <p style={{
          fontSize: '16px',
          color: '#6B7280',
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
              color: '#1F2937',
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
                border: '2px solid #E5E7EB',
                borderRadius: '12px',
                outline: 'none',
                transition: 'all 0.2s ease',
                backgroundColor: loading ? '#F9FAFB' : '#FFFFFF',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3B82F6';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB';
              }}
            />
          </div>

          {error && (
            <div style={{
              backgroundColor: '#FEE2E2',
              border: '2px solid #EF4444',
              color: '#DC2626',
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
              backgroundColor: loading ? '#9CA3AF' : '#000000',
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
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#1F2937';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#000000';
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
              color: '#9CA3AF',
              textAlign: 'center',
              marginTop: '16px',
              fontStyle: 'italic',
            }}>
              Это может занять до 30 секунд ⏳
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

