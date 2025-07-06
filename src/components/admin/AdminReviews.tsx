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
  Star,
  BookOpen,
  User,
  Plus,
  Calendar,
  MessageSquare
} from 'lucide-react';

interface Review {
  id: string;
  book_id: string;
  reviewer_name: string;
  masked_reviewer_name: string | null;
  rating: number;
  comment: string | null;
  review_type: string | null;
  plan_type: string | null;
  amazon_visible: boolean | null;
  reviewed_at: string;
  books?: {
    title: string;
    author: string | null;
  } | null;
}

interface NewReview {
  book_id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  review_type: string;
  plan_type: string;
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
    fetchBooks();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          books!reviews_book_id_fkey (title, author)
        `)
        .order('reviewed_at', { ascending: false });

      if (error) throw error;
      setReviews((data as any) || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch reviews',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('id, title, author')
        .eq('approval_status', 'approved');

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const addReview = async (reviewData: NewReview) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          book_id: reviewData.book_id,
          reviewer_name: reviewData.reviewer_name,
          masked_reviewer_name: `Reviewer ${Math.floor(Math.random() * 1000)}`,
          rating: reviewData.rating,
          comment: reviewData.comment,
          review_type: reviewData.review_type,
          plan_type: reviewData.plan_type,
          amazon_visible: true,
          reviewed_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Review added successfully',
      });

      fetchReviews();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding review:', error);
      toast({
        title: 'Error',
        description: 'Failed to add review',
        variant: 'destructive',
      });
    }
  };

  const getRatingBadge = (rating: number) => {
    const color = rating >= 4 ? 'success' : rating >= 3 ? 'warning' : 'destructive';
    return (
      <Badge variant={color} className="gap-1">
        <Star className="h-3 w-3 fill-current" />
        {rating}
      </Badge>
    );
  };

  const getReviewTypeBadge = (type: string | null) => {
    const config = {
      verified: { variant: 'success' as const, label: 'Verified' },
      unverified: { variant: 'secondary' as const, label: 'Unverified' },
    };
    
    const typeConfig = config[type as keyof typeof config] || config.unverified;
    return <Badge variant={typeConfig.variant}>{typeConfig.label}</Badge>;
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.books?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.reviewer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;

    return matchesSearch && matchesRating;
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Reviews Management</h2>
          <p className="text-muted-foreground">Manage and add book reviews</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Review
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle>All Reviews</CardTitle>
              <CardDescription>View and manage book reviews</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
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
                  <TableHead>Reviewer</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{review.books?.title || 'Unknown Book'}</div>
                          <div className="text-sm text-muted-foreground">by {review.books?.author || 'Unknown'}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {review.masked_reviewer_name || review.reviewer_name}
                      </div>
                    </TableCell>
                    <TableCell>{getRatingBadge(review.rating)}</TableCell>
                    <TableCell>{getReviewTypeBadge(review.review_type)}</TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={review.comment || 'No comment'}>
                        {review.comment || 'No comment'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(review.reviewed_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Review Details</DialogTitle>
                            <DialogDescription>
                              Complete review information
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium">Book</Label>
                              <p className="text-sm">{review.books?.title} by {review.books?.author}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Reviewer</Label>
                              <p className="text-sm">{review.reviewer_name}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Rating</Label>
                              <div className="mt-1">{getRatingBadge(review.rating)}</div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Comment</Label>
                              <p className="text-sm mt-1">{review.comment || 'No comment provided'}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Review Type</Label>
                              <div className="mt-1">{getReviewTypeBadge(review.review_type)}</div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredReviews.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No reviews found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Review Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Review</DialogTitle>
            <DialogDescription>
              Add a review for a book
            </DialogDescription>
          </DialogHeader>
          <AddReviewForm
            books={books}
            onSubmit={addReview}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface AddReviewFormProps {
  books: any[];
  onSubmit: (data: NewReview) => void;
  onCancel: () => void;
}

const AddReviewForm = ({ books, onSubmit, onCancel }: AddReviewFormProps) => {
  const [formData, setFormData] = useState<NewReview>({
    book_id: '',
    reviewer_name: '',
    rating: 5,
    comment: '',
    review_type: 'verified',
    plan_type: 'premium'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.book_id || !formData.reviewer_name) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="bookId">Book</Label>
        <Select value={formData.book_id} onValueChange={(value) => setFormData({...formData, book_id: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select a book" />
          </SelectTrigger>
          <SelectContent>
            {books.map((book) => (
              <SelectItem key={book.id} value={book.id}>
                {book.title} by {book.author}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="reviewerName">Reviewer Name</Label>
        <Input
          id="reviewerName"
          value={formData.reviewer_name}
          onChange={(e) => setFormData({...formData, reviewer_name: e.target.value})}
          placeholder="Enter reviewer name"
          required
        />
      </div>

      <div>
        <Label htmlFor="rating">Rating</Label>
        <Select value={formData.rating.toString()} onValueChange={(value) => setFormData({...formData, rating: parseInt(value)})}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[5, 4, 3, 2, 1].map((rating) => (
              <SelectItem key={rating} value={rating.toString()}>
                {rating} Star{rating !== 1 ? 's' : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="reviewType">Review Type</Label>
        <Select value={formData.review_type} onValueChange={(value) => setFormData({...formData, review_type: value})}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="verified">Verified Purchase</SelectItem>
            <SelectItem value="unverified">Unverified</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="comment">Review Comment</Label>
        <Textarea
          id="comment"
          value={formData.comment}
          onChange={(e) => setFormData({...formData, comment: e.target.value})}
          placeholder="Enter review comment..."
          rows={3}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Review</Button>
      </div>
    </form>
  );
};

export default AdminReviews;