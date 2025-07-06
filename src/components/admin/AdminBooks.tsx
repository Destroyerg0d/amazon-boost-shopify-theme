import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Filter,
  Eye,
  Check,
  X,
  Download,
  BookOpen,
  User,
  Calendar
} from 'lucide-react';

interface Book {
  id: string;
  user_id: string;
  title: string;
  author: string | null;
  genre: string | null;
  description: string | null;
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
  profiles?: {
    full_name: string;
    email: string;
  } | null;
}

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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Author (User)</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {book.front_cover_url ? (
                          <img
                            src={book.front_cover_url}
                            alt={book.title}
                            className="w-10 h-14 object-cover rounded"
                          />
                        ) : (
                          <div className="w-10 h-14 bg-muted rounded flex items-center justify-center">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{book.title}</div>
                          {book.explicit_content && (
                            <Badge variant="outline" className="text-xs mt-1">
                              Explicit Content
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{book.author || 'Not specified'}</div>
                        <div className="text-sm text-muted-foreground">
                          {book.profiles?.full_name} ({book.profiles?.email})
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{book.genre || 'Not specified'}</Badge>
                    </TableCell>
                    <TableCell>{book.language || 'English'}</TableCell>
                    <TableCell>{getStatusBadge(book.approval_status)}</TableCell>
                    <TableCell>
                      {new Date(book.uploaded_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Book Details</DialogTitle>
                              <DialogDescription>
                                Review book information and content
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-sm font-medium">Title</Label>
                                  <p className="text-sm">{book.title}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Author</Label>
                                  <p className="text-sm">{book.author || 'Not specified'}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Genre</Label>
                                  <p className="text-sm">{book.genre || 'Not specified'}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Language</Label>
                                  <p className="text-sm">{book.language || 'English'}</p>
                                </div>
                                {book.asin && (
                                  <div>
                                    <Label className="text-sm font-medium">ASIN</Label>
                                    <p className="text-sm">{book.asin}</p>
                                  </div>
                                )}
                                <div>
                                  <Label className="text-sm font-medium">User</Label>
                                  <p className="text-sm">
                                    {book.profiles?.full_name} ({book.profiles?.email})
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-4">
                                {book.front_cover_url && (
                                  <div>
                                    <Label className="text-sm font-medium">Cover Image</Label>
                                    <img
                                      src={book.front_cover_url}
                                      alt={book.title}
                                      className="w-32 h-48 object-cover rounded mt-2"
                                    />
                                  </div>
                                )}
                                <div>
                                  <Label className="text-sm font-medium">Current Status</Label>
                                  <div className="mt-1">{getStatusBadge(book.approval_status)}</div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Uploaded</Label>
                                  <p className="text-sm">{new Date(book.uploaded_at).toLocaleString()}</p>
                                </div>
                              </div>
                              {book.description && (
                                <div className="md:col-span-2">
                                  <Label className="text-sm font-medium">Description</Label>
                                  <p className="text-sm mt-1">{book.description}</p>
                                </div>
                              )}
                              {book.author_note && (
                                <div className="md:col-span-2">
                                  <Label className="text-sm font-medium">Author Note</Label>
                                  <p className="text-sm mt-1">{book.author_note}</p>
                                </div>
                              )}
                              {book.admin_feedback && (
                                <div className="md:col-span-2">
                                  <Label className="text-sm font-medium">Admin Feedback</Label>
                                  <p className="text-sm mt-1">{book.admin_feedback}</p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedBook(book);
                            setIsReviewModalOpen(true);
                          }}
                        >
                          Review
                        </Button>
                        {book.manuscript_url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={book.manuscript_url} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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

interface BookReviewFormProps {
  book: Book;
  onUpdate: (bookId: string, status: string, feedback?: string) => void;
  onCancel: () => void;
}

const BookReviewForm = ({ book, onUpdate, onCancel }: BookReviewFormProps) => {
  const [status, setStatus] = useState(book.approval_status || 'under_review');
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

export default AdminBooks;