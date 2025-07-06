import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Check, X } from 'lucide-react';
import { BookReviewFormProps } from './types';

const BookReviewForm = ({ book, onUpdate, onCancel }: BookReviewFormProps) => {
  const [feedback, setFeedback] = useState(book.admin_feedback || '');

  const handleApprove = () => {
    onUpdate(book.id, 'approved', feedback);
  };

  const handleReject = () => {
    if (!feedback.trim()) {
      alert('Please provide feedback when rejecting a book.');
      return;
    }
    onUpdate(book.id, 'rejected', feedback);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium">{book.title}</h4>
        <p className="text-sm text-muted-foreground">by {book.author}</p>
        <p className="text-sm text-muted-foreground">
          Submitted by: {book.profiles?.full_name} ({book.profiles?.email})
        </p>
      </div>

      <div>
        <Label htmlFor="feedback">Admin Feedback</Label>
        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Provide feedback to the author..."
          rows={4}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleReject}
          className="gap-2"
        >
          <X className="h-4 w-4" />
          Reject
        </Button>
        <Button
          type="button"
          onClick={handleApprove}
          className="gap-2"
        >
          <Check className="h-4 w-4" />
          Approve
        </Button>
      </div>
    </div>
  );
};

export default BookReviewForm;