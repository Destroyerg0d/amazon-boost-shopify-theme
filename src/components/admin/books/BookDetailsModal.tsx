import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Eye,
  Download,
  BookOpen,
  User,
  Calendar,
  Check
} from 'lucide-react';
import { Book } from './types';

interface BookDetailsModalProps {
  book: Book;
  onReview: (book: Book) => void;
  getStatusBadge: (status: string | null) => JSX.Element;
}

const BookDetailsModal = ({ book, onReview, getStatusBadge }: BookDetailsModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Eye className="h-4 w-4" />
          Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Book Review - {book.title}
          </DialogTitle>
          <DialogDescription>
            Complete book information and review tools
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Book Cover and Actions */}
          <div className="space-y-4">
            {book.front_cover_url ? (
              <img
                src={book.front_cover_url}
                alt={book.title}
                className="w-full max-w-48 h-auto object-cover rounded-lg shadow-md mx-auto"
              />
            ) : (
              <div className="w-full max-w-48 h-64 bg-muted rounded-lg flex items-center justify-center mx-auto">
                <BookOpen className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="space-y-3">
              {book.manuscript_url ? (
                <>
                  <Button variant="default" size="sm" className="w-full gap-2 bg-primary hover:bg-primary/90" asChild>
                    <a href={book.manuscript_url} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4" />
                      📄 Download Manuscript
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full gap-2 border-primary/30 hover:bg-primary/5" asChild>
                    <a href={book.manuscript_url} target="_blank" rel="noopener noreferrer">
                      <Eye className="h-4 w-4" />
                      👀 View in Browser
                    </a>
                  </Button>
                </>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
                  <p className="text-sm text-amber-700">📭 No manuscript uploaded yet</p>
                </div>
              )}
              <Button
                size="sm"
                className="w-full gap-2 mt-3"
                onClick={() => onReview(book)}
              >
                <Check className="h-4 w-4" />
                📝 Review Book
              </Button>
            </div>
          </div>

          {/* Book Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Title</Label>
                <p className="text-sm font-medium">{book.title}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Author</Label>
                <p className="text-sm">{book.author || 'Not specified'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Genre</Label>
                <p className="text-sm">{book.genre || 'Not specified'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Language</Label>
                <p className="text-sm">{book.language || 'English'}</p>
              </div>
              {book.asin && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">ASIN</Label>
                  <p className="text-sm font-mono">{book.asin}</p>
                </div>
              )}
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                <div className="mt-1">{getStatusBadge(book.approval_status)}</div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-muted-foreground">Submitted by</Label>
              <div className="flex items-center gap-2 mt-1">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{book.profiles?.full_name}</span>
                <span className="text-xs text-muted-foreground">({book.profiles?.email})</span>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-muted-foreground">Upload Date</Label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{new Date(book.uploaded_at).toLocaleString()}</span>
              </div>
            </div>

            {book.description && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                <p className="text-sm mt-1 p-3 bg-muted rounded-lg">{book.description}</p>
              </div>
            )}

            {book.author_note && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Author Note</Label>
                <p className="text-sm mt-1 p-3 bg-muted rounded-lg">{book.author_note}</p>
              </div>
            )}

            {book.admin_feedback && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Previous Admin Feedback</Label>
                <p className="text-sm mt-1 p-3 bg-destructive/10 border-l-4 border-destructive rounded-lg">{book.admin_feedback}</p>
              </div>
            )}

            {book.explicit_content && (
              <div className="p-3 bg-amber-50 border-l-4 border-amber-400 rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-amber-600 border-amber-600">
                    Explicit Content
                  </Badge>
                  <span className="text-sm text-amber-700">This book contains explicit content</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookDetailsModal;