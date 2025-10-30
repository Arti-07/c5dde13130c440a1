import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Eye, Map } from 'lucide-react';
import { getAllSavedRoadmaps, deleteSavedRoadmap, type SavedRoadmap } from '../../api/savedRoadmaps';

export function SavedRoadmapsList() {
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState<SavedRoadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRoadmaps();
  }, []);

  const loadRoadmaps = async () => {
    try {
      setLoading(true);
      const data = await getAllSavedRoadmaps();
      setRoadmaps(data.roadmaps);
    } catch (err: any) {
      setError('Ошибка загрузки roadmaps');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roadmapId: string, professionTitle: string) => {
    if (!confirm(`Удалить roadmap "${professionTitle}"?`)) return;

    try {
      await deleteSavedRoadmap(roadmapId);
      setRoadmaps(roadmaps.filter(r => r.id !== roadmapId));
    } catch (err) {
      alert('Ошибка при удалении');
    }
  };

  const handleView = (roadmap: SavedRoadmap) => {
    navigate('/roadmap', { state: { savedRoadmap: roadmap.roadmap } });
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          fontSize: '18px',
          color: '#6B7280',
        }}>
          Загрузка roadmaps...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#E5E7EB',
      padding: '24px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '24px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1F2937',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <Map size={32} color="#667eea" />
            Мои Roadmaps
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6B7280',
            margin: 0,
          }}>
            {roadmaps.length === 0 
              ? 'У вас пока нет сохранённых roadmaps' 
              : `Всего roadmaps: ${roadmaps.length}`
            }
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#FEE2E2',
            border: '2px solid #EF4444',
            color: '#DC2626',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '24px',
          }}>
            {error}
          </div>
        )}

        {roadmaps.length === 0 ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '48px',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{
              fontSize: '64px',
              marginBottom: '16px',
            }}>
              🗺️
            </div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: '8px',
            }}>
              Нет сохранённых roadmaps
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#6B7280',
              marginBottom: '24px',
            }}>
              Создайте свой первый roadmap для начала карьерного пути
            </p>
            <button
              onClick={() => navigate('/roadmap')}
              style={{
                backgroundColor: '#000000',
                color: '#FFFFFF',
                padding: '12px 32px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1F2937';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#000000';
              }}
            >
              Создать Roadmap
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '20px',
          }}>
            {roadmaps.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
                }}
                onClick={() => handleView(item)}
              >
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1F2937',
                  marginBottom: '12px',
                  lineHeight: '1.4',
                }}>
                  {item.profession_title}
                </h3>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  marginBottom: '16px',
                }}>
                  <div style={{
                    fontSize: '13px',
                    color: '#9CA3AF',
                  }}>
                    Создано: {new Date(item.created_at).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#9CA3AF',
                  }}>
                    Обновлено: {new Date(item.updated_at).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '8px',
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleView(item);
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: '#667eea',
                      color: '#FFFFFF',
                      padding: '10px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#5568d3';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#667eea';
                    }}
                  >
                    <Eye size={16} />
                    Открыть
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id, item.profession_title);
                    }}
                    style={{
                      backgroundColor: '#F3F4F6',
                      color: '#EF4444',
                      padding: '10px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FEE2E2';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#F3F4F6';
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

