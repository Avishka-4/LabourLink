import { useState } from 'react';
import { 
  Briefcase, Users, Plus, ArrowLeft, Search, 
  MoreVertical, MapPin, DollarSign, Calendar, Upload
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { useNavigate } from 'react-router';
import { mockWorkers, mockJobOpportunities, type JobOpportunity } from '../data/mock-data';
import { toast } from 'sonner';

export function AgencyDashboard() {
  const navigate = useNavigate();
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false);

  // Filter workers for current agency (demo: Prime Employment Agency)
  const agencyWorkers = mockWorkers.filter(w => w.agency === 'Prime Employment Agency');
  const agencyJobs = mockJobOpportunities.filter(j => j.agency === 'Prime Employment Agency');

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Job opportunity posted successfully!');
    setIsJobDialogOpen(false);
  };

  const handleReportIssue = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Issue reported to government. Reference ID: #ISS' + Math.floor(Math.random() * 10000));
    setIsIssueDialogOpen(false);
  };

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
                <Briefcase className="size-8 text-emerald-600" />
                <div>
                  <h1>Agency Dashboard</h1>
                  <p className="text-sm text-gray-600">Prime Employment Agency</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-emerald-700 border-emerald-700">Agency Access</Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Workers</p>
                <p className="text-3xl mt-1">{agencyWorkers.length}</p>
              </div>
              <Users className="size-10 text-emerald-600 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Jobs</p>
                <p className="text-3xl mt-1">{agencyJobs.length}</p>
              </div>
              <Briefcase className="size-10 text-blue-600 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open Positions</p>
                <p className="text-3xl mt-1">{agencyJobs.reduce((sum, job) => sum + job.positions, 0)}</p>
              </div>
              <Plus className="size-10 text-purple-600 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Agency Rating</p>
                <p className="text-3xl mt-1">4.5</p>
              </div>
              <div className="text-yellow-500 text-2xl">★</div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Dialog open={isJobDialogOpen} onOpenChange={setIsJobDialogOpen}>
            <DialogTrigger asChild>
              <Card className="p-6 cursor-pointer hover:bg-gray-50 transition">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <Plus className="size-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4>Post New Job Opportunity</h4>
                    <p className="text-sm text-gray-600">Share available positions with workers</p>
                  </div>
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Post New Job Opportunity</DialogTitle>
              </DialogHeader>
              <form onSubmit={handlePostJob} className="space-y-4">
                <div>
                  <Label>Job Title</Label>
                  <Input placeholder="e.g., Senior Accountant" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Location</Label>
                    <Input placeholder="e.g., Dubai Marina" required />
                  </div>
                  <div>
                    <Label>Salary Range</Label>
                    <Input placeholder="e.g., $2,000 - $3,000/month" required />
                  </div>
                </div>
                <div>
                  <Label>Number of Positions</Label>
                  <Input type="number" min="1" placeholder="e.g., 5" required />
                </div>
                <div>
                  <Label>Requirements (comma separated)</Label>
                  <Input placeholder="e.g., 5+ years experience, Bachelor's degree" required />
                </div>
                <div>
                  <Label>Job Description</Label>
                  <Textarea rows={4} placeholder="Describe the role and responsibilities..." required />
                </div>
                
                {/* File Upload Section */}
                <div className="border-2 border-dashed rounded-lg p-6 bg-gray-50">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Upload className="size-10 text-gray-400" />
                    <div className="text-center">
                      <Label htmlFor="job-flyer" className="text-sm cursor-pointer text-emerald-600 hover:underline">
                        Upload Job Flyer
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">PNG or JPG format (Max 5MB)</p>
                    </div>
                    <Input
                      id="job-flyer"
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          toast.success(`File "${file.name}" selected`);
                        }
                      }}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('job-flyer')?.click()}>
                      <Upload className="size-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsJobDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Post Job</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isIssueDialogOpen} onOpenChange={setIsIssueDialogOpen}>
            <DialogTrigger asChild>
              <Card className="p-6 cursor-pointer hover:bg-gray-50 transition">
                <div className="flex items-center gap-4">
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <Briefcase className="size-6 text-amber-600" />
                  </div>
                  <div>
                    <h4>Report Issue to Government</h4>
                    <p className="text-sm text-gray-600">Communicate problems or concerns</p>
                  </div>
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report Issue to Government</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleReportIssue} className="space-y-4">
                <div>
                  <Label>Issue Type</Label>
                  <Input placeholder="e.g., License Renewal, Policy Clarification" required />
                </div>
                <div>
                  <Label>Subject</Label>
                  <Input placeholder="Brief description" required />
                </div>
                <div>
                  <Label>Details</Label>
                  <Textarea rows={5} placeholder="Provide detailed information about the issue..." required />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsIssueDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit Report</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="workers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="workers">Our Workers</TabsTrigger>
            <TabsTrigger value="jobs">Job Postings</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Workers Tab */}
          <TabsContent value="workers" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3>Managed Workers ({agencyWorkers.length})</h3>
                <div className="flex gap-2">
                  <Input placeholder="Search workers..." className="w-64" />
                  <Button variant="outline" size="icon">
                    <Search className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {agencyWorkers.map((worker) => (
                  <div key={worker.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4>{worker.name}</h4>
                          <Badge variant={worker.status === 'active' ? 'default' : 'destructive'}>
                            {worker.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Position</p>
                            <p>{worker.position}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Workplace</p>
                            <p>{worker.workplace}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Nationality</p>
                            <p>{worker.nationality}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Salary</p>
                            <p>${worker.salary}/month</p>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3>Active Job Postings</h3>
                <Button onClick={() => setIsJobDialogOpen(true)}>
                  <Plus className="size-4 mr-2" />
                  Post New Job
                </Button>
              </div>

              <div className="space-y-4">
                {agencyJobs.map((job) => (
                  <div key={job.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="mb-2">{job.title}</h4>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <MapPin className="size-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="size-4" />
                            {job.salary}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="size-4" />
                            {job.positions} positions
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="size-4" />
                            Posted {job.posted}
                          </span>
                        </div>
                        <p className="text-sm mb-3">{job.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {job.requirements.map((req, idx) => (
                            <Badge key={idx} variant="outline">{req}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">View Applicants</Button>
                      <Button variant="outline" size="sm" className="text-red-600">
                        Close Position
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="mb-4">Worker Distribution</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Active Workers</span>
                    <span>{agencyWorkers.filter(w => w.status === 'active').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Alert Status</span>
                    <span>{agencyWorkers.filter(w => w.status === 'alert').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Average Salary</span>
                    <span>${Math.round(agencyWorkers.reduce((sum, w) => sum + w.salary, 0) / agencyWorkers.length)}/mo</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-4">Recruitment Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Active Job Posts</span>
                    <span>{agencyJobs.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Open Positions</span>
                    <span>{agencyJobs.reduce((sum, job) => sum + job.positions, 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Agency Rating</span>
                    <span className="flex items-center gap-1">
                      4.5 <span className="text-yellow-500">★</span>
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="mb-4">Recent Communications with Government</h3>
              <div className="space-y-3">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4>License Renewal Confirmation</h4>
                    <Badge>Resolved</Badge>
                  </div>
                  <p className="text-sm text-gray-600">License PEA-2023-002 has been renewed until 2027.</p>
                  <p className="text-xs text-gray-500 mt-2">2026-03-01</p>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4>Worker Welfare Inspection</h4>
                    <Badge variant="secondary">In Progress</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Scheduled inspection of worker accommodations on 2026-03-20.</p>
                  <p className="text-xs text-gray-500 mt-2">2026-02-28</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}