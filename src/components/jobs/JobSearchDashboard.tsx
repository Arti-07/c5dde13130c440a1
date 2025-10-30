import { useState } from 'react';
import { Header } from './Header';
import { SearchFilters } from './SearchFilters';
import { FilterSidebar } from './FilterSidebar';
import { JobCard } from './JobCard';
import type { Job } from '../../types/job';

const mockJobs: Job[] = [
  {
    id: 'job-1',
    company: {
      name: 'Amazon',
      logo: 'amazon-logo',
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
    id: 'job-2',
    company: {
      name: 'Google',
      logo: 'google-logo',
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
    id: 'job-3',
    company: {
      name: 'Facebook',
      logo: 'facebook-logo',
      verified: true,
    },
    position: 'UX Designer',
    employmentType: 'Full-time',
    contractType: 'Content',
    experienceLevel: 'Senior level',
    salary: {
      min: '$110K',
      max: '$170K',
    },
    date: 'Jul 12, 2025',
    stats: {
      applicants: 109,
      matches: 30,
    },
    bookmarked: false,
  },
  {
    id: 'job-4',
    company: {
      name: 'Apple',
      logo: 'apple-logo',
      verified: true,
    },
    position: 'UI/UX Designer',
    employmentType: 'Full-time',
    contractType: 'Remote',
    experienceLevel: 'Freelance',
    salary: {
      min: '$110K',
      max: '$150K',
    },
    date: 'June 9, 2025',
    stats: {
      applicants: 313,
      matches: 143,
    },
    bookmarked: false,
  },
  {
    id: 'job-5',
    company: {
      name: 'OpenAI',
      logo: 'openai-logo',
      verified: true,
    },
    position: 'Customer Specialist',
    employmentType: 'Part-time',
    contractType: 'Hybrid',
    experienceLevel: 'Shift-Based',
    salary: {
      min: '$50K',
      max: '$90K',
    },
    date: 'June 5, 2025',
    stats: {
      applicants: 24,
      matches: 9,
    },
    bookmarked: false,
  },
  {
    id: 'job-6',
    company: {
      name: 'Dribbble',
      logo: 'dribbble-logo',
      verified: true,
    },
    position: 'Frontend Developer',
    employmentType: 'Contract',
    contractType: 'On-Site',
    experienceLevel: 'Flexible Hours',
    salary: {
      min: '$90K',
      max: '$130K',
    },
    date: 'June 2, 2025',
    stats: {
      applicants: 68,
      matches: 26,
    },
    bookmarked: false,
  },
  {
    id: 'job-7',
    company: {
      name: 'Netflix',
      logo: 'netflix-logo',
    },
    position: 'Motion Designer',
    date: 'Apr 21, 2025',
    bookmarked: false,
  },
  {
    id: 'job-8',
    company: {
      name: 'YouTube',
      logo: 'youtube-logo',
    },
    position: 'Video Editor',
    date: 'Apr 18, 2025',
    bookmarked: false,
  },
  {
    id: 'job-9',
    company: {
      name: 'Upwork',
      logo: 'upwork-logo',
    },
    position: 'Freelance Designer',
    date: 'Apr 9, 2025',
    bookmarked: false,
  },
];

export function JobSearchDashboard() {
  const [jobs] = useState<Job[]>(mockJobs);

  const handleSearch = () => {
    console.log('Searching...');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#E5E7EB',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <Header />
      
      {/* Search Filters */}
      <SearchFilters onSearch={handleSearch} />

      {/* Main Content */}
      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <FilterSidebar />

        {/* Job Grid */}
        <main style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          padding: '0 32px 32px 24px',
        }}>
          {jobs.map((job, index) => (
            <JobCard 
              key={job.id} 
              job={job} 
              variant={index === 1 ? 'dark' : 'light'} 
            />
          ))}
        </main>
      </div>
    </div>
  );
}

