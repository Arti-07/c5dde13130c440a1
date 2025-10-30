import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { History, Calendar, Award, Brain, TrendingUp, ArrowLeft, Trash2, AlertTriangle, X } from 'lucide-react';
import type { PersonalityResult } from '../../types/personality';
import { getAllPersonalityResults, deletePersonalityResult, deleteAllPersonalityResults } from '../../api/personality';

export function PersonalityHistory() {
  const [results, setResults] = useState<PersonalityResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const data = await getAllPersonalityResults();
      setResults(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки результатов');
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteAllClick = () => {
    setShowDeleteAllModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    
    try {
      setIsDeleting(true);
      await deletePersonalityResult(deletingId);
      await loadResults();
      setShowDeleteModal(false);
      setDeletingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления результата');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmDeleteAll = async () => {
    try {
      setIsDeleting(true);
      await deleteAllPersonalityResults();
      await loadResults();
      setShowDeleteAllModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления результатов');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingId(null);
  };

  const handleCancelDeleteAll = () => {
    setShowDeleteAllModal(false);
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
          <History size={48} color="#FFFFFF" style={{ 
            animation: 'pulse 2s infinite',
            marginBottom: '20px'
          }} />
          <h2 style={{ 
            color: '#FFFFFF', 
            fontSize: '24px',
            fontWeight: '400'
          }}>
            Загрузка истории...
          </h2>
        </div>
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
        padding: '24px'
      }}>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '32px',
          borderRadius: '24px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#DC2626', marginBottom: '16px' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
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
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '48px',
          textAlign: 'center',
          maxWidth: '500px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
        }}>
          <History size={64} color="#667eea" style={{ marginBottom: '24px' }} />
          <h2 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#1F2937',
            marginBottom: '16px'
          }}>
            Нет пройденных тестов
          </h2>
          <p style={{
            color: '#6B7280',
            marginBottom: '32px',
            fontSize: '16px'
          }}>
            Начните свое путешествие к самопознанию
          </p>
          <Link
            to="/personality/test"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#FFFFFF',
              textDecoration: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '500',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s ease'
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
            <Brain size={20} />
            Пройти тест
          </Link>
        </div>
      </div>
    );
  }

  const typeColors: Record<string, string> = {
    'INTJ': 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
    'INTP': 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    'ENTJ': 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
    'ENTP': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    'INFJ': 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    'INFP': 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
    'ENFJ': 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    'ENFP': 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
    'ISTJ': 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    'ISFJ': 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
    'ESTJ': 'linear-gradient(135deg, #A855F7 0%, #9333EA 100%)',
    'ESFJ': 'linear-gradient(135deg, #F472B6 0%, #EC4899 100%)',
    'ISTP': 'linear-gradient(135deg, #64748B 0%, #475569 100%)',
    'ISFP': 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
    'ESTP': 'linear-gradient(135deg, #FB923C 0%, #F97316 100%)',
    'ESFP': 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '40px 24px',
      position: 'relative',
      overflow: 'hidden'
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
        top: '15%',
        right: '10%',
        width: '250px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 8s ease-in-out infinite',
        pointerEvents: 'none'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '10%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 10s ease-in-out infinite reverse',
        pointerEvents: 'none'
      }} />

        <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1
        }}>
            <Link
                to="/"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    color: '#667eea',
                    fontSize: '15px',
                    fontWeight: '500',
                    marginBottom: '24px',
                    border: '2px solid rgba(102, 126, 234, 0.2)',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                    e.currentTarget.style.transform = 'translateX(-4px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.3)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
            >
                <ArrowLeft size={18}/>
                На главную
            </Link>

            <div style={{
                textAlign: 'center',
                marginBottom: '48px',
                animation: 'fadeIn 0.8s ease-out'
            }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px 32px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '50px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <History size={32} color="#667eea" style={{animation: 'pulse 2s ease-in-out infinite'}}/>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '600',
                        color: '#FFFFFF',
                        letterSpacing: '0.02em',
                        margin: 0
                    }}>
                        История Тестов
                    </h1>
                </div>
            </div>
            <div style={{
                textAlign: 'center',
                marginBottom: '32px'
            }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 28px',
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
                }}>
                    <Award size={22} color="#667eea"/>
                    <span style={{
                        color: '#FFFFFF',
                        fontSize: '17px',
                        fontWeight: '600'
                    }}>
              Пройдено тестов: {results.length}
            </span>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
                gap: '28px',
                marginBottom: '40px'
            }}>
                {results.map((result, index) => {
                    const bgGradient = typeColors[result.code] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

                    return (
          <div
            key={index}
            style={{
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '28px',
                                overflow: 'hidden',
                                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                animation: `slideUp ${0.3 + index * 0.1}s ease-out`,
                                position: 'relative'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                            }}
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(result.id);
                                }}
                                style={{
                                    position: 'absolute',
                                    top: '16px',
                                    right: '16px',
                                    zIndex: 10,
                                    padding: '10px',
                                    background: 'rgba(239, 68, 68, 0.9)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(239, 68, 68, 0.5)',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(239, 68, 68, 1)';
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.5)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.9)';
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                                }}
                            >
                                <Trash2 size={18} color="#FFFFFF" />
                            </button>
                            <div style={{
                                background: bgGradient,
                                padding: '40px 32px',
                                textAlign: 'center',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '-50%',
                                    right: '-20%',
                                    width: '200px',
                                    height: '200px',
                                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                                    borderRadius: '50%',
                                    filter: 'blur(30px)',
                                    pointerEvents: 'none'
                                }}/>

                                <div style={{
                                    position: 'relative',
                                    zIndex: 1,
                                    display: 'inline-block',
                                    padding: '16px 32px',
                                    background: 'rgba(255, 255, 255, 0.15)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '16px',
                                    marginBottom: '20px',
                                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                                }}>
                                    <h3 style={{
                                        fontSize: '42px',
                                        fontWeight: '800',
                                        color: '#FFFFFF',
                                        margin: 0,
                                        letterSpacing: '0.15em',
                                        textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                                    }}>
                                        {result.code}
                                    </h3>
                                </div>
                                <h4 style={{
                                    fontSize: '22px',
                                    fontWeight: '600',
                                    color: '#FFFFFF',
                                    margin: 0,
                                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                                }}>
                                    {result.personality_type}
                                </h4>
                            </div>

                            <div style={{padding: '28px'}}>
                                <p style={{
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontSize: '14px',
                                    lineHeight: '1.6',
                                    marginBottom: '24px',
                                    fontStyle: 'italic'
                                }}>
                                    "{result.description}"
                                </p>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginBottom: '20px',
                                    padding: '12px 16px',
                                    background: 'rgba(102, 126, 234, 0.1)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(102, 126, 234, 0.2)'
                                }}>
                                    <Calendar size={16} color="#667eea"/>
                                    <span style={{
                                        fontSize: '13px',
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        fontWeight: '500'
                                    }}>
                      {new Date(result.created_at).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                      })}
                    </span>
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: '10px'
                                }}>
                                    {[
                                        {label: 'Разум', value: result.mind_score, color: '#3B82F6'},
                                        {label: 'Энергия', value: result.energy_score, color: '#F59E0B'},
                                        {label: 'Природа', value: result.nature_score, color: '#10B981'},
                                        {label: 'Тактика', value: result.tactics_score, color: '#8B5CF6'},
                                    ].map((trait, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                padding: '12px',
                                                background: `linear-gradient(135deg, ${trait.color}20, ${trait.color}10)`,
                                                borderRadius: '12px',
                                                textAlign: 'center',
                                                border: `1px solid ${trait.color}30`,
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'scale(1.05)';
                                                e.currentTarget.style.background = `linear-gradient(135deg, ${trait.color}30, ${trait.color}20)`;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'scale(1)';
                                                e.currentTarget.style.background = `linear-gradient(135deg, ${trait.color}20, ${trait.color}10)`;
                                            }}
                                        >
                                            <div style={{
                                                fontSize: '10px',
                                                color: 'rgba(255, 255, 255, 0.6)',
                                                marginBottom: '6px',
                                                fontWeight: '600',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em'
                                            }}>
                                                {trait.label}
                                            </div>
                                            <div style={{
                                                fontSize: '18px',
                                                fontWeight: '700',
                                                color: trait.color,
                                                textShadow: `0 2px 8px ${trait.color}60`
                                            }}>
                                                {trait.value}%
            </div>
          </div>
        ))}
      </div>

                                <div style={{
                                    marginTop: '16px',
                                    padding: '12px',
                                    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(236, 72, 153, 0.1))',
                                    borderRadius: '12px',
                                    textAlign: 'center',
                                    border: '1px solid rgba(236, 72, 153, 0.3)'
                                }}>
                                    <div style={{
                                        fontSize: '10px',
                                        color: 'rgba(255, 255, 255, 0.6)',
                                        marginBottom: '6px',
                                        fontWeight: '600',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        Идентичность
                                    </div>
                                    <div style={{
                                        fontSize: '18px',
                                        fontWeight: '700',
                                        color: '#EC4899',
                                        textShadow: '0 2px 8px rgba(236, 72, 153, 0.6)'
                                    }}>
                                        {result.identity_score}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                marginTop: '16px',
                flexWrap: 'wrap'
            }}>
                <Link
                    to="/personality/result"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '16px 32px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: '2px solid rgba(102, 126, 234, 0.3)',
                        borderRadius: '12px',
                        color: '#667eea',
                        textDecoration: 'none',
                        fontSize: '16px',
                        fontWeight: '500',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                    }}
                >
                    <Award size={20}/>
                    Последний результат
                </Link>
                <Link
                    to="/personality/test"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '16px 32px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#FFFFFF',
                        textDecoration: 'none',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
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
                    <TrendingUp size={20}/>
                    Пройти тест заново
                </Link>
                <button
                    onClick={handleDeleteAllClick}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '16px 32px',
                        background: 'rgba(239, 68, 68, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(239, 68, 68, 0.5)',
                        borderRadius: '12px',
                        color: '#FFFFFF',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 1)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.9)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                    }}
                >
                    <Trash2 size={20}/>
                    Удалить все
                </button>
            </div>
        </div>

        {showDeleteModal && (
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    animation: 'fadeIn 0.3s ease-out',
                }}
                onClick={handleCancelDelete}
            >
                <div
                    style={{
                        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
                        borderRadius: '24px',
                        padding: '40px',
                        maxWidth: '450px',
                        width: '90%',
                        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.5)',
                        animation: 'slideUp 0.4s ease-out',
                        position: 'relative',
                        border: '1px solid rgba(102, 126, 234, 0.3)',
                        backdropFilter: 'blur(20px)',
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={handleCancelDelete}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                    >
                        <X size={20} color="rgba(255, 255, 255, 0.8)" />
                    </button>

                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div
                            style={{
                                width: '80px',
                                height: '80px',
                                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 24px',
                                animation: 'pulse 2s ease-in-out infinite',
                                border: '2px solid rgba(239, 68, 68, 0.5)',
                            }}
                        >
                            <AlertTriangle size={40} color="#EF4444" />
                        </div>
                        <h2
                            style={{
                                fontSize: '28px',
                                fontWeight: '700',
                                color: '#FFFFFF',
                                marginBottom: '12px',
                            }}
                        >
                            Удалить результат?
                        </h2>
                        <p
                            style={{
                                fontSize: '16px',
                                color: 'rgba(255, 255, 255, 0.7)',
                                lineHeight: '1.6',
                            }}
                        >
                            Вы уверены, что хотите удалить этот результат теста? Это действие нельзя отменить.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={handleCancelDelete}
                            disabled={isDeleting}
                            style={{
                                flex: 1,
                                padding: '14px 24px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                color: 'rgba(255, 255, 255, 0.9)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: isDeleting ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                opacity: isDeleting ? 0.5 : 1,
                            }}
                            onMouseEnter={(e) => {
                                if (!isDeleting) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                if (!isDeleting) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                            }}
                        >
                            Отмена
                        </button>
                        <button
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                            style={{
                                flex: 1,
                                padding: '14px 24px',
                                background: isDeleting ? 'rgba(239, 68, 68, 0.5)' : 'rgba(239, 68, 68, 0.9)',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: isDeleting ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                            }}
                            onMouseEnter={(e) => {
                                if (!isDeleting) {
                                    e.currentTarget.style.background = 'rgba(239, 68, 68, 1)';
                                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.5)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isDeleting) {
                                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.9)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                                }
                            }}
                        >
                            {isDeleting ? 'Удаление...' : 'Удалить'}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {showDeleteAllModal && (
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    animation: 'fadeIn 0.3s ease-out',
                }}
                onClick={handleCancelDeleteAll}
            >
                <div
                    style={{
                        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
                        borderRadius: '24px',
                        padding: '40px',
                        maxWidth: '450px',
                        width: '90%',
                        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.5)',
                        animation: 'slideUp 0.4s ease-out',
                        position: 'relative',
                        border: '1px solid rgba(239, 68, 68, 0.5)',
                        backdropFilter: 'blur(20px)',
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={handleCancelDeleteAll}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                    >
                        <X size={20} color="rgba(255, 255, 255, 0.8)" />
                    </button>

                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div
                            style={{
                                width: '80px',
                                height: '80px',
                                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 24px',
                                animation: 'pulse 2s ease-in-out infinite',
                                border: '2px solid rgba(239, 68, 68, 0.5)',
                            }}
                        >
                            <Trash2 size={40} color="#EF4444" />
                        </div>
                        <h2
                            style={{
                                fontSize: '28px',
                                fontWeight: '700',
                                color: '#FFFFFF',
                                marginBottom: '12px',
                            }}
                        >
                            Удалить всё?
                        </h2>
                        <p
                            style={{
                                fontSize: '16px',
                                color: 'rgba(255, 255, 255, 0.7)',
                                lineHeight: '1.6',
                            }}
                        >
                            Вы уверены, что хотите удалить ВСЕ результаты тестов ({results.length} шт.)? Это действие нельзя отменить!
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={handleCancelDeleteAll}
                            disabled={isDeleting}
                            style={{
                                flex: 1,
                                padding: '14px 24px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                color: 'rgba(255, 255, 255, 0.9)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: isDeleting ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                opacity: isDeleting ? 0.5 : 1,
                            }}
                            onMouseEnter={(e) => {
                                if (!isDeleting) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                if (!isDeleting) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                            }}
                        >
                            Отмена
                        </button>
                        <button
                            onClick={handleConfirmDeleteAll}
                            disabled={isDeleting}
                            style={{
                                flex: 1,
                                padding: '14px 24px',
                                background: isDeleting ? 'rgba(239, 68, 68, 0.5)' : 'rgba(239, 68, 68, 0.9)',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: isDeleting ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                            }}
                            onMouseEnter={(e) => {
                                if (!isDeleting) {
                                    e.currentTarget.style.background = 'rgba(239, 68, 68, 1)';
                                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.5)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isDeleting) {
                                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.9)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                                }
                            }}
                        >
                            {isDeleting ? 'Удаление...' : 'Удалить всё'}
                        </button>
                    </div>
                </div>
            </div>
        )}

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
      `}</style>
    </div>
  );
}
