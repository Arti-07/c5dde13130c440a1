import { useState } from 'react';
import type { RoadmapStage } from '../../types/roadmap';
import { StageDetail } from './StageDetail';

interface Props {
  stages: RoadmapStage[];
}

const stageColors: Record<string, string> = {
  BEGINNER: '#10B981',
  JUNIOR: '#3B82F6',
  MIDDLE: '#F59E0B',
  SENIOR: '#8B5CF6',
  EXPERT: '#EF4444',
};

export function RoadmapTimeline({ stages }: Props) {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Timeline Navigation */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        overflowX: 'auto',
      }}>
        <div style={{
          display: 'flex',
          gap: '16px',
          minWidth: 'max-content',
        }}>
          {stages.map((stage, index) => (
            <button
              key={stage.id}
              onClick={() => setActiveStage(index)}
              style={{
                backgroundColor: activeStage === index ? stageColors[stage.level] : 'rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                border: activeStage === index ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                padding: '20px 24px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                minWidth: '160px',
                position: 'relative',
                transform: activeStage === index ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: activeStage === index ? `0 8px 24px ${stageColors[stage.level]}60` : 'none',
              }}
              onMouseEnter={(e) => {
                if (activeStage !== index) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeStage !== index) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: activeStage === index ? 'rgba(255, 255, 255, 0.3)' : stageColors[stage.level],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: '700',
                color: activeStage === index ? '#FFFFFF' : '#FFFFFF',
              }}>
                {index + 1}
              </div>
              <div style={{
                fontSize: '15px',
                fontWeight: '700',
                textAlign: 'center',
              }}>
                {stage.level}
              </div>
              <div style={{
                fontSize: '12px',
                opacity: 0.8,
                textAlign: 'center',
              }}>
                {stage.duration}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Stage Content */}
      <StageDetail stage={stages[activeStage]} />
    </div>
  );
}

