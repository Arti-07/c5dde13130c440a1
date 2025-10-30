import { Bookmark, CheckCircle } from 'lucide-react';
import type { Job } from '../../types/job';

interface JobCardProps {
  job: Job;
  variant?: 'light' | 'dark';
}

export function JobCard({ job, variant = 'light' }: JobCardProps) {
  const isDark = variant === 'dark';
  
  const cardStyle = {
    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
    color: isDark ? '#FFFFFF' : '#1F2937',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
    height: '100%',
  };

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: isDark ? '#374151' : '#F3F4F6',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: '600',
          }}>
            {job.company.name.charAt(0)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: '600', fontSize: '16px' }}>{job.company.name}</span>
              {job.company.verified && (
                <CheckCircle size={16} color="#10B981" fill="#10B981" />
              )}
            </div>
            <div style={{ fontSize: '12px', color: isDark ? '#9CA3AF' : '#6B7280' }}>
              {job.date}
            </div>
          </div>
        </div>
        
        <button style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
        }}>
          <Bookmark size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
        </button>
      </div>

      <div>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          margin: '0 0 12px 0',
          color: isDark ? '#FFFFFF' : '#1F2937',
        }}>
          {job.position}
        </h3>
        
        {(job.employmentType || job.contractType || job.experienceLevel) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            {job.employmentType && (
              <span style={{
                backgroundColor: isDark ? '#374151' : '#F3F4F6',
                color: isDark ? '#E5E7EB' : '#6B7280',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
              }}>
                {job.employmentType}
              </span>
            )}
            {job.contractType && (
              <span style={{
                backgroundColor: isDark ? '#374151' : '#F3F4F6',
                color: isDark ? '#E5E7EB' : '#6B7280',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
              }}>
                {job.contractType}
              </span>
            )}
            {job.experienceLevel && (
              <span style={{
                backgroundColor: isDark ? '#374151' : '#F3F4F6',
                color: isDark ? '#E5E7EB' : '#6B7280',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
              }}>
                {job.experienceLevel}
              </span>
            )}
          </div>
        )}

        {job.salary && (
          <div style={{ 
            fontSize: '18px', 
            fontWeight: '600',
            marginBottom: '12px',
            color: isDark ? '#FFFFFF' : '#1F2937',
          }}>
            {job.salary.min} - {job.salary.max}
          </div>
        )}

        {job.stats && (
          <div style={{ 
            fontSize: '12px', 
            color: isDark ? '#9CA3AF' : '#6B7280',
            marginBottom: '16px',
          }}>
            {job.stats.applicants} соискателей • {job.stats.matches} совпадений
          </div>
        )}
      </div>

      <button style={{
        backgroundColor: isDark ? '#FFFFFF' : '#000000',
        color: isDark ? '#000000' : '#FFFFFF',
        padding: '10px 24px',
        borderRadius: '24px',
        border: isDark ? '1px solid #E5E7EB' : 'none',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        marginTop: 'auto',
      }}>
        Подробнее
      </button>
    </div>
  );
}

