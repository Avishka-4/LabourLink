export interface JobSummary {
  id: string;
  title: string;
  company: string;
  location: string;
}

export interface ComplaintSummary {
  id: string;
  title: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
}
