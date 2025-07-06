import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  BookOpen,
  Plus,
  Search,
  MoreVertical,
  Calendar,
  ArrowLeft,
  Eye,
  Edit,
  Trash2,
  ExternalLink
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

interface BooksListProps {
  onBack: () => void;
  onAddBook: () => void;
}

const BooksList = ({ onBack, onAddBook }: BooksListProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      fetchBooks();
    }
  }, [user]);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', user?.id)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your books"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (book: Book) => {
    // You can implement a detailed view modal or navigate to a details page
    toast({
      title: "Book Details",
      description: `Viewing details for "${book.title}"`,
    });
    console.log('View book details:', book);
  };

  const handleEditBook = (book: Book) => {
    // You can implement edit functionality or navigate to edit page
    toast({
      title: "Edit Book",
      description: `Edit mode for "${book.title}" - Feature coming soon!`,
    });
    console.log('Edit book:', book);
  };

  const handleDeleteBook = async (book: Book) => {
    if (!confirm(`Are you sure you want to delete "${book.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', book.id)
        .eq('user_id', user?.id); // Extra security check

      if (error) throw error;

      toast({
        title: "Success",
        description: `"${book.title}" has been deleted successfully.`,
      });

      fetchBooks(); // Refresh the list
    } catch (error) {
      console.error('Error deleting book:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the book. Please try again.",
      });
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.genre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'approved':
        return 'bg-success/10 text-success border-success/20';
      case 'rejected':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'under_review':
      default:
        return 'bg-warning/10 text-warning border-warning/20';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">My Books</h2>
          <p className="text-muted-foreground">Manage your book collection</p>
        </div>
      </div>

      {/* Search and Add Book */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
        <Button onClick={onAddBook}>
          <Plus className="w-4 h-4 mr-2" />
          Add Book
        </Button>
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredBooks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            {searchQuery ? (
              <>
                <p className="text-lg font-medium mb-2">No books found</p>
                <p className="text-muted-foreground">Try adjusting your search terms</p>
              </>
            ) : (
              <>
                <p className="text-lg font-medium mb-2">No books uploaded yet</p>
                <p className="text-muted-foreground mb-4">Add your first book to get started</p>
                <Button onClick={onAddBook}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Book
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="hover:shadow-medium transition-all hover:scale-105 group">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors mb-2">
                      {book.title}
                    </CardTitle>
                    {book.author && (
                      <p className="text-sm text-muted-foreground mb-3">by {book.author}</p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
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
                      {book.asin && (
                        <DropdownMenuItem onClick={() => window.open(`https://amazon.com/dp/${book.asin}`, '_blank')}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View on Amazon
                        </DropdownMenuItem>
                      )}
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
                <CardDescription>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {book.genre && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {book.genre}
                        </Badge>
                      )}
                      <Badge 
                        className={getStatusColor(book.approval_status)}
                        title={book.approval_status === 'rejected' ? book.admin_feedback || 'Rejected by admin' : 
                               book.approval_status === 'approved' ? 'Your book has been approved!' :
                               'Your book is currently under review'}
                      >
                        {getStatusText(book.approval_status)}
                      </Badge>
                      {book.explicit_content && (
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          18+
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Uploaded {new Date(book.uploaded_at).toLocaleDateString()}
                      </div>
                      {book.language && (
                        <span className="text-xs">
                          {book.language}
                        </span>
                      )}
                    </div>
                    {book.asin && (
                      <div className="text-xs text-muted-foreground">
                        ASIN: {book.asin}
                      </div>
                    )}
                  </div>
                </CardDescription>
              </CardHeader>
              {book.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {book.description}
                  </p>
                  {book.author_note && (
                    <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Author's Note:</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {book.author_note}
                      </p>
                    </div>
                  )}
                </CardContent>
              )}
              {book.front_cover_url && (
                <CardContent className="pt-0">
                  <div className="flex justify-center">
                    <img 
                      src={book.front_cover_url} 
                      alt={`Cover of ${book.title}`}
                      className="w-20 h-28 object-cover rounded border shadow-sm"
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksList;