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
        color: '#1F2937',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
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
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              overflow: 'hidden',
              border: expandedIndex === index ? '2px solid #3B82F6' : '2px solid #E5E7EB',
              transition: 'all 0.2s ease',
              boxShadow: expandedIndex === index ? '0 4px 12px rgba(59, 130, 246, 0.15)' : 'none',
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
                e.currentTarget.style.backgroundColor = '#F9FAFB';
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
                color: '#1F2937',
                lineHeight: '1.5',
              }}>
                {qa.question}
              </h4>

              <span style={{
                color: expandedIndex === index ? '#3B82F6' : '#9CA3AF',
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
                backgroundColor: '#F9FAFB',
                borderTop: '1px solid #E5E7EB',
              }}>
                <div style={{
                  backgroundColor: '#FFFFFF',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
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
                    color: '#4B5563',
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

