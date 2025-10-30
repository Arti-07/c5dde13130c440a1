import type { RoadmapCareerPath } from '../../types/roadmap';

interface Props {
  careerPaths: RoadmapCareerPath[];
}

export function CareerPathsView({ careerPaths }: Props) {
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
        🚀 Направления специализации
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px',
      }}>
        {careerPaths.map((path, index) => (
          <div
            key={index}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '16px',
              padding: '24px',
              color: '#FFFFFF',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              position: 'absolute',
              right: '-20px',
              top: '-20px',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              filter: 'blur(20px)',
            }} />

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '12px',
              position: 'relative',
              zIndex: 1,
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#FFFFFF',
                margin: 0,
                flex: 1,
              }}>
                {path.title}
              </h3>
              <span style={{
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(10px)',
                color: '#FFFFFF',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                marginLeft: '12px',
              }}>
                {path.fromStage}
              </span>
            </div>

            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: '1.6',
              marginBottom: '16px',
              position: 'relative',
              zIndex: 1,
            }}>
              {path.description}
            </p>

            <div style={{
              position: 'relative',
              zIndex: 1,
            }}>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#FFFFFF',
                marginBottom: '10px',
              }}>
                Необходимые навыки:
              </h4>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}>
                {path.skills.map((skill, i) => (
                  <span
                    key={i}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      color: '#FFFFFF',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '500',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

