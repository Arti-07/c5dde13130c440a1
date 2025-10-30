import type { RoadmapMilestone } from '../../types/roadmap';

interface Props {
  milestones: RoadmapMilestone[];
}

export function MilestonesView({ milestones }: Props) {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      padding: '32px',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    }}>
      <h2 style={{
        fontSize: '28px',
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        🏆 Ключевые вехи
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px',
      }}>
        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            style={{
              backgroundColor: '#F9FAFB',
              border: '2px solid #E5E7EB',
              borderRadius: '16px',
              padding: '24px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#F59E0B';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(245, 158, 11, 0.15)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E5E7EB';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '12px',
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1F2937',
                margin: 0,
                flex: 1,
              }}>
                {milestone.title}
              </h3>
              <span style={{
                backgroundColor: '#F59E0B',
                color: '#FFFFFF',
                padding: '4px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                marginLeft: '12px',
              }}>
                {milestone.stage}
              </span>
            </div>

            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              lineHeight: '1.6',
              marginBottom: '16px',
            }}>
              {milestone.description}
            </p>

            <div>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1F2937',
                marginBottom: '8px',
              }}>
                Критерии успеха:
              </h4>
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                listStyle: 'none',
              }}>
                {milestone.criteria.map((criterion, index) => (
                  <li
                    key={index}
                    style={{
                      fontSize: '13px',
                      color: '#6B7280',
                      lineHeight: '1.6',
                      marginBottom: '6px',
                      position: 'relative',
                    }}
                  >
                    <span style={{
                      position: 'absolute',
                      left: '-20px',
                      color: '#10B981',
                    }}>
                      ✓
                    </span>
                    {criterion}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

