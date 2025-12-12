import { MorphSurface } from '@/components/ui/morph-surface';
import { submitFeedback } from '@/actions/feedback';
import { toast } from 'sonner';

export function UserFeedback() {
  return (
    <MorphSurface
      triggerLabel="Send Feedback"
      placeholder="Share your thoughts..."
      collapsedWidth="100%"
      expandedWidth="100%"
      className="w-full"
      onSubmit={async (formData) => {
        const result = await submitFeedback(formData);

        if (result.error) {
          toast.error(result.error);
          throw new Error(result.error);
        }
      }}
      onSuccess={() => {
        toast.success('Thank you for your feedback!');
      }}
    />
  );
}
