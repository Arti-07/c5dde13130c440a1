export type { Job, JobFilters };

interface Job {
  id: string;
  company: {
    name: string;
    logo: string;
    verified?: boolean;
  };
  position: string;
  employmentType?: string;
  contractType?: string;
  experienceLevel?: string;
  salary?: {
    min: string;
    max: string;
  };
  date: string;
  stats?: {
    applicants: number;
    matches: number;
  };
  bookmarked: boolean;
}

interface JobFilters {
  jobTitle: string;
  location: string;
  experienceLevel: string;
  jobType: string;
  companyIndustry: string;
  workSchedule: string;
  salaryRange: {
    min: number;
    max: number;
  };
}

