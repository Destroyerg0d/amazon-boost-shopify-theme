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
          profiles (full_name, email)
        `)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setBooks((data as any) || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch books. Please refresh the page.',
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
          updated_at: new Date().toISOString(),
        })
        .eq('id', bookId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Book has been ${status} successfully!`,
      });

      fetchBooks();
      setIsReviewModalOpen(false);
      setSelectedBook(null);
    } catch (error) {
      console.error('Error updating book status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update book status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string | null) => {
    const statusConfig = {
      under_review: { variant: 'secondary' as const, label: 'Under Review', icon: '🔍' },
      approved: { variant: 'default' as const, label: 'Approved', icon: '✅' }, // Changed from success variant
      rejected: { variant: 'destructive' as const, label: 'Rejected', icon: '❌' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.under_review;
    return (
      <Badge variant={config.variant} className="gap-1">
        <span>{config.icon}</span>
        {config.label}
      </Badge>
    );
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">📚 Books Management</h2>
          <p className="text-muted-foreground">Review submissions, manage approvals, and download manuscripts</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="px-3 py-1 bg-muted rounded-full">
            Total Books: {books.length}
          </span>
          <span className="px-3 py-1 bg-muted rounded-full">
            Filtered: {filteredBooks.length}
          </span>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b bg-muted/30">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                📖 Book Submissions
              </CardTitle>
              <CardDescription>
                Review, approve, reject, and download manuscripts for all submitted books
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, author, or user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">🔍 All Status</SelectItem>
                  <SelectItem value="under_review">⏳ Under Review</SelectItem>
                  <SelectItem value="approved">✅ Approved</SelectItem>
                  <SelectItem value="rejected">❌ Rejected</SelectItem>
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
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No books found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'No books have been submitted yet'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Book Modal */}
      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              📝 Review Book: {selectedBook?.title}
            </DialogTitle>
            <DialogDescription>
              You can approve or reject this book submission at any time, regardless of its current status.
              Provide feedback to help authors improve their work.
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