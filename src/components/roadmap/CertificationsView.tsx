import type { RoadmapCertification } from '../../types/roadmap';

interface Props {
  certifications: RoadmapCertification[];
}

export function CertificationsView({ certifications }: Props) {
  // Группируем по этапам
  const groupedByStage = certifications.reduce((acc, cert) => {
    if (!acc[cert.stage]) {
      acc[cert.stage] = [];
    }
    acc[cert.stage].push(cert);
    return acc;
  }, {} as Record<string, RoadmapCertification[]>);

  const stageOrder = ['BEGINNER', 'JUNIOR', 'MIDDLE', 'SENIOR', 'EXPERT'];
  const sortedStages = Object.keys(groupedByStage).sort((a, b) => {
    return stageOrder.indexOf(a) - stageOrder.indexOf(b);
  });

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
        📜 Рекомендуемые сертификации
      </h2>

      {sortedStages.map((stage) => (
        <div key={stage} style={{ marginBottom: '32px' }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1F2937',
            marginBottom: '16px',
            paddingBottom: '8px',
            borderBottom: '2px solid #E5E7EB',
          }}>
            {stage}
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px',
          }}>
            {groupedByStage[stage].map((cert, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: cert.optional ? '#F9FAFB' : '#EFF6FF',
                  border: `2px solid ${cert.optional ? '#D1D5DB' : '#3B82F6'}`,
                  borderRadius: '12px',
                  padding: '20px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px',
                }}>
                  <h4 style={{
                    fontSize: '17px',
                    fontWeight: '600',
                    color: '#1F2937',
                    margin: 0,
                    flex: 1,
                  }}>
                    {cert.name}
                  </h4>
                  <span style={{
                    backgroundColor: cert.optional ? '#9CA3AF' : '#3B82F6',
                    color: '#FFFFFF',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    marginLeft: '8px',
                  }}>
                    {cert.optional ? 'Опционально' : 'Рекомендуется'}
                  </span>
                </div>

                <p style={{
                  fontSize: '13px',
                  color: '#6B7280',
                  marginBottom: '12px',
                  fontWeight: '500',
                }}>
                  от {cert.provider}
                </p>

                <p style={{
                  fontSize: '14px',
                  color: '#4B5563',
                  lineHeight: '1.6',
                  margin: 0,
                }}>
                  {cert.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

