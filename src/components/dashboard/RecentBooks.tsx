import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import BookDetailsModal from './BookDetailsModal';
import { 
  BookOpen,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  AlertCircle
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

interface RecentBooksProps {
  books: Book[];
  onAddBook: () => void;
  onViewBook?: (book: Book) => void;
  onEditBook?: (book: Book) => void;
  onDeleteBook?: (book: Book) => void;
}

const getStatusColor = (status: string | null) => {
  switch (status) {
    case 'approved':
      return 'bg-success/10 text-success';
    case 'rejected':
      return 'bg-destructive/10 text-destructive';
    case 'under_review':
    default:
      return 'bg-warning/10 text-warning';
  }
};

const getStatusText = (status: string | null) => {
  switch (status) {
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    case 'under_review':
    default:
      return 'Under Review';
  }
};

const RecentBooks = ({ books, onAddBook, onViewBook, onEditBook, onDeleteBook }: RecentBooksProps) => {
  const { toast } = useToast();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleViewDetails = (book: Book) => {
    setSelectedBook(book);
    setIsDetailsModalOpen(true);
    if (onViewBook) {
      onViewBook(book);
    }
  };

  const handleEditBook = (book: Book) => {
    if (book.approval_status === 'approved') {
      toast({
        title: "Cannot Edit Book",
        description: "This book has been approved and cannot be modified. Approved books are locked to maintain review integrity.",
        variant: "destructive"
      });
      return;
    }
    
    if (onEditBook) {
      onEditBook(book);
    } else {
      toast({
        title: "Edit functionality",
        description: "Edit book functionality would open here",
      });
    }
  };

  const handleDeleteBook = (book: Book) => {
    if (book.approval_status === 'approved') {
      toast({
        title: "Cannot Delete Book",
        description: "Approved books cannot be deleted as they may be part of active review campaigns.",
        variant: "destructive"
      });
      return;
    }
    
    if (onDeleteBook) {
      onDeleteBook(book);
    } else {
      toast({
        title: "Delete functionality", 
        description: "Delete book functionality would open here",
      });
    }
  };

  const isApproved = (book: Book) => book.approval_status === 'approved';

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Recent Books
          </CardTitle>
          <CardDescription>Your latest book uploads and their current status</CardDescription>
        </CardHeader>
        <CardContent>
          {books.slice(0, 3).length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">No books uploaded yet</h3>
              <p className="text-muted-foreground mb-4">
                Upload your first book to start getting professional reviews and boost your Amazon rankings!
              </p>
              <Button onClick={onAddBook} size="lg" className="gap-2">
                <Plus className="w-4 h-4" />
                Upload Your First Book
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {books.slice(0, 3).map((book) => (
                <div 
                  key={book.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${
                      isApproved(book) 
                        ? 'bg-success/10 border border-success/20' 
                        : 'bg-primary/10'
                    }`}>
                      <BookOpen className={`w-5 h-5 ${
                        isApproved(book) ? 'text-success' : 'text-primary'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{book.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        {book.genre && <Badge variant="secondary">{book.genre}</Badge>}
                        <Badge 
                          className={getStatusColor(book.approval_status)}
                          title={book.approval_status === 'rejected' ? book.admin_feedback || 'Rejected by admin' : undefined}
                        >
                          {getStatusText(book.approval_status)}
                        </Badge>
                        <span>•</span>
                        <span>{new Date(book.uploaded_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => handleViewDetails(book)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem 
                        onClick={() => handleEditBook(book)}
                        disabled={isApproved(book)}
                        className={isApproved(book) ? 'opacity-50 cursor-not-allowed' : ''}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        {isApproved(book) ? (
                          <div className="flex items-center gap-2">
                            Edit Book
                            <AlertCircle className="w-3 h-3" />
                          </div>
                        ) : (
                          'Edit Book'
                        )}
                      </DropdownMenuItem>
                      
                      {!isApproved(book) && (
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive" 
                          onClick={() => handleDeleteBook(book)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Book
                        </DropdownMenuItem>
                      )}
                      
                      {isApproved(book) && (
                        <DropdownMenuItem 
                          disabled
                          className="opacity-50 cursor-not-allowed"
                          title="Approved books cannot be deleted"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          <div className="flex items-center gap-2">
                            Delete Disabled
                            <AlertCircle className="w-3 h-3" />
                          </div>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
              
              {books.length > 3 && (
                <div className="text-center pt-4 border-t">
                  <Button variant="outline" onClick={() => window.location.href = '/books'}>
                    View All Books ({books.length})
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <BookDetailsModal
        book={selectedBook}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedBook(null);
        }}
        onEdit={handleEditBook}
      />
    </>
  );
};

export default RecentBooks;