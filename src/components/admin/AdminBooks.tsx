import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Filter,
  BookOpen
} from 'lucide-react';
import { Book } from './books/types';
import BookReviewForm from './books/BookReviewForm';
import BooksTable from './books/BooksTable';

const AdminBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select(`
          *,
          profiles!books_user_id_fkey (full_name, email)
        `)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setBooks((data as any) || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch books',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBookStatus = async (bookId: string, status: string, feedback?: string) => {
    try {
      const { error } = await supabase
        .from('books')
        .update({
          approval_status: status,
          admin_feedback: feedback || null,
        })
        .eq('id', bookId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Book ${status} successfully`,
      });

      fetchBooks();
      setIsReviewModalOpen(false);
      setSelectedBook(null);
    } catch (error) {
      console.error('Error updating book status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update book status',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string | null) => {
    const statusConfig = {
      under_review: { variant: 'secondary' as const, label: 'Under Review' },
      approved: { variant: 'success' as const, label: 'Approved' },
      rejected: { variant: 'destructive' as const, label: 'Rejected' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.under_review;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || book.approval_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted-foreground/20 rounded w-1/4 animate-pulse"></div>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted-foreground/20 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Books Management</h2>
        <p className="text-muted-foreground">Review and approve submitted books</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle>All Books</CardTitle>
              <CardDescription>Review book submissions and manage approval status</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <BooksTable 
            books={filteredBooks}
            getStatusBadge={getStatusBadge}
            onReview={(book) => {
              setSelectedBook(book);
              setIsReviewModalOpen(true);
            }}
          />
          {filteredBooks.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No books found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Book Modal */}
      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Book</DialogTitle>
            <DialogDescription>
              Approve or reject this book submission
            </DialogDescription>
          </DialogHeader>
          {selectedBook && (
            <BookReviewForm
              book={selectedBook}
              onUpdate={updateBookStatus}
              onCancel={() => {
                setIsReviewModalOpen(false);
                setSelectedBook(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};


export default AdminBooks;