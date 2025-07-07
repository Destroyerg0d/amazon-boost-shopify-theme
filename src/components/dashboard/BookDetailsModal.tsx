import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  User, 
  Calendar, 
  Globe, 
  Tag, 
  FileText, 
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  Download
} from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  genre: string | null;
  language: string | null;
  asin: string | null;
  manuscript_url: string | null;
  front_cover_url: string | null;
  explicit_content: boolean | null;
  upload_status: string | null;
  approval_status: string | null;
  admin_feedback: string | null;
  author_note: string | null;
  uploaded_at: string;
  updated_at: string | null;
}

interface BookDetailsModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (book: Book) => void;
}

const getStatusConfig = (status: string | null) => {
  switch (status) {
    case 'approved':
      return {
        color: 'bg-success/10 text-success border-success/20',
        icon: CheckCircle,
        label: 'Approved'
      };
    case 'rejected':
      return {
        color: 'bg-destructive/10 text-destructive border-destructive/20',
        icon: AlertCircle,
        label: 'Rejected'
      };
    case 'under_review':
    default:
      return {
        color: 'bg-warning/10 text-warning border-warning/20',
        icon: Clock,
        label: 'Under Review'
      };
  }
};

const BookDetailsModal = ({ book, isOpen, onClose, onEdit }: BookDetailsModalProps) => {
  if (!book) return null;

  const statusConfig = getStatusConfig(book.approval_status);
  const StatusIcon = statusConfig.icon;
  const isApproved = book.approval_status === 'approved';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <BookOpen className="w-6 h-6 text-primary" />
            Book Details
          </DialogTitle>
          <DialogDescription>
            Complete information about your book submission
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Banner */}
          <Card className={`border-2 ${statusConfig.color}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <StatusIcon className="w-6 h-6" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{statusConfig.label}</h3>
                  {book.approval_status === 'rejected' && book.admin_feedback && (
                    <p className="text-sm mt-1 opacity-90">{book.admin_feedback}</p>
                  )}
                  {book.approval_status === 'approved' && (
                    <p className="text-sm mt-1 opacity-90">
                      Your book has been approved and is ready for review campaigns!
                    </p>
                  )}
                  {book.approval_status === 'under_review' && (
                    <p className="text-sm mt-1 opacity-90">
                      Your book is currently being reviewed by our team. We'll notify you once it's approved.
                    </p>
                  )}
                </div>
                {onEdit && (
                  <Button 
                    variant={isApproved ? "outline" : "default"}
                    onClick={() => onEdit(book)}
                    disabled={isApproved}
                    className={isApproved ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    {isApproved ? (
                      <>
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Edit Disabled
                      </>
                    ) : (
                      "Edit Book"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Book Information Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Title</Label>
                  <p className="text-lg font-semibold">{book.title}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Author</Label>
                  <p className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {book.author || 'Not specified'}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Genre</Label>
                  <p className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    {book.genre ? (
                      <Badge variant="secondary">{book.genre}</Badge>
                    ) : (
                      'Not specified'
                    )}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Language</Label>
                  <p className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    {book.language || 'Not specified'}
                  </p>
                </div>

                {book.asin && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">ASIN</Label>
                    <p className="font-mono text-sm bg-muted p-2 rounded">{book.asin}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Additional Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Uploaded</Label>
                  <p>{new Date(book.uploaded_at).toLocaleString()}</p>
                </div>

                {book.updated_at && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                    <p>{new Date(book.updated_at).toLocaleString()}</p>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Content Rating</Label>
                  <Badge variant={book.explicit_content ? "destructive" : "secondary"}>
                    {book.explicit_content ? "Explicit Content" : "General Audience"}
                  </Badge>
                </div>

                {book.manuscript_url && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Manuscript</Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-1"
                      onClick={() => window.open(book.manuscript_url!, '_blank')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}

                {book.front_cover_url && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Cover Image</Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-1"
                      onClick={() => window.open(book.front_cover_url!, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Cover
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          {book.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{book.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Author Notes */}
          {book.author_note && (
            <Card>
              <CardHeader>
                <CardTitle>Author Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{book.author_note}</p>
              </CardContent>
            </Card>
          )}

          {/* Admin Feedback */}
          {book.admin_feedback && (
            <Card className="border-muted">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-muted-foreground" />
                  Admin Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                  {book.admin_feedback}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            {onEdit && (
              <Button 
                onClick={() => onEdit(book)}
                disabled={isApproved}
                className={`flex-1 ${isApproved ? 'opacity-50 cursor-not-allowed' : ''}`}
                variant={isApproved ? "outline" : "default"}
              >
                {isApproved ? (
                  <>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Cannot Edit (Book Approved)
                  </>
                ) : (
                  "Edit Book"
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookDetailsModal;