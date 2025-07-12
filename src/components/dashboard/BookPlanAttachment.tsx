import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
  BookOpen,
  Link,
  AlertCircle,
  CheckCircle,
  Package
} from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string | null;
  approval_status: string | null;
  uploaded_at: string;
}

interface ReviewPlan {
  id: string;
  plan_name: string;
  plan_type: string;
  total_reviews: number;
  used_reviews: number;
  status: string;
  book_id: string | null;
  books?: {
    title: string;
    author: string | null;
  } | null;
}

const BookPlanAttachment = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [reviewPlans, setReviewPlans] = useState<ReviewPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchBooks();
      fetchReviewPlans();

      // Set up real-time subscriptions for better user experience
      const channel = supabase
        .channel('book-plan-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'books' }, () => {
          console.log('Books changed, refreshing...');
          fetchBooks();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'review_plans' }, () => {
          console.log('Review plans changed, refreshing...');
          fetchReviewPlans();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, () => {
          console.log('Reviews changed, refreshing plans...');
          fetchReviewPlans(); // Refresh plans when reviews are added to update usage counts
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchBooks = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('books')
        .select('id, title, author, approval_status, uploaded_at')
        .eq('user_id', user.id)
        .eq('approval_status', 'approved')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch books',
        variant: 'destructive',
      });
    }
  };

  const fetchReviewPlans = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('review_plans')
        .select(`
          id,
          plan_name,
          plan_type,
          total_reviews,
          used_reviews,
          status,
          book_id,
          books!review_plans_book_id_fkey (
            title,
            author
          )
        `)
        .eq('user_id', user.id)
        .in('status', ['active', 'completed'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviewPlans(data || []);
    } catch (error) {
      console.error('Error fetching review plans:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch review plans',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const attachPlanToBook = async (bookId: string, planId: string) => {
    try {
      const { error } = await supabase
        .from('review_plans')
        .update({ book_id: bookId })
        .eq('id', planId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Plan attached to book successfully',
      });

      fetchReviewPlans();
      setIsAttachModalOpen(false);
      setSelectedBook(null);
    } catch (error) {
      console.error('Error attaching plan to book:', error);
      toast({
        title: 'Error',
        description: 'Failed to attach plan to book',
        variant: 'destructive',
      });
    }
  };

  const getBookPlan = (bookId: string) => {
    return reviewPlans.find(plan => plan.book_id === bookId);
  };

  const getAvailablePlans = () => {
    return reviewPlans.filter(plan => !plan.book_id);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted-foreground/20 rounded w-1/4 animate-pulse"></div>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
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
        <h2 className="text-2xl font-bold">Book & Plan Management</h2>
        <p className="text-muted-foreground">Attach review plans to your approved books to start receiving reviews</p>
      </div>

      {/* Books Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Approved Books</CardTitle>
          <CardDescription>Manage plan attachments for your books</CardDescription>
        </CardHeader>
        <CardContent>
          {books.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No approved books found</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book</TableHead>
                    <TableHead>Attached Plan</TableHead>
                    <TableHead>Plan Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {books.map((book) => {
                    const attachedPlan = getBookPlan(book.id);
                    return (
                      <TableRow key={book.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <BookOpen className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{book.title}</div>
                              <div className="text-sm text-muted-foreground">by {book.author || 'Unknown'}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {attachedPlan ? (
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-green-600" />
                              <span className="font-medium">{attachedPlan.plan_name}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-orange-600" />
                              <span className="text-muted-foreground">No plan attached</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {attachedPlan ? (
                            <Badge 
                              variant={attachedPlan.status === 'completed' ? 'destructive' : 'success'} 
                              className="gap-1"
                            >
                              <CheckCircle className="h-3 w-3" />
                              {attachedPlan.status === 'completed' ? 'Completed' : 'Active'} ({attachedPlan.used_reviews}/{attachedPlan.total_reviews} used)
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {!attachedPlan && getAvailablePlans().length > 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedBook(book);
                                setIsAttachModalOpen(true);
                              }}
                              className="gap-2"
                            >
                              <Link className="h-4 w-4" />
                              Attach Plan
                            </Button>
                          )}
                          {!attachedPlan && getAvailablePlans().length === 0 && (
                            <p className="text-sm text-muted-foreground">No available plans</p>
                          )}
                          {attachedPlan && (
                            <Badge variant="outline">Plan Attached</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Plans Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Review Plans</CardTitle>
          <CardDescription>Status of your purchased review plans</CardDescription>
        </CardHeader>
        <CardContent>
          {reviewPlans.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No review plans found</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reviewPlans.map((plan) => (
                <Card key={plan.id} className={
                  plan.status === 'completed' ? 'border-red-200 bg-red-50/50' : 
                  plan.book_id ? 'border-green-200' : 'border-orange-200'
                }>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{plan.plan_name}</CardTitle>
                      {plan.status === 'completed' && (
                        <Badge variant="destructive" className="text-xs">
                          Completed
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="capitalize">{plan.plan_type} Plan</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Progress:</span>
                      <span className="font-medium">{plan.used_reviews}/{plan.total_reviews}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          plan.status === 'completed' ? 'bg-red-500' : 'bg-primary'
                        }`}
                        style={{ width: `${(plan.used_reviews / plan.total_reviews) * 100}%` }}
                      />
                    </div>
                    {plan.book_id ? (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Attached to: {plan.books?.title}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-orange-600">
                        <AlertCircle className="h-4 w-4" />
                        <span>Not attached to any book</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attach Plan Modal */}
      <Dialog open={isAttachModalOpen} onOpenChange={setIsAttachModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attach Plan to Book</DialogTitle>
            <DialogDescription>
              Select a plan to attach to "{selectedBook?.title}". Once attached, the plan cannot be changed or detached.
            </DialogDescription>
          </DialogHeader>
          {selectedBook && (
            <AttachPlanForm
              book={selectedBook}
              availablePlans={getAvailablePlans()}
              onAttach={(planId) => attachPlanToBook(selectedBook.id, planId)}
              onCancel={() => {
                setIsAttachModalOpen(false);
                setSelectedBook(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface AttachPlanFormProps {
  book: Book;
  availablePlans: ReviewPlan[];
  onAttach: (planId: string) => void;
  onCancel: () => void;
}

const AttachPlanForm = ({ book, availablePlans, onAttach, onCancel }: AttachPlanFormProps) => {
  const [selectedPlanId, setSelectedPlanId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanId) {
      alert('Please select a plan to attach.');
      return;
    }
    onAttach(selectedPlanId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium">{book.title}</h4>
        <p className="text-sm text-muted-foreground">by {book.author}</p>
      </div>

      <div>
        <label className="text-sm font-medium">Select Plan</label>
        <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a plan to attach" />
          </SelectTrigger>
          <SelectContent>
            {availablePlans.map((plan) => (
              <SelectItem key={plan.id} value={plan.id}>
                <div className="flex flex-col">
                  <span>{plan.plan_name}</span>
                  <span className="text-xs text-muted-foreground">
                    {plan.total_reviews} reviews • {plan.used_reviews} used
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {availablePlans.length === 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            No available plans to attach. All your plans are already attached to other books.
          </p>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium">Important:</p>
            <p>Once a plan is attached to a book, it cannot be changed or detached. Make sure you're selecting the correct plan.</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!selectedPlanId || availablePlans.length === 0}>
          Attach Plan
        </Button>
      </div>
    </form>
  );
};

export default BookPlanAttachment;