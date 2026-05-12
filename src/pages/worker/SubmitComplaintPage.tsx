import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ComplaintForm } from '@/components';
import { workerService } from '@/services/workerService';

export default function SubmitComplaintPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    document.title = 'Submit Complaint';
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <ComplaintForm
        isLoading={loading}
        error={error}
        onSubmit={async (data) => {
          setLoading(true);
          setError(undefined);
          try {
            await workerService.submitComplaint({
              type: data.type,
              title: data.title,
              description: data.description,
            });
            navigate('/worker/complaints');
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Submission failed');
          } finally {
            setLoading(false);
          }
        }}
      />
    </div>
  );
}
