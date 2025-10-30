import type { RoadmapStage } from '../../types/roadmap';
import { InterviewQuestionsSection } from './InterviewQuestionsSection';

interface Props {
  stage: RoadmapStage;
}

export function StageDetail({ stage }: Props) {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      padding: '32px',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#1F2937',
          marginBottom: '8px',
        }}>
          {stage.title}
        </h2>
        <p style={{
          fontSize: '16px',
          color: '#6B7280',
          lineHeight: '1.6',
        }}>
          {stage.description}
        </p>
      </div>

      {/* Цели */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#1F2937',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          🎯 Цели этапа
        </h3>
        <ul style={{
          margin: 0,
          paddingLeft: '24px',
          listStyle: 'none',
        }}>
          {stage.goals.map((goal, index) => (
            <li
              key={index}
              style={{
                fontSize: '15px',
                color: '#4B5563',
                lineHeight: '1.8',
                marginBottom: '8px',
                position: 'relative',
              }}
            >
              <span style={{
                position: 'absolute',
                left: '-24px',
                color: '#10B981',
              }}>
                ✓
              </span>
              {goal}
            </li>
          ))}
        </ul>
      </section>

      {/* Навыки */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#1F2937',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          🔧 Навыки для изучения
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px',
        }}>
          {stage.skills.map((skill, index) => (
            <div
              key={index}
              style={{
                backgroundColor: skill.importance === 'high' ? '#FEF3C7' : skill.importance === 'medium' ? '#DBEAFE' : '#F3F4F6',
                border: `2px solid ${skill.importance === 'high' ? '#F59E0B' : skill.importance === 'medium' ? '#3B82F6' : '#D1D5DB'}`,
                padding: '16px',
                borderRadius: '12px',
                position: 'relative',
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '8px',
              }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1F2937',
                  margin: 0,
                }}>
                  {skill.name}
                </h4>
                <span style={{
                  backgroundColor: skill.importance === 'high' ? '#F59E0B' : skill.importance === 'medium' ? '#3B82F6' : '#9CA3AF',
                  color: '#FFFFFF',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                }}>
                  {skill.importance}
                </span>
              </div>
              <p style={{
                fontSize: '14px',
                color: '#6B7280',
                lineHeight: '1.5',
                margin: 0,
              }}>
                {skill.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Инструменты */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#1F2937',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          🛠️ Инструменты и технологии
        </h3>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          {stage.tools.map((tool, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#F9FAFB',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span style={{
                backgroundColor: '#000000',
                color: '#FFFFFF',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}>
                {tool.category}
              </span>
              <div style={{ flex: 1 }}>
                <h4 style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#1F2937',
                  margin: '0 0 4px 0',
                }}>
                  {tool.name}
                </h4>
                <p style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  margin: 0,
                }}>
                  {tool.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Проекты */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#1F2937',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          💻 Проекты для практики
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '16px',
        }}>
          {stage.projects.map((project, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#F0FDF4',
                border: '2px solid #10B981',
                padding: '20px',
                borderRadius: '12px',
              }}
            >
              <h4 style={{
                fontSize: '17px',
                fontWeight: '600',
                color: '#1F2937',
                marginBottom: '8px',
              }}>
                {project.title}
              </h4>
              <p style={{
                fontSize: '14px',
                color: '#6B7280',
                lineHeight: '1.5',
                marginBottom: '12px',
              }}>
                {project.description}
              </p>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
              }}>
                {project.skills.map((skill, i) => (
                  <span
                    key={i}
                    style={{
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      padding: '4px 10px',
                      borderRadius: '6px',
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

      {/* Ресурсы */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#1F2937',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          📚 Ресурсы для обучения
        </h3>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          {stage.resources.map((resource, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #E5E7EB',
                padding: '16px',
                borderRadius: '12px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#3B82F6';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '12px',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'inline-block',
                    backgroundColor: '#DBEAFE',
                    color: '#1E40AF',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}>
                    {resource.type}
                  </div>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1F2937',
                    marginBottom: '6px',
                  }}>
                    {resource.title}
                  </h4>
                  <p style={{
                    fontSize: '14px',
                    color: '#6B7280',
                    margin: 0,
                  }}>
                    {resource.description}
                  </p>
                </div>
                {resource.link && (
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: '#3B82F6',
                      color: '#FFFFFF',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '500',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#2563EB';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#3B82F6';
                    }}
                  >
                    Перейти →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Вопросы на собеседовании */}
      <InterviewQuestionsSection questions={stage.interviewQuestions} />
    </div>
  );
}

