/**
 * JobSearchPreview - Компонент для предварительного просмотра дизайна
 * Можно использовать для демонстрации различных состояний карточек
 */

import { JobCard } from './JobCard';
import type { Job } from '../../types/job';

export function JobSearchPreview() {
  const sampleJobs: Job[] = [
    {
      id: 'preview-1',
      company: {
        name: 'Amazon',
        logo: 'amazon',
        verified: true,
      },
      position: 'Senior UI Designer',
      employmentType: 'Full-time',
      contractType: 'Contract',
      experienceLevel: 'Senior level',
      salary: {
        min: '$120K',
        max: '$140K',
      },
      date: 'Jul 14, 2025',
      stats: {
        applicants: 94,
        matches: 45,
      },
      bookmarked: false,
    },
    {
      id: 'preview-2',
      company: {
        name: 'Google',
        logo: 'google',
        verified: true,
      },
      position: 'Product Designer',
      employmentType: 'Part-time',
      contractType: 'Onstaff',
      salary: {
        min: '$120K',
        max: '$160K',
      },
      date: 'Jul 13, 2025',
      stats: {
        applicants: 34,
        matches: 10,
      },
      bookmarked: false,
    },
    {
      id: 'preview-3',
      company: {
        name: 'Netflix',
        logo: 'netflix',
      },
      position: 'Motion Designer',
      date: 'Apr 21, 2025',
      bookmarked: false,
    },
  ];

  return (
    <div style={{ 
      padding: '40px',
      backgroundColor: '#E5E7EB',
      minHeight: '100vh',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '32px', 
          marginBottom: '8px',
          color: '#1F2937',
        }}>
          Предварительный просмотр карточек вакансий
        </h1>
        <p style={{ 
          color: '#6B7280', 
          marginBottom: '32px',
          fontSize: '16px',
        }}>
          Демонстрация различных вариантов карточек вакансий
        </p>

        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            marginBottom: '16px',
            color: '#1F2937',
          }}>
            Светлый вариант
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '20px',
          }}>
            {sampleJobs.map((job) => (
              <JobCard key={job.id} job={job} variant="light" />
            ))}
          </div>
        </div>

        <div>
          <h2 style={{ 
            fontSize: '24px', 
            marginBottom: '16px',
            color: '#1F2937',
          }}>
            Темный вариант
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '20px',
          }}>
            {sampleJobs.map((job) => (
              <JobCard key={`${job.id}-dark`} job={job} variant="dark" />
            ))}
          </div>
        </div>

        <div style={{ marginTop: '48px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            marginBottom: '16px',
            color: '#1F2937',
          }}>
            Mixed Variants (как в основном дизайне)
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '20px',
          }}>
            <JobCard job={sampleJobs[0]} variant="light" />
            <JobCard job={sampleJobs[1]} variant="dark" />
            <JobCard job={sampleJobs[2]} variant="light" />
          </div>
        </div>
      </div>
    </div>
  );
}

