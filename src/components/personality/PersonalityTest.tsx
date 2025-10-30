import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ChevronLeft, ChevronRight, CheckCircle, Circle, ArrowLeft } from 'lucide-react';
import type { Question, Answer } from '../../types/personality';
import {
  getPersonalityQuestions,
  submitPersonalityTest,
} from '../../api/personality';

export function PersonalityTest() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    loadQuestions();
    const savedAnswers = localStorage.getItem('personality_answers');
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem('personality_answers', JSON.stringify(answers));
    }
  }, [answers]);

  const loadQuestions = async () => {
    try {
      const data = await getPersonalityQuestions();
      setQuestions(data.questions);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки вопросов');
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: number, answer: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    const allAnswered = questions.every((q) => answers[q.id] !== undefined);
    
    if (!allAnswered) {
      setError('Пожалуйста, ответьте на все вопросы');
      return;
    }

    const invalidAnswers = Object.values(answers).some(
      (answer) => answer < 1 || answer > 7
    );
    
    if (invalidAnswers) {
      setError('Ответы должны быть в диапазоне от 1 до 7');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const answersArray: Answer[] = Object.entries(answers).map(
        ([questionId, answer]) => ({
          question_id: parseInt(questionId),
          answer: answer,
        })
      );

      const result = await submitPersonalityTest({ answers: answersArray });
      
      localStorage.removeItem('personality_answers');
      
      navigate('/personality/result', { state: { result } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка отправки теста');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <Brain size={48} color="#A78BFA" style={{ 
            animation: 'pulse 2s infinite',
            marginBottom: '20px'
          }} />
          <h2 style={{ 
            color: '#E9D5FF', 
            fontSize: '24px',
            fontWeight: '400',
            letterSpacing: '0.05em'
          }}>
            Загрузка вопросов...
          </h2>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ color: '#E9D5FF' }}>Вопросы не найдены</div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
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
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                         radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.3) 0%, transparent 50%),
                         radial-gradient(circle at 40% 20%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)`,
        pointerEvents: 'none'
      }} />

      <div style={{ 
        maxWidth: '900px', 
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px',
            padding: '12px 24px',
            cursor: 'pointer',
            borderRadius: '12px',
            border: '1px solid rgba(167, 139, 250, 0.3)',
            backgroundColor: 'rgba(30, 27, 75, 0.5)',
            color: '#E9D5FF',
            fontSize: '14px',
            fontWeight: '500',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(30, 27, 75, 0.8)';
            e.currentTarget.style.borderColor = 'rgba(167, 139, 250, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(30, 27, 75, 0.5)';
            e.currentTarget.style.borderColor = 'rgba(167, 139, 250, 0.3)';
          }}
        >
          <ArrowLeft size={18} />
          На главную
        </button>

        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          animation: 'fadeIn 0.8s ease-out'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #E9D5FF 0%, #A78BFA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.05em'
            }}>
              Тест Личности
            </h1>
          </div>
          <p style={{
            color: '#C4B5FD',
            fontSize: '16px',
            letterSpacing: '0.05em',
            opacity: 0.9
          }}>
            Узнайте свой уникальный психологический профиль
          </p>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          marginBottom: '24px'
        }}>
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <span style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#A78BFA'
              }}>
                Вопрос {currentQuestionIndex + 1} из {questions.length}
              </span>
              <span style={{
                fontSize: '14px',
                background: answeredCount === questions.length 
                  ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                  : '#F3F4F6',
                color: answeredCount === questions.length ? '#FFFFFF' : '#6B7280',
                padding: '6px 12px',
                borderRadius: '20px',
                fontWeight: '500'
              }}>
                <CheckCircle size={14} style={{ 
                  display: 'inline', 
                  marginRight: '4px',
                  verticalAlign: 'middle'
                }} />
                {answeredCount} / {questions.length}
              </span>
            </div>
            
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#E5E7EB',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #A78BFA 0%, #8B5CF6 100%)',
                transition: 'width 0.3s ease',
                borderRadius: '8px'
              }} />
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
            padding: '32px',
            borderRadius: '16px',
            marginBottom: '32px',
            boxShadow: '0 4px 16px rgba(167, 139, 250, 0.3)'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '500',
              color: '#FFFFFF',
              lineHeight: '1.5',
              margin: 0
            }}>
              {currentQuestion.question}
            </h2>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '16px',
              fontSize: '14px',
              color: '#6B7280',
              fontWeight: '500'
            }}>
              <span>Совершенно не согласен</span>
              <span>Нейтрально</span>
              <span>Полностью согласен</span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '12px'
            }}>
              {[1, 2, 3, 4, 5, 6, 7].map((score) => {
                const isSelected = answers[currentQuestion.id] === score;
                return (
                  <button
                    key={score}
                    onClick={() => handleAnswer(currentQuestion.id, score)}
                    style={{
                      padding: '20px 0',
                      border: isSelected 
                        ? '3px solid #A78BFA' 
                        : '2px solid #E5E7EB',
                      borderRadius: '12px',
                      background: isSelected
                        ? 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)'
                        : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : '#1F2937',
                      fontSize: '24px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#A78BFA';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(167, 139, 250, 0.2)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#E5E7EB';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    {isSelected && (
                      <CheckCircle 
                        size={16} 
                        style={{ 
                          position: 'absolute', 
                          top: '8px', 
                          right: '8px' 
                        }} 
                      />
                    )}
                    {score}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#DC2626',
              padding: '16px',
              marginBottom: '24px',
              borderRadius: '12px',
              textAlign: 'center',
              fontWeight: '500'
            }}>
              {error}
            </div>
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '16px'
          }}>
            <button
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              style={{
                padding: '14px 28px',
                borderRadius: '12px',
                border: '2px solid #E5E7EB',
                background: '#FFFFFF',
                color: currentQuestionIndex === 0 ? '#9CA3AF' : '#1F2937',
                fontSize: '16px',
                fontWeight: '500',
                cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                opacity: currentQuestionIndex === 0 ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (currentQuestionIndex !== 0) {
                  e.currentTarget.style.borderColor = '#A78BFA';
                  e.currentTarget.style.transform = 'translateX(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <ChevronLeft size={20} />
              Назад
            </button>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={goToNextQuestion}
                style={{
                  padding: '14px 28px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(167, 139, 250, 0.4)',
                  flex: 1
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(167, 139, 250, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(167, 139, 250, 0.4)';
                }}
              >
                Вперед
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting || answeredCount < questions.length}
                style={{
                  padding: '14px 28px',
                  borderRadius: '12px',
                  border: 'none',
                  background: submitting || answeredCount < questions.length
                    ? '#9CA3AF'
                    : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: submitting || answeredCount < questions.length ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  boxShadow: submitting || answeredCount < questions.length 
                    ? 'none' 
                    : '0 4px 12px rgba(16, 185, 129, 0.4)',
                  flex: 1
                }}
                onMouseEnter={(e) => {
                  if (!submitting && answeredCount >= questions.length) {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  if (!submitting && answeredCount >= questions.length) {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
                  }
                }}
              >
                {submitting ? (
                  <>
                    <Circle size={20} style={{ animation: 'spin 1s linear infinite' }} />
                    Отправка...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Завершить тест
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(questions.length, 10)}, 1fr)`,
          gap: '8px',
          maxWidth: '100%',
          overflowX: 'auto',
          padding: '8px'
        }}>
          {questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(index)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                border: currentQuestionIndex === index 
                  ? '2px solid #A78BFA' 
                  : 'none',
                background: answers[q.id] !== undefined
                  ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                  : 'rgba(167, 139, 250, 0.3)',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
