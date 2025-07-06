import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Star,
  Search,
  BookOpen,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Crown,
  Gem,
  Zap
} from 'lucide-react';

interface Review {
  id: string;
  reviewer_name: string;
  masked_reviewer_name: string | null;
  rating: number;
  comment: string | null;
  reviewed_at: string;
  amazon_visible: boolean | null;
  review_type: string | null;
  plan_type: string | null;
  book_id: string;
}

interface Book {
  id: string;
  title: string;
  author: string | null;
}

interface ReviewWithBook extends Review {
  book: Book;
}

interface ReviewsReceivedProps {
  onBack: () => void;
}

const ReviewsReceived = ({ onBack }: ReviewsReceivedProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<ReviewWithBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      fetchReviews();
    }
  }, [user]);

  const fetchReviews = async () => {
    try {
      // First get all books for this user
      const { data: userBooks, error: booksError } = await supabase
        .from('books')
        .select('id, title, author')
        .eq('user_id', user?.id);

      if (booksError) throw booksError;

      if (!userBooks || userBooks.length === 0) {
        setReviews([]);
        return;
      }

      const bookIds = userBooks.map(book => book.id);

      // Then get reviews for those books
      const { data: reviewsData, error } = await supabase
        .from('reviews')
        .select('*')
        .in('book_id', bookIds)
        .order('reviewed_at', { ascending: false });

      if (error) throw error;
      
      const reviewsWithBooks = reviewsData?.map(review => {
        const book = userBooks.find(b => b.id === review.book_id);
        return {
          ...review,
          book: book || { id: review.book_id, title: 'Unknown Book', author: null }
        };
      }) || [];
      
      setReviews(reviewsWithBooks);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your reviews"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(review =>
    review.book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.reviewer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.comment?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPlanIcon = (planType: string | null) => {
    switch (planType?.toLowerCase()) {
      case 'basic':
        return <Zap className="w-4 h-4" />;
      case 'silver':
        return <Star className="w-4 h-4" />;
      case 'gold':
        return <Crown className="w-4 h-4" />;
      case 'premium':
        return <Gem className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  const getPlanColor = (planType: string | null) => {
    switch (planType?.toLowerCase()) {
      case 'basic':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'silver':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      case 'gold':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'premium':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const maskReviewerName = (name: string) => {
    if (name.length <= 3) return name;
    const firstChar = name.charAt(0);
    const lastChar = name.charAt(name.length - 1);
    const middleStars = '*'.repeat(Math.max(1, name.length - 2));
    return `${firstChar}${middleStars}${lastChar}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reviews
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Reviews Received</h2>
          <p className="text-muted-foreground">All reviews for your books</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredReviews.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Star className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            {searchQuery ? (
              <>
                <p className="text-lg font-medium mb-2">No reviews found</p>
                <p className="text-muted-foreground">Try adjusting your search terms</p>
              </>
            ) : (
              <>
                <p className="text-lg font-medium mb-2">No reviews yet</p>
                <p className="text-muted-foreground">
                  Reviews will appear here once readers start reviewing your books
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <Card key={review.id} className="hover:shadow-medium transition-all">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-5 h-5" />
                      {review.book.title}
                    </CardTitle>
                    {review.book.author && (
                      <p className="text-sm text-muted-foreground mb-2">
                        by {review.book.author}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                      <span className="font-semibold">{review.rating}/5</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {review.plan_type && (
                      <Badge className={getPlanColor(review.plan_type)}>
                        {getPlanIcon(review.plan_type)}
                        <span className="ml-1 capitalize">{review.plan_type} Plan</span>
                      </Badge>
                    )}
                    <Badge 
                      className={review.review_type === 'verified' ? 
                        'bg-success/10 text-success border-success/20' : 
                        'bg-muted/10 text-muted-foreground border-muted/20'
                      }
                    >
                      {review.review_type === 'verified' ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <AlertCircle className="w-3 h-3 mr-1" />
                      )}
                      {review.review_type === 'verified' ? 'Verified' : 'Unverified'}
                    </Badge>
                    <Badge 
                      className={review.amazon_visible ? 
                        'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                        'bg-muted/10 text-muted-foreground border-muted/20'
                      }
                    >
                      {review.amazon_visible ? 'Live on Amazon' : 'Not on Amazon'}
                    </Badge>
                  </div>
                </div>
                <CardDescription>
                  <div className="flex items-center gap-4 text-sm">
                    <span>
                      By: {review.masked_reviewer_name || maskReviewerName(review.reviewer_name)}
                    </span>
                    <span>•</span>
                    <span>{new Date(review.reviewed_at).toLocaleDateString()}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              {review.comment && (
                <CardContent>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm italic">"{review.comment}"</p>
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

export default ReviewsReceived;