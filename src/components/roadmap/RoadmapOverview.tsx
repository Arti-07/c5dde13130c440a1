import { Sparkles, Star, Brain } from 'lucide-react';
import type { RoadmapOverview } from '../../types/roadmap';

interface Props {
  overview: RoadmapOverview;
  profession: string;
}

export function RoadmapOverviewComponent({ overview, profession }: Props) {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      padding: '32px',
      marginBottom: '24px',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    }}>
      {/* Красивый заголовок с badge */}
      <div style={{
        textAlign: 'center',
        marginBottom: '24px',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#FFFFFF',
          padding: '8px 20px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '16px',
        }}>
          <span style={{ fontSize: '18px' }}>🎯</span>
          <span>Roadmap для</span>
        </div>
        <h1 style={{
          margin: 0,
          fontSize: '36px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {profession}
        </h1>
      </div>

      <p style={{
        fontSize: '16px',
        color: '#6B7280',
        lineHeight: '1.6',
        marginBottom: '16px',
      }}>
        {overview.description}
      </p>

      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#F3F4F6',
        padding: '8px 16px',
        borderRadius: '12px',
        marginBottom: '24px',
      }}>
        <span style={{ fontSize: '14px', color: '#6B7280' }}>⏱️ Общая длительность:</span>
        <strong style={{ fontSize: '14px', color: '#1F2937' }}>{overview.totalDuration}</strong>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#1F2937',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          🔑 Ключевые навыки
        </h3>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
        }}>
          {overview.keySkills.map((skill, index) => (
            <span
              key={index}
              style={{
                backgroundColor: '#000000',
                color: '#FFFFFF',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {overview.personalityInsight && (
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '20px',
          borderRadius: '16px',
          marginBottom: '16px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            right: '20px',
            top: '20px',
            opacity: 0.2,
          }}>
            <Brain size={48} color="#FFFFFF" />
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
            position: 'relative',
            zIndex: 1,
          }}>
            <Brain size={20} color="#FFFFFF" />
            <h4 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#FFFFFF',
              margin: 0,
            }}>
              💡 Личностный инсайт
            </h4>
          </div>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.95)',
            lineHeight: '1.6',
            margin: 0,
            position: 'relative',
            zIndex: 1,
          }}>
            {overview.personalityInsight}
          </p>
        </div>
      )}

      {overview.astrologyInsight && (
        <div style={{
          background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
          padding: '20px',
          borderRadius: '16px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            right: '20px',
            top: '20px',
            opacity: 0.2,
          }}>
            <Star size={48} color="#A78BFA" />
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
            position: 'relative',
            zIndex: 1,
          }}>
            <Sparkles size={20} color="#A78BFA" />
            <h4 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#E9D5FF',
              margin: 0,
            }}>
              ⭐ Астрологический инсайт
            </h4>
          </div>
          <p style={{
            fontSize: '14px',
            color: '#C4B5FD',
            lineHeight: '1.6',
            margin: 0,
            position: 'relative',
            zIndex: 1,
          }}>
            {overview.astrologyInsight}
          </p>
        </div>
      )}
    </div>
  );
}

