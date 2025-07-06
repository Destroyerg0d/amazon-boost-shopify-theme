import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { BookReviewFormProps } from './types';

const BookReviewForm = ({ book, onUpdate, onCancel }: BookReviewFormProps) => {
  const [feedback, setFeedback] = useState(book.admin_feedback || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await onUpdate(book.id, 'approved', feedback);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!feedback.trim()) {
      alert('Please provide feedback when rejecting a book. This helps authors understand what needs improvement.');
      return;
    }
    setIsLoading(true);
    try {
      await onUpdate(book.id, 'rejected', feedback);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentStatusMessage = () => {
    switch (book.approval_status) {
      case 'approved':
        return '✅ This book is currently approved. You can still reject it if needed.';
      case 'rejected':
        return '❌ This book is currently rejected. You can approve it if the issues have been resolved.';
      default:
        return '⏳ This book is under review. Choose to approve or reject it.';
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted/50 rounded-lg border">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-lg">{book.title}</h4>
            <p className="text-sm text-muted-foreground">by {book.author || 'Unknown Author'}</p>
            <p className="text-sm text-muted-foreground">
              Submitted by: <span className="font-medium">{book.profiles?.full_name || 'Unknown User'}</span> 
              <span className="text-xs">({book.profiles?.email || 'No email'})</span>
            </p>
          </div>
          <div className="ml-4">
            {book.approval_status && (
              <Badge variant={book.approval_status === 'approved' ? 'default' : book.approval_status === 'rejected' ? 'destructive' : 'secondary'}>
                {book.approval_status === 'approved' ? '✅ Approved' : 
                 book.approval_status === 'rejected' ? '❌ Rejected' : '⏳ Under Review'}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground bg-background/50 p-3 rounded border-l-4 border-primary/30">
          {getCurrentStatusMessage()}
        </div>
      </div>

      <div>
        <Label htmlFor="feedback" className="text-base font-medium">
          Admin Feedback {book.approval_status === 'rejected' && '(Required for rejection)'}
        </Label>
        <p className="text-sm text-muted-foreground mb-2">
          Provide constructive feedback to help the author understand your decision.
        </p>
        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter your feedback here... This will be shared with the author to help them improve their submission."
          rows={4}
          className="min-h-[100px]"
        />
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleReject}
          className="gap-2"
          disabled={isLoading}
        >
          <X className="h-4 w-4" />
          {isLoading ? 'Rejecting...' : 'Reject Book'}
        </Button>
        <Button
          type="button"
          onClick={handleApprove}
          className="gap-2"
          disabled={isLoading}
        >
          <Check className="h-4 w-4" />
          {isLoading ? 'Approving...' : 'Approve Book'}
        </Button>
      </div>
    </div>
  );
};

export default BookReviewForm;