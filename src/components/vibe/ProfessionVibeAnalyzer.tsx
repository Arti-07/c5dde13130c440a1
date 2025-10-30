import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Sparkles, CheckCircle2, Circle } from 'lucide-react';
import { getProfessionQuestions } from '../../api/vibe';
import type { ClarifyingQuestion, ProfessionCard } from '../../types/vibe';
import { GameLoadingModal } from '../ui/GameLoadingModal';

export function ProfessionVibeAnalyzer() {
  const navigate = useNavigate();
  const location = useLocation();
  const profession = location.state?.profession as ProfessionCard | undefined;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState<ClarifyingQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showGameModal, setShowGameModal] = useState(false);

  useEffect(() => {
    if (!profession) {
      navigate('/vibe');
      return;
    }
    loadQuestions();
  }, [profession]);

  const loadQuestions = async () => {
    if (!profession) return;
    
    try {
      setLoading(true);
      setShowGameModal(true);
      setError('');
      
      const response = await getProfessionQuestions(profession.title);
      setQuestions(response.questions);
      
      setLoading(false);
      setShowGameModal(false);
    } catch (error) {
      console.error('Error loading questions:', error);
      const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки вопросов';
      setError(errorMessage);
      setLoading(false);
      setShowGameModal(false);
    }
  };

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
    // Сбрасываем кастомный ответ при выборе варианта
    setCustomAnswers(prev => {
      const updated = { ...prev };
      delete updated[questionId];
      return updated;
    });
  };

  const handleCustomAnswerChange = (questionId: string, value: string) => {
    setCustomAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    // Сбрасываем выбранный вариант при вводе кастомного ответа
    if (value.trim()) {
      setAnswers(prev => {
        const updated = { ...prev };
        delete updated[questionId];
        return updated;
      });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Собираем все ответы (обычные и кастомные)
    const allAnswers = questions.map((q) => ({
      question_id: q.id,
      question_text: q.question,
      answer: answers[q.id] 
        ? q.options.find(opt => opt.id === answers[q.id])?.text || ''
        : customAnswers[q.id] || ''
    }));
    
    console.log('Submitting answers:', allAnswers);
    console.log('Profession:', profession?.title);
    
    // Переходим на страницу с окружениями
    navigate('/vibe/ambients', {
      state: {
        professionTitle: profession?.title,
        questionAnswers: allAnswers,
        useTemplate: true // Можно сделать переключателем для тестирования // #TODO: FALSE
      }
    });
  };

  const isCurrentQuestionAnswered = () => {
    if (questions.length === 0) return false;
    const currentQuestion = questions[currentQuestionIndex];
    return !!answers[currentQuestion.id] || !!customAnswers[currentQuestion.id]?.trim();
  };

  const allQuestionsAnswered = () => {
    return questions.every(q => !!answers[q.id] || !!customAnswers[q.id]?.trim());
  };

  if (!profession) {
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];

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
        maxWidth: '900px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}>
        <button
          onClick={() => navigate('/vibe')}
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
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'translateX(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <ArrowLeft size={18} />
          Назад
        </button>

        <div style={{
          textAlign: 'center',
          marginBottom: '48px',
        }}>
          <div style={{
            fontSize: '64px',
            marginBottom: '16px',
          }}>
            {profession.icon}
          </div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#FFFFFF',
            marginBottom: '8px',
          }}>
            {profession.title}
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '16px',
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            Ответь на несколько вопросов, чтобы мы могли дать тебе максимально точный анализ
          </p>
        </div>

        {error && (
          <div style={{
            padding: '16px 24px',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.15) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            textAlign: 'center',
            marginBottom: '24px',
          }}>
            <p style={{ color: '#FCA5A5', margin: 0, fontSize: '14px' }}>
              {error}
            </p>
          </div>
        )}

        {questions.length > 0 && (
          <>
            <div style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'center',
              marginBottom: '32px',
            }}>
              {questions.map((q, index) => (
                <div
                  key={q.id}
                  style={{
                    width: `${100 / questions.length}%`,
                    maxWidth: '120px',
                    height: '4px',
                    background: index <= currentQuestionIndex 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '2px',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '40px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '32px',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div style={{
                marginBottom: '12px',
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '14px',
                fontWeight: '600',
              }}>
                Вопрос {currentQuestionIndex + 1} из {questions.length}
              </div>

              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#FFFFFF',
                marginBottom: '32px',
                lineHeight: '1.4',
              }}>
                {currentQuestion.question}
              </h2>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                flex: 1,
              }}>
                {currentQuestion.options.map((option) => {
                  const isSelected = answers[currentQuestion.id] === option.id;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
                      style={{
                        padding: '20px 24px',
                        background: isSelected
                          ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)'
                          : 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '16px',
                        border: isSelected 
                          ? '2px solid rgba(102, 126, 234, 0.6)'
                          : '2px solid rgba(255, 255, 255, 0.1)',
                        color: '#FFFFFF',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                          e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        }
                      }}
                    >
                      {isSelected ? (
                        <CheckCircle2 size={24} color="#667eea" />
                      ) : (
                        <Circle size={24} color="rgba(255, 255, 255, 0.3)" />
                      )}
                      <span>{option.text}</span>
                    </button>
                  );
                })}

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  margin: '16px 0 8px 0',
                }}>
                  <div style={{
                    flex: 1,
                    height: '1px',
                    background: 'rgba(255, 255, 255, 0.1)',
                  }} />
                  <span style={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}>
                    или введи свой ответ
                  </span>
                  <div style={{
                    flex: 1,
                    height: '1px',
                    background: 'rgba(255, 255, 255, 0.1)',
                  }} />
                </div>

                <input
                  type="text"
                  value={customAnswers[currentQuestion.id] || ''}
                  onChange={(e) => handleCustomAnswerChange(currentQuestion.id, e.target.value)}
                  placeholder="Напиши свой вариант..."
                  style={{
                    padding: '20px 24px',
                    background: customAnswers[currentQuestion.id]?.trim()
                      ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)'
                      : 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    border: customAnswers[currentQuestion.id]?.trim()
                      ? '2px solid rgba(102, 126, 234, 0.5)'
                      : '2px solid rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: '500',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    if (!customAnswers[currentQuestion.id]?.trim()) {
                      e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.4)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    }
                  }}
                  onBlur={(e) => {
                    if (!customAnswers[currentQuestion.id]?.trim()) {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }
                  }}
                />
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '16px',
            }}>
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                style={{
                  padding: '16px 32px',
                  background: currentQuestionIndex === 0 
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: currentQuestionIndex === 0 
                    ? 'rgba(255, 255, 255, 0.3)'
                    : 'rgba(255, 255, 255, 0.9)',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (currentQuestionIndex !== 0) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentQuestionIndex !== 0) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
              >
                Назад
              </button>

              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={!allQuestionsAnswered()}
                  style={{
                    padding: '16px 48px',
                    background: allQuestionsAnswered()
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'rgba(102, 126, 234, 0.3)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: allQuestionsAnswered() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s ease',
                    boxShadow: allQuestionsAnswered() 
                      ? '0 8px 24px rgba(102, 126, 234, 0.4)'
                      : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (allQuestionsAnswered()) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (allQuestionsAnswered()) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)';
                    }
                  }}
                >
                  Получить анализ
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!isCurrentQuestionAnswered()}
                  style={{
                    padding: '16px 48px',
                    background: isCurrentQuestionAnswered()
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'rgba(102, 126, 234, 0.3)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: isCurrentQuestionAnswered() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s ease',
                    boxShadow: isCurrentQuestionAnswered() 
                      ? '0 8px 24px rgba(102, 126, 234, 0.4)'
                      : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (isCurrentQuestionAnswered()) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isCurrentQuestionAnswered()) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)';
                    }
                  }}
                >
                  Далее
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        
        input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
      `}</style>

      <GameLoadingModal
        open={showGameModal}
        onClose={() => {}}
        title="Готовим вопросы"
        subtitle="Поиграй пока мы формируем персональные вопросы для тебя"
      />
    </div>
  );
}

