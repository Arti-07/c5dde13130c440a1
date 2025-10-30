import { useState } from 'react';
import type { InterviewQuestion } from '../../types/roadmap';

interface Props {
  questions: InterviewQuestion[];
}

export function InterviewQuestionsSection({ questions }: Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <section style={{ marginTop: '32px' }}>
      <h3 style={{
        fontSize: '20px',
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: '16px',
      }}>
        💬 Вопросы на собеседовании
      </h3>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {questions.map((qa, index) => (
          <div
            key={index}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              overflow: 'hidden',
              border: expandedIndex === index ? '2px solid #3B82F6' : '2px solid rgba(255, 255, 255, 0.15)',
              transition: 'all 0.2s ease',
              boxShadow: expandedIndex === index ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none',
            }}
          >
            <div
              onClick={() => toggleQuestion(index)}
              style={{
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span style={{
                backgroundColor: '#3B82F6',
                color: '#FFFFFF',
                padding: '4px 12px',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '13px',
                whiteSpace: 'nowrap',
              }}>
                Q{index + 1}
              </span>

              <h4 style={{
                flex: 1,
                margin: 0,
                fontSize: '15px',
                fontWeight: '500',
                color: '#FFFFFF',
                lineHeight: '1.5',
              }}>
                {qa.question}
              </h4>

              <span style={{
                color: expandedIndex === index ? '#3B82F6' : 'rgba(255, 255, 255, 0.5)',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                transform: expandedIndex === index ? 'rotate(90deg)' : 'rotate(0deg)',
                display: 'inline-block',
              }}>
                ▶
              </span>
            </div>

            {expandedIndex === index && (
              <div style={{
                padding: '16px',
                paddingTop: '0',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              }}>
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#10B981',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    ✓ Ответ
                  </div>
                  <p style={{
                    margin: 0,
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: '1.7',
                    fontSize: '14px',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {qa.answer}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

