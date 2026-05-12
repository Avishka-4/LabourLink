import { useEffect } from 'react';
import { Button, Card } from '@/components';

export default function LandingPage() {
  useEffect(() => {
    document.title = 'LabourLink - Home';
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">LabourLink</h1>
        <p className="text-base text-muted-foreground">
          A migrant workers management system for workers, job seekers, agencies,
          and administrators.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button>Get Started</Button>
          <Button variant="outline">Browse Jobs</Button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Worker Portal</h2>
            <p className="text-sm text-muted-foreground">
              Submit and track complaints, access resources.
            </p>
          </div>
        </Card>
        <Card>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Job Seeker Portal</h2>
            <p className="text-sm text-muted-foreground">
              Browse jobs and manage applications.
            </p>
          </div>
        </Card>
        <Card>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Agency Portal</h2>
            <p className="text-sm text-muted-foreground">
              Post jobs and manage applicants.
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}
