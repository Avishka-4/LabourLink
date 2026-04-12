import { useState } from 'react';
import { 
  Shield, Briefcase, Users, AlertTriangle, 
  CheckCircle, XCircle, Clock, Eye, Building2,
  Search, Bell, Send, Plus, Mail
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useNavigate } from 'react-router';
import { ThemeLanguageToggle } from '../components/theme-language-toggle';
import { 
  mockJobSubmissions, 
  adminDashboardStats, 
  mockEmergencyAlerts,
  mockAdminComplaints,
  type JobPostingSubmission,
  type EmergencyAlert,
  type AdminComplaint
} from '../data/admin-mock-data';
import { mockAgencies, mockWorkers } from '../data/mock-data';
import { toast } from 'sonner';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [selectedSubmission, setSelectedSubmission] = useState<JobPostingSubmission | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [rejectionReason, setRejectionReason] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleReviewSubmission = (submission: JobPostingSubmission, action: 'approve' | 'reject') => {
    setSelectedSubmission(submission);
    setReviewAction(action);
    setIsReviewDialogOpen(true);
  };

  const handleConfirmReview = () => {
    if (reviewAction === 'reject' && !rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    const actionText = reviewAction === 'approve' ? 'approved' : 'rejected';
    toast.success(`Job posting ${actionText} successfully`);
    setIsReviewDialogOpen(false);
    setRejectionReason('');
    setSelectedSubmission(null);
  };

  const handleViewPaymentSlip = (submission: JobPostingSubmission) => {
    toast.info(`Opening payment slip: ${submission.paymentSlipUrl}`);
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    toast.success('Emergency alert created and notifications sent!');
    setIsAlertDialogOpen(false);
    form.reset();
  };

  const filteredSubmissions = mockJobSubmissions.filter(sub => {
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
    const matchesSearch = searchQuery === '' ||
      sub.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.agencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getAlertTypeColor = (type: string) => {
    switch(type) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-300';
      case 'warning': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'announcement': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-900 to-indigo-700 dark:from-indigo-950 dark:to-indigo-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <Users className="size-8" />
              </div>
              <div>
                <h1 className="text-white">LabourLink Admin</h1>
                <p className="text-sm text-indigo-200">Migrant Worker Management Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeLanguageToggle />
              <Badge variant="outline" className="text-white border-white">Administrator</Badge>
              <Button variant="ghost" className="text-white hover:bg-indigo-800" onClick={() => navigate('/admin/login')}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">Pending Approvals</p>
                <p className="text-3xl dark:text-white">{adminDashboardStats.pendingApprovals}</p>
              </div>
              <Clock className="size-10 text-blue-600 dark:text-blue-400 opacity-30" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 dark:text-green-300 mb-1">Approved Today</p>
                <p className="text-3xl dark:text-white">{adminDashboardStats.approvedToday}</p>
              </div>
              <CheckCircle className="size-10 text-green-600 dark:text-green-400 opacity-30" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-700 dark:text-amber-300 mb-1">Total Agencies</p>
                <p className="text-3xl dark:text-white">{adminDashboardStats.totalAgencies}</p>
              </div>
              <Building2 className="size-10 text-amber-600 dark:text-amber-400 opacity-30" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 dark:text-purple-300 mb-1">Active Workers</p>
                <p className="text-3xl dark:text-white">{adminDashboardStats.activeWorkers}</p>
              </div>
              <Users className="size-10 text-purple-600 dark:text-purple-400 opacity-30" />
            </div>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="alerts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="alerts">
              <Bell className="size-4 mr-2" />
              Alerts & Notices
            </TabsTrigger>
            <TabsTrigger value="job-approvals">
              Job Approvals
              {adminDashboardStats.pendingApprovals > 0 && (
                <Badge className="ml-2 bg-red-600">{adminDashboardStats.pendingApprovals}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="complaints">
              Complaints
              {mockAdminComplaints.length > 0 && (
                <Badge className="ml-2 bg-amber-600">{mockAdminComplaints.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="agencies">Agencies</TabsTrigger>
            <TabsTrigger value="workers">Workers</TabsTrigger>
          </TabsList>

          {/* Emergency Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <Card className="p-6 dark:bg-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="dark:text-white">Emergency Alerts & Notices</h3>
                <Dialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                      <Plus className="size-4 mr-2" />
                      Create Alert
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="dark:bg-gray-800">
                    <DialogHeader>
                      <DialogTitle className="dark:text-white">Create Emergency Alert/Notice</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateAlert} className="space-y-4">
                      <div>
                        <Label>Alert Type</Label>
                        <Select name="type" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="emergency">🚨 Emergency</SelectItem>
                            <SelectItem value="warning">⚠️ Warning</SelectItem>
                            <SelectItem value="info">ℹ️ Information</SelectItem>
                            <SelectItem value="announcement">📢 Announcement</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Target Audience</Label>
                        <Select name="audience" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select audience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Users</SelectItem>
                            <SelectItem value="workers">Existing Workers Only</SelectItem>
                            <SelectItem value="jobseekers">Job Seekers Only</SelectItem>
                            <SelectItem value="agencies">Agencies Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Alert Title *</Label>
                        <Input name="title" placeholder="Enter alert title" required />
                      </div>

                      <div>
                        <Label>Alert Message *</Label>
                        <Textarea 
                          name="message" 
                          placeholder="Enter detailed alert message..."
                          rows={4}
                          required
                        />
                      </div>

                      <div>
                        <Label>Expiry Date</Label>
                        <Input name="expiryDate" type="date" required />
                      </div>

                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="sendEmail" name="sendEmail" defaultChecked />
                        <Label htmlFor="sendEmail" className="cursor-pointer">
                          Send email notifications to target audience
                        </Label>
                      </div>

                      <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={() => setIsAlertDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                          <Send className="size-4 mr-2" />
                          Create & Notify
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {mockEmergencyAlerts.map((alert) => (
                  <Card key={alert.id} className={`p-4 ${getAlertTypeColor(alert.type)} border-2`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg">{alert.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {alert.type.toUpperCase()}
                          </Badge>
                          {alert.emailSent && (
                            <Badge variant="outline" className="text-xs flex items-center gap-1">
                              <Mail className="size-3" />
                              Email Sent
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm mb-3">{alert.message}</p>
                        <div className="flex items-center gap-4 text-xs">
                          <span>👥 Target: {alert.targetAudience}</span>
                          <span>📅 Created: {alert.createdDate}</span>
                          <span>⏰ Expires: {alert.expiryDate}</span>
                          <span>👤 By: {alert.createdBy}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          Deactivate
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Job Approvals Tab */}
          <TabsContent value="job-approvals" className="space-y-6">
            <Card className="p-6 dark:bg-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="dark:text-white">Job Posting Submissions</h3>
                <div className="flex gap-2">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
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

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="text-left p-3 text-sm dark:text-gray-200">Job ID</th>
                      <th className="text-left p-3 text-sm dark:text-gray-200">Job Title</th>
                      <th className="text-left p-3 text-sm dark:text-gray-200">Agency</th>
                      <th className="text-left p-3 text-sm dark:text-gray-200">Location</th>
                      <th className="text-left p-3 text-sm dark:text-gray-200">Positions</th>
                      <th className="text-left p-3 text-sm dark:text-gray-200">Payment</th>
                      <th className="text-left p-3 text-sm dark:text-gray-200">Submitted</th>
                      <th className="text-left p-3 text-sm dark:text-gray-200">Status</th>
                      <th className="text-left p-3 text-sm dark:text-gray-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-gray-700">
                    {filteredSubmissions.map((submission) => (
                      <tr key={submission.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="p-3 text-sm dark:text-gray-300">{submission.id}</td>
                        <td className="p-3">
                          <div>
                            <p className="text-sm dark:text-gray-200">{submission.jobTitle}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{submission.salary}</p>
                          </div>
                        </td>
                        <td className="p-3 text-sm dark:text-gray-300">{submission.agencyName}</td>
                        <td className="p-3 text-sm dark:text-gray-300">{submission.location}</td>
                        <td className="p-3 text-sm dark:text-gray-300">{submission.positions}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm dark:text-gray-300">${submission.paymentAmount}</span>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewPaymentSlip(submission)}
                            >
                              <Eye className="size-4" />
                            </Button>
                          </div>
                        </td>
                        <td className="p-3 text-sm dark:text-gray-300">{submission.submittedDate}</td>
                        <td className="p-3">
                          <Badge 
                            variant={
                              submission.status === 'approved' ? 'default' :
                              submission.status === 'rejected' ? 'destructive' :
                              'secondary'
                            }
                          >
                            {submission.status}
                          </Badge>
                        </td>
                        <td className="p-3">
                          {submission.status === 'pending' ? (
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-green-600 hover:bg-green-50 dark:hover:bg-green-900"
                                onClick={() => handleReviewSubmission(submission, 'approve')}
                              >
                                <CheckCircle className="size-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                                onClick={() => handleReviewSubmission(submission, 'reject')}
                              >
                                <XCircle className="size-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button size="sm" variant="ghost">
                              <Eye className="size-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredSubmissions.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Briefcase className="size-12 mx-auto mb-2 opacity-20" />
                  <p>No job submissions found</p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Escalated Complaints Tab */}
          <TabsContent value="complaints" className="space-y-6">
            <Card className="p-6 dark:bg-gray-800">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="dark:text-white">Escalated Worker Complaints</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Complaints escalated to admin after no agency response</p>
                </div>
                <Badge className="bg-amber-600">{mockAdminComplaints.length} Escalated</Badge>
              </div>

              <div className="space-y-4">
                {mockAdminComplaints.map((complaint) => (
                  <Card key={complaint.id} className="p-4 border-l-4 border-l-amber-500 dark:bg-gray-700">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${getPriorityColor(complaint.priority)}`}>
                            {complaint.priority.toUpperCase()}
                          </Badge>
                          <Badge variant="secondary">{complaint.type}</Badge>
                          <Badge variant="outline">
                            {complaint.status}
                          </Badge>
                        </div>
                        <h4 className="mb-2 dark:text-white">Complaint ID: {complaint.id}</h4>
                        
                        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Worker</p>
                            <p className="dark:text-gray-200">{complaint.workerName} ({complaint.workerId})</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{complaint.workerNationality}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Agency</p>
                            <p className="dark:text-gray-200">{complaint.agencyName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{complaint.agencyId}</p>
                          </div>
                        </div>

                        <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-600 rounded">
                          <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">Original Complaint to Agency:</p>
                          <p className="text-sm dark:text-gray-100">{complaint.complaintToAgency}</p>
                        </div>

                        {complaint.agencyResponse && (
                          <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                            <p className="text-xs text-blue-600 dark:text-blue-300 mb-1">
                              Agency Response ({complaint.agencyResponseDate}):
                            </p>
                            <p className="text-sm dark:text-blue-100">{complaint.agencyResponse}</p>
                          </div>
                        )}

                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded">
                          <p className="text-xs text-amber-600 dark:text-amber-300 mb-1">
                            Escalation Reason ({complaint.escalatedDate}):
                          </p>
                          <p className="text-sm dark:text-amber-100">{complaint.escalatedReason}</p>
                        </div>

                        {complaint.assignedTo && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            👤 Assigned to: {complaint.assignedTo}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      {complaint.status === 'pending' && (
                        <>
                          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                            Assign Inspector
                          </Button>
                          <Button size="sm" variant="outline">
                            Contact Worker
                          </Button>
                          <Button size="sm" variant="outline">
                            Contact Agency
                          </Button>
                        </>
                      )}
                      {complaint.status === 'investigating' && (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Mark Resolved
                          </Button>
                          <Button size="sm" variant="outline">
                            View Investigation
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline">
                        View Full Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Agencies Tab */}
          <TabsContent value="agencies" className="space-y-6">
            <Card className="p-6 dark:bg-gray-800">
              <h3 className="mb-6 dark:text-white">Registered Agencies</h3>
              <div className="space-y-4">
                {mockAgencies.map((agency) => (
                  <div key={agency.id} className="border dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="dark:text-white">{agency.name}</h4>
                          <Badge variant={agency.status === 'good' ? 'default' : 'destructive'}>
                            {agency.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">License</p>
                            <p className="dark:text-gray-200">{agency.license}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">SLTDA Reg</p>
                            <p className="dark:text-gray-200">{agency.sltdaRegistration}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Workers</p>
                            <p className="dark:text-gray-200">{agency.totalWorkers}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Free Posts</p>
                            <p className="dark:text-gray-200">{agency.freePostsRemaining}/10</p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Rating</p>
                            <p className="dark:text-gray-200">⭐ {agency.rating.toFixed(1)}</p>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Workers Tab */}
          <TabsContent value="workers" className="space-y-6">
            <Card className="p-6 dark:bg-gray-800">
              <h3 className="mb-6 dark:text-white">Worker Database</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="text-left p-3 text-sm dark:text-gray-200">Worker ID</th>
                      <th className="text-left p-3 text-sm dark:text-gray-200">Name</th>
                      <th className="text-left p-3 text-sm dark:text-gray-200">Nationality</th>
                      <th className="text-left p-3 text-sm dark:text-gray-200">Position</th>
                      <th className="text-left p-3 text-sm dark:text-gray-200">Agency</th>
                      <th className="text-left p-3 text-sm dark:text-gray-200">Workplace</th>
                      <th className="text-left p-3 text-sm dark:text-gray-200">Status</th>
                      <th className="text-left p-3 text-sm dark:text-gray-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-gray-700">
                    {mockWorkers.map((worker) => (
                      <tr key={worker.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="p-3 text-sm dark:text-gray-300">{worker.id}</td>
                        <td className="p-3 text-sm dark:text-gray-200">{worker.name}</td>
                        <td className="p-3 text-sm dark:text-gray-300">{worker.nationality}</td>
                        <td className="p-3 text-sm dark:text-gray-300">{worker.position}</td>
                        <td className="p-3 text-sm dark:text-gray-300">{worker.agency}</td>
                        <td className="p-3 text-sm dark:text-gray-300">{worker.workplace}</td>
                        <td className="p-3">
                          <Badge variant={worker.status === 'active' ? 'default' : 'destructive'}>
                            {worker.status}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Button size="sm" variant="ghost">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white">
              {reviewAction === 'approve' ? 'Approve Job Posting' : 'Reject Job Posting'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedSubmission && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Job Title</p>
                <p className="dark:text-gray-200">{selectedSubmission.jobTitle}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Agency</p>
                <p className="dark:text-gray-200">{selectedSubmission.agencyName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Payment Amount</p>
                <p className="dark:text-gray-200">${selectedSubmission.paymentAmount}</p>
              </div>

              {reviewAction === 'reject' && (
                <div>
                  <Label>Rejection Reason *</Label>
                  <Textarea 
                    placeholder="Provide a detailed reason for rejection..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={4}
                  />
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleConfirmReview}
                  className={reviewAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                >
                  {reviewAction === 'approve' ? 'Approve' : 'Reject'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}