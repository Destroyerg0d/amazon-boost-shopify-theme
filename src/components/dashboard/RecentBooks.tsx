import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  BookOpen,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2
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
  const handleViewDetails = (book: Book) => {
    if (onViewBook) {
      onViewBook(book);
    } else {
      // Default action - could show a toast or modal
      console.log('View book details:', book);
    }
  };

  const handleEditBook = (book: Book) => {
    if (onEditBook) {
      onEditBook(book);
    } else {
      // Default action
      console.log('Edit book:', book);
    }
  };

  const handleDeleteBook = (book: Book) => {
    if (onDeleteBook) {
      onDeleteBook(book);
    } else {
      // Default action
      console.log('Delete book:', book);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Recent Books
        </CardTitle>
        <CardDescription>Your latest book uploads</CardDescription>
      </CardHeader>
      <CardContent>
        {books.slice(0, 3).length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No books uploaded yet</p>
            <Button onClick={onAddBook} className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Book
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {books.slice(0, 3).map((book) => (
              <div key={book.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{book.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(book)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditBook(book)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Book
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive" 
                      onClick={() => handleDeleteBook(book)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Book
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentBooks;