import { useState } from 'react';
import { 
  Users, ArrowLeft, Plus, Briefcase, 
  MapPin, DollarSign, AlertTriangle, FileText,
  CheckCircle, Clock, Building2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useNavigate } from 'react-router';
import { mockJobOpportunities, mockComplaints, type JobOpportunity } from '../data/mock-data';
import { toast } from 'sonner';

export function WorkerDashboard() {
  const navigate = useNavigate();
  const [isComplaintDialogOpen, setIsComplaintDialogOpen] = useState(false);
  const [complaintType, setComplaintType] = useState<string>('');
  const [selectedJob, setSelectedJob] = useState<JobOpportunity | null>(null);

  // Demo worker data
  const workerInfo = {
    id: 'W002',
    name: 'Maria Santos',
    nationality: 'Philippines',
    agency: 'Prime Employment Agency',
    workplace: 'Grand Hotel Downtown',
    position: 'Housekeeping Staff',
    salary: 1500,
    joinDate: '2023-08-20',
  };

  // Worker's own complaints
  const myComplaints = mockComplaints.filter(c => c.workerName === workerInfo.name);

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    toast.success('Complaint submitted successfully! Reference ID: #C' + Math.floor(Math.random() * 10000));
    setIsComplaintDialogOpen(false);
    form.reset();
  };

  const handleApplyJob = (job: JobOpportunity) => {
    toast.success(`Application submitted for ${job.title}!`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="size-5 text-green-600" />;
      case 'in-progress': return <Clock className="size-5 text-blue-600" />;
      case 'pending': return <AlertTriangle className="size-5 text-amber-600" />;
      default: return <FileText className="size-5 text-gray-600" />;
    }
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
                <Users className="size-8 text-amber-600" />
                <div>
                  <h1>Existing Worker Dashboard</h1>
                  <p className="text-sm text-gray-600">{workerInfo.name}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-amber-700 border-amber-700">Existing Worker</Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Worker Profile Card */}
        <Card className="p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="mb-4">My Profile</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Worker ID</p>
                  <p>{workerInfo.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nationality</p>
                  <p>{workerInfo.nationality}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Position</p>
                  <p>{workerInfo.position}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Salary</p>
                  <p>${workerInfo.salary}/month</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Workplace</p>
                  <p>{workerInfo.workplace}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Agency</p>
                  <p>{workerInfo.agency}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Join Date</p>
                  <p>{workerInfo.joinDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge>Active</Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Dialog open={isComplaintDialogOpen} onOpenChange={setIsComplaintDialogOpen}>
            <DialogTrigger asChild>
              <Card className="p-6 cursor-pointer hover:bg-gray-50 transition">
                <div className="flex items-center gap-4">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <AlertTriangle className="size-6 text-red-600" />
                  </div>
                  <div>
                    <h4>Submit New Complaint</h4>
                    <p className="text-sm text-gray-600">Report issues to the government</p>
                  </div>
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Submit Complaint to Government</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmitComplaint} className="space-y-4">
                <div>
                  <Label>Complaint Type</Label>
                  <Select value={complaintType} onValueChange={setComplaintType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select complaint type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="payment">Payment Issues</SelectItem>
                      <SelectItem value="health">Health & Safety</SelectItem>
                      <SelectItem value="workplace">Workplace Problems</SelectItem>
                      <SelectItem value="infrastructure">Infrastructure Requirements</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Subject</Label>
                  <Input name="subject" placeholder="Brief description of the issue" required />
                </div>
                <div>
                  <Label>Priority Level</Label>
                  <Select name="priority" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Detailed Description</Label>
                  <Textarea 
                    name="description" 
                    rows={6} 
                    placeholder="Please provide as much detail as possible about your issue..."
                    required 
                  />
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    Your complaint will be reviewed by government officials. You will receive a reference number
                    to track your complaint status.
                  </p>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsComplaintDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit Complaint</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Card className="p-6 cursor-pointer hover:bg-gray-50 transition">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <FileText className="size-6 text-green-600" />
              </div>
              <div>
                <h4>Support Services</h4>
                <p className="text-sm text-gray-600">Access government facilities & resources</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="complaints" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="complaints">My Complaints</TabsTrigger>
            <TabsTrigger value="jobs">Job Opportunities</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* Complaints Tab */}
          <TabsContent value="complaints" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3>My Submitted Complaints</h3>
                <Button onClick={() => setIsComplaintDialogOpen(true)}>
                  <Plus className="size-4 mr-2" />
                  New Complaint
                </Button>
              </div>

              {myComplaints.length > 0 ? (
                <div className="space-y-3">
                  {myComplaints.map((complaint) => (
                    <div key={complaint.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4>{complaint.title}</h4>
                            <Badge className={
                              complaint.priority === 'critical' ? 'bg-red-100 text-red-800' :
                              complaint.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              complaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }>
                              {complaint.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{complaint.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="capitalize">{complaint.type}</span>
                            <span>•</span>
                            <span>Filed on {complaint.date}</span>
                            <span>•</span>
                            <span>ID: {complaint.id}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusIcon(complaint.status)}
                          <span className="text-sm capitalize">{complaint.status}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        {complaint.status === 'resolved' && (
                          <Button variant="outline" size="sm">Provide Feedback</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <AlertTriangle className="size-12 mx-auto mb-2 opacity-20" />
                  <p>No complaints submitted yet</p>
                  <Button 
                    className="mt-4" 
                    variant="outline" 
                    onClick={() => setIsComplaintDialogOpen(true)}
                  >
                    Submit Your First Complaint
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-4">
            <Card className="p-6">
              <h3 className="mb-4">Available Job Opportunities</h3>
              <div className="space-y-4">
                {mockJobOpportunities.map((job) => (
                  <div key={job.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4>{job.title}</h4>
                          <Badge variant="outline">{job.positions} positions</Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="size-4 text-gray-600" />
                          <span className="text-sm text-gray-600">{job.agency}</span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <MapPin className="size-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="size-4" />
                            {job.salary}
                          </span>
                        </div>
                        <p className="text-sm mb-3">{job.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-sm text-gray-600">Requirements:</span>
                          {job.requirements.map((req, idx) => (
                            <Badge key={idx} variant="secondary">{req}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleApplyJob(job)}
                      >
                        Apply Now
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setSelectedJob(job)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="mb-4">Government Support Services</h3>
                <div className="space-y-3">
                  <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <h4 className="mb-1">Healthcare Facilities</h4>
                    <p className="text-sm text-gray-600">Access to medical centers and health services</p>
                  </div>
                  <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <h4 className="mb-1">Legal Assistance</h4>
                    <p className="text-sm text-gray-600">Free legal consultation and support</p>
                  </div>
                  <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <h4 className="mb-1">Housing Support</h4>
                    <p className="text-sm text-gray-600">Accommodation facilities and services</p>
                  </div>
                  <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <h4 className="mb-1">Skills Training</h4>
                    <p className="text-sm text-gray-600">Professional development programs</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-4">Important Contacts</h3>
                <div className="space-y-3">
                  <div className="border rounded-lg p-4">
                    <h4 className="mb-1">Emergency Hotline</h4>
                    <p className="text-sm text-gray-600">24/7 support: +971-800-WORKER</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="mb-1">Government Office</h4>
                    <p className="text-sm text-gray-600">+971-4-GOVT-123</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="mb-1">My Agency</h4>
                    <p className="text-sm text-gray-600">{workerInfo.agency}</p>
                    <p className="text-sm text-gray-600">+971-4-2345678</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="mb-1">Embassy Contact</h4>
                    <p className="text-sm text-gray-600">Philippine Embassy: +971-2-XXX-XXXX</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="mb-4">Know Your Rights</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="mb-2">Timely Payment</h4>
                  <p className="text-sm text-gray-600">
                    You have the right to receive your salary on time every month as stated in your contract.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="mb-2">Safe Workplace</h4>
                  <p className="text-sm text-gray-600">
                    Your employer must provide a safe working environment with proper safety equipment.
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="mb-2">Healthcare Access</h4>
                  <p className="text-sm text-gray-600">
                    You are entitled to healthcare benefits and medical treatment when needed.
                  </p>
                </div>
                <div className="border-l-4 border-amber-500 pl-4">
                  <h4 className="mb-2">Fair Treatment</h4>
                  <p className="text-sm text-gray-600">
                    You have the right to be treated with dignity and respect without discrimination.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Job Details Dialog */}
      {selectedJob && (
        <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedJob.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Agency</Label>
                <p>{selectedJob.agency}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Location</Label>
                  <p>{selectedJob.location}</p>
                </div>
                <div>
                  <Label>Salary</Label>
                  <p>{selectedJob.salary}</p>
                </div>
              </div>
              <div>
                <Label>Positions Available</Label>
                <p>{selectedJob.positions}</p>
              </div>
              <div>
                <Label>Description</Label>
                <p>{selectedJob.description}</p>
              </div>
              <div>
                <Label>Requirements</Label>
                <ul className="list-disc list-inside space-y-1">
                  {selectedJob.requirements.map((req, idx) => (
                    <li key={idx} className="text-sm">{req}</li>
                  ))}
                </ul>
              </div>
              <div>
                <Label>Posted Date</Label>
                <p>{selectedJob.posted}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => {
                  handleApplyJob(selectedJob);
                  setSelectedJob(null);
                }}>
                  Apply for This Position
                </Button>
                <Button variant="outline" onClick={() => setSelectedJob(null)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}