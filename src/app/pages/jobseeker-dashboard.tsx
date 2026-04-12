import { useState } from 'react';
import { 
  Briefcase, ArrowLeft, MapPin, DollarSign, Building2, Search
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useNavigate } from 'react-router';
import { mockJobOpportunities, type JobOpportunity } from '../data/mock-data';
import { toast } from 'sonner';

export function JobSeekerDashboard() {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState<JobOpportunity | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Demo job seeker data
  const jobSeekerInfo = {
    id: 'JS123',
    name: 'Ahmed Khan',
    nationality: 'India',
    email: 'ahmed.khan@email.com',
    phone: '+971-50-123-4567',
    skills: 'Hospitality, Customer Service',
    experience: '3 years',
  };

  const handleApplyJob = (job: JobOpportunity) => {
    toast.success(`Application submitted for ${job.title}!`);
  };

  const filteredJobs = mockJobOpportunities.filter(job =>
    searchQuery === '' ||
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.agency.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <ArrowLeft className="size-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Briefcase className="size-8 text-purple-600" />
                <div>
                  <h1>Job Seeker Dashboard</h1>
                  <p className="text-sm text-gray-600">{jobSeekerInfo.name}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-purple-700 border-purple-700">Job Seeker</Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Card */}
        <Card className="p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="mb-4">My Profile</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Applicant ID</p>
                  <p>{jobSeekerInfo.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nationality</p>
                  <p>{jobSeekerInfo.nationality}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p>{jobSeekerInfo.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p>{jobSeekerInfo.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Skills</p>
                  <p>{jobSeekerInfo.skills}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Experience</p>
                  <p>{jobSeekerInfo.experience}</p>
                </div>
              </div>
            </div>
            <Button variant="outline">Edit Profile</Button>
          </div>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="jobs">Browse Jobs</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
          </TabsList>

          {/* Browse Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3>Available Job Opportunities</h3>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Search jobs..." 
                    className="w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button variant="outline" size="icon">
                    <Search className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {filteredJobs.map((job) => (
                  <Card 
                    key={job.id} 
                    className="p-4 hover:shadow-md transition cursor-pointer"
                    onClick={() => setSelectedJob(job)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="mb-1">{job.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building2 className="size-4" />
                          <span>{job.agency}</span>
                        </div>
                      </div>
                      <Badge>{job.positions} positions</Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="size-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="size-4" />
                        <span>{job.salary}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.requirements.slice(0, 2).map((req, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                      {job.requirements.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{job.requirements.length - 2} more
                        </Badge>
                      )}
                    </div>

                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplyJob(job);
                      }}
                    >
                      Apply Now
                    </Button>
                  </Card>
                ))}
              </div>

              {filteredJobs.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Briefcase className="size-12 mx-auto mb-2 opacity-20" />
                  <p>No jobs found matching your criteria</p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* My Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <Card className="p-6">
              <h3 className="mb-6">My Job Applications</h3>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="mb-1">Senior Accountant</h4>
                      <p className="text-sm text-gray-600">Prime Employment Agency</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-4" />
                      Dubai Marina
                    </span>
                    <span>Applied: 2026-03-10</span>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="mb-1">Marketing Specialist</h4>
                      <p className="text-sm text-gray-600">Global Staffing Solutions</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-4" />
                      Abu Dhabi
                    </span>
                    <span>Applied: 2026-03-08</span>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="mb-1">Construction Worker</h4>
                      <p className="text-sm text-gray-600">Elite Workforce Agency</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Interview Scheduled</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-4" />
                      Sharjah
                    </span>
                    <span>Applied: 2026-03-05</span>
                  </div>
                  <div className="mt-3 p-3 bg-green-50 rounded text-sm">
                    <p className="text-green-800">Interview: March 18, 2026 at 10:00 AM</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Job Details Sidebar - Shows when job is selected */}
        {selectedJob && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="mb-2">{selectedJob.title}</h3>
                  <p className="text-gray-600">{selectedJob.agency}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedJob(null)}>
                  ✕
                </Button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm text-gray-600">Location</label>
                  <p className="flex items-center gap-2">
                    <MapPin className="size-4" />
                    {selectedJob.location}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Salary</label>
                  <p className="flex items-center gap-2">
                    <DollarSign className="size-4" />
                    {selectedJob.salary}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Available Positions</label>
                  <p>{selectedJob.positions}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Requirements</label>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedJob.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Description</label>
                  <p className="text-sm text-gray-700">{selectedJob.description}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Posted Date</label>
                  <p>{selectedJob.postedDate}</p>
                </div>
              </div>

              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  handleApplyJob(selectedJob);
                  setSelectedJob(null);
                }}
              >
                Apply for this Position
              </Button>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
