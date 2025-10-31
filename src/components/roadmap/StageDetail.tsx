import type { RoadmapStage } from '../../types/roadmap';
import { InterviewQuestionsSection } from './InterviewQuestionsSection';

interface Props {
  stage: RoadmapStage;
}

export function StageDetail({ stage }: Props) {
  return (
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      padding: '32px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#FFFFFF',
          marginBottom: '8px',
        }}>
          {stage.title}
        </h2>
        <p style={{
          fontSize: '16px',
          color: 'rgba(255, 255, 255, 0.8)',
          lineHeight: '1.6',
        }}>
          {stage.description}
        </p>
      </div>

      {/* Цели */}
      {stage.goals.length > 0 && (
        <section style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#FFFFFF',
            marginBottom: '16px',
          }}>
            Цели
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '12px',
          }}>
            {stage.goals.map((goal, index) => (
              <li
                key={index}
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  fontSize: '15px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ color: '#10B981', fontWeight: 'bold' }}>✓</span> {goal}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Навыки */}
      {stage.skills.length > 0 && (
        <section style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#FFFFFF',
            marginBottom: '16px',
          }}>
            Навыки
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}>
            {stage.skills.map((skill, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  padding: '16px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#6366F1';
                  e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  marginBottom: '8px',
                }}>
                  {skill.name}
                </h4>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  margin: '0 0 12px 0',
                  lineHeight: '1.5',
                }}>
                  {skill.description}
                </p>
                <span style={{
                  display: 'inline-block',
                  backgroundColor: skill.importance === 'high' ? 'rgba(220, 38, 38, 0.2)' : skill.importance === 'medium' ? 'rgba(217, 119, 6, 0.2)' : 'rgba(79, 70, 229, 0.2)',
                  color: skill.importance === 'high' ? '#FCA5A5' : skill.importance === 'medium' ? '#FCD34D' : '#A5B4FC',
                  border: `1px solid ${skill.importance === 'high' ? '#DC2626' : skill.importance === 'medium' ? '#D97706' : '#4F46E5'}`,
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                }}>
                  {skill.importance === 'high' ? 'Высокая' : skill.importance === 'medium' ? 'Средняя' : 'Низкая'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Инструменты */}
      {stage.tools.length > 0 && (
        <section style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#FFFFFF',
            marginBottom: '16px',
          }}>
            Инструменты и технологии
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}>
            {stage.tools.map((tool, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  padding: '16px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#F59E0B';
                  e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  marginBottom: '8px',
                }}>
                  {tool.name}
                </h4>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  margin: '0 0 12px 0',
                  lineHeight: '1.5',
                }}>
                  {tool.description}
                </p>
                <span style={{
                  display: 'inline-block',
                  backgroundColor: 'rgba(251, 191, 36, 0.2)',
                  color: '#FCD34D',
                  border: '1px solid #D97706',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                }}>
                  {tool.category}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Проекты */}
      {stage.projects.length > 0 && (
        <section style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#FFFFFF',
            marginBottom: '16px',
          }}>
            Проекты для практики
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px',
          }}>
            {stage.projects.map((project, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#3B82F6';
                  e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                  e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                }}
              >
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  marginBottom: '8px',
                }}>
                  {project.title}
                </h4>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  margin: '0 0 12px 0',
                  lineHeight: '1.5',
                }}>
                  {project.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {project.skills.map((skill, i) => (
                    <span
                      key={i}
                      style={{
                        backgroundColor: 'rgba(96, 165, 250, 0.2)',
                        color: '#93C5FD',
                        border: '1px solid #3B82F6',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Вопросы на собеседовании */}
      <InterviewQuestionsSection questions={stage.interviewQuestions} />
    </div>
  );
}
