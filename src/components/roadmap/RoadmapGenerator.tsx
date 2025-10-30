import { useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { generateRoadmap } from '../../api/roadmap';
import type { ProfessionRoadmap } from '../../types/roadmap';
import { RoadmapOverviewComponent } from './RoadmapOverview';
import { RoadmapTimeline } from './RoadmapTimeline';
import { MilestonesView } from './MilestonesView';
import { CertificationsView } from './CertificationsView';
import { CareerPathsView } from './CareerPathsView';

export function RoadmapGenerator() {
  const [professionTitle, setProfessionTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [roadmap, setRoadmap] = useState<ProfessionRoadmap | null>(null);
  const [activeView, setActiveView] = useState<'timeline' | 'milestones' | 'certifications' | 'paths'>('timeline');

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
    setActiveView('timeline');
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

          {/* Overview */}
          <RoadmapOverviewComponent overview={roadmap.overview} profession={roadmap.profession} />

          {/* Navigation Tabs */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '16px',
            marginBottom: '24px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
          }}>
            <button
              onClick={() => setActiveView('timeline')}
              style={{
                backgroundColor: activeView === 'timeline' ? '#000000' : '#F3F4F6',
                color: activeView === 'timeline' ? '#FFFFFF' : '#6B7280',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (activeView !== 'timeline') {
                  e.currentTarget.style.backgroundColor = '#E5E7EB';
                }
              }}
              onMouseLeave={(e) => {
                if (activeView !== 'timeline') {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                }
              }}
            >
              📅 Timeline
            </button>
            <button
              onClick={() => setActiveView('milestones')}
              style={{
                backgroundColor: activeView === 'milestones' ? '#000000' : '#F3F4F6',
                color: activeView === 'milestones' ? '#FFFFFF' : '#6B7280',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (activeView !== 'milestones') {
                  e.currentTarget.style.backgroundColor = '#E5E7EB';
                }
              }}
              onMouseLeave={(e) => {
                if (activeView !== 'milestones') {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                }
              }}
            >
              🏆 Вехи
            </button>
            <button
              onClick={() => setActiveView('certifications')}
              style={{
                backgroundColor: activeView === 'certifications' ? '#000000' : '#F3F4F6',
                color: activeView === 'certifications' ? '#FFFFFF' : '#6B7280',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (activeView !== 'certifications') {
                  e.currentTarget.style.backgroundColor = '#E5E7EB';
                }
              }}
              onMouseLeave={(e) => {
                if (activeView !== 'certifications') {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                }
              }}
            >
              📜 Сертификации
            </button>
            <button
              onClick={() => setActiveView('paths')}
              style={{
                backgroundColor: activeView === 'paths' ? '#000000' : '#F3F4F6',
                color: activeView === 'paths' ? '#FFFFFF' : '#6B7280',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (activeView !== 'paths') {
                  e.currentTarget.style.backgroundColor = '#E5E7EB';
                }
              }}
              onMouseLeave={(e) => {
                if (activeView !== 'paths') {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                }
              }}
            >
              🚀 Карьерные пути
            </button>
          </div>

          {/* Content */}
          {activeView === 'timeline' && <RoadmapTimeline stages={roadmap.stages} />}
          {activeView === 'milestones' && <MilestonesView milestones={roadmap.milestones} />}
          {activeView === 'certifications' && <CertificationsView certifications={roadmap.certifications} />}
          {activeView === 'paths' && <CareerPathsView careerPaths={roadmap.careerPaths} />}
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

