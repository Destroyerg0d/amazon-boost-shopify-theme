import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

// Import dashboard components
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import StatsCards from '@/components/dashboard/StatsCards';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentBooks from '@/components/dashboard/RecentBooks';
import AuthorSettings from '@/components/dashboard/AuthorSettings';

// Import page components
import BookUpload from '@/pages/BookUpload';
import BooksList from '@/pages/BooksList';
import ReviewPlans from '@/pages/ReviewPlans';
import ReviewsReceived from '@/pages/ReviewsReceived';
import BookPlanAttachment from '@/components/dashboard/BookPlanAttachment';

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

interface DashboardStats {
  totalBooks: number;
  totalReviews: number;
  averageRating: number;
  thisMonthBooks: number;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalBooks: 0,
    totalReviews: 0,
    averageRating: 0,
    thisMonthBooks: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeView, setActiveView] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchBooks();
      fetchStats();
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

  const fetchStats = async () => {
    try {
      const { data: booksData } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', user?.id);

      // Get reviews for user's books
      const bookIds = booksData?.map(book => book.id) || [];
      let reviewsData = [];
      
      if (bookIds.length > 0) {
        const { data } = await supabase
          .from('reviews')
          .select('*')
          .in('book_id', bookIds);
        reviewsData = data || [];
      }

      const totalBooks = booksData?.length || 0;
      const totalReviews = reviewsData?.length || 0;
      const averageRating = reviewsData?.length 
        ? reviewsData.reduce((acc, review) => acc + review.rating, 0) / reviewsData.length
        : 0;

      const thisMonth = new Date();
      thisMonth.setMonth(thisMonth.getMonth() - 1);
      const thisMonthBooks = booksData?.filter(book => 
        new Date(book.uploaded_at) > thisMonth
      ).length || 0;

      setStats({
        totalBooks,
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        thisMonthBooks
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setActiveView(null);
  };

  const handleAddBook = () => {
    if (activeTab === 'books') {
      setActiveView('add-book');
    } else {
      setActiveTab('books');
      setActiveView('add-book');
    }
  };

  const handleViewReviews = () => {
    setActiveTab('reviews');
    setActiveView('received');
  };

  const handleViewSettings = () => {
    setActiveTab('settings');
  };

  const handleBookAdded = () => {
    fetchBooks();
    fetchStats();
    setActiveView(null);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <StatsCards stats={stats} />
      <QuickActions 
        onAddBook={handleAddBook}
        onViewReviews={handleViewReviews}
        onViewSettings={handleViewSettings}
      />
      <RecentBooks books={books} onAddBook={handleAddBook} />
    </div>
  );

  const renderBooks = () => {
    if (activeView === 'add-book') {
      return (
        <BookUpload 
          onBack={() => setActiveView(null)}
          onBookAdded={handleBookAdded}
        />
      );
    }
    
    return (
      <BooksList 
        onBack={() => setActiveTab('overview')}
        onAddBook={() => setActiveView('add-book')}
      />
    );
  };

  const renderReviews = () => {
    if (activeView === 'received') {
      return <ReviewsReceived onBack={() => setActiveView('plans')} />;
    }
    
    if (activeView === 'manage') {
      return <BookPlanAttachment />;
    }
    
    return (
      <div className="space-y-6">
        <div className="flex gap-4 flex-wrap">
          <Button 
            variant={activeView === 'plans' ? 'default' : 'outline'}
            onClick={() => setActiveView('plans')}
          >
            Review Plans
          </Button>
          <Button 
            variant={activeView === 'manage' ? 'default' : 'outline'}
            onClick={() => setActiveView('manage')}
          >
            Manage Plans
          </Button>
          <Button 
            variant={activeView === 'received' ? 'default' : 'outline'}
            onClick={() => setActiveView('received')}
          >
            Reviews Received
          </Button>
        </div>
        
        {activeView === 'plans' ? (
          <ReviewPlans onBack={() => setActiveTab('overview')} />
        ) : activeView === 'manage' ? (
          <BookPlanAttachment />
        ) : (
          <ReviewsReceived onBack={() => setActiveView('plans')} />
        )}
      </div>
    );
  };

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>
      <AuthorSettings />
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'books':
        return renderBooks();
      case 'reviews':
        return renderReviews();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="flex">
        <DashboardSidebar activeTab={activeTab} setActiveTab={handleTabChange} />

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Bar - Mobile */}
          <div className="md:hidden bg-card border-b border-border p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Dashboard</h1>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden bg-card border-b border-border p-2">
            <div className="flex gap-1 overflow-x-auto">
              {['overview', 'books', 'reviews', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap text-sm transition-colors ${
                    activeTab === tab
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <span className="capitalize">{tab}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Page Content */}
          <div className="p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;