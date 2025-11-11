export const DEPARTMENTS = [
  'IT',
  'AI',
  'Commercial',
  'Finance',
  'HR',
  'Operations',
] as const;

export const DESIGNATIONS_BY_DEPARTMENT: Record<(typeof DEPARTMENTS)[number], readonly string[]> = {
  IT: ['Frontend Developer', 'Backend Developer', 'Fullstack Developer', 'QA Engineer', 'DevOps'],
  AI: ['ML Engineer', 'Data Scientist', 'MLOps', 'Research Engineer'],
  Commercial: ['Sales Rep', 'Account Manager', 'Sales Lead'],
  Finance: ['Accountant', 'Financial Analyst', 'Controller'],
  HR: ['HR Assistant', 'HR Manager', 'Recruiter'],
  Operations: ['Office Manager', 'Operations Coordinator', 'Logistics'],
} as const;