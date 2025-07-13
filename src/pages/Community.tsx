import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageCircle, 
  Plus, 
  Search, 
  ThumbsUp, 
  CheckCircle2, 
  Users, 
  TrendingUp, 
  Clock,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[] | null;
  author_id: string;
  is_solved: boolean;
  view_count: number;
  upvotes: number;
  created_at: string;
  profiles?: {
    full_name: string | null;
    email: string | null;
  } | null;
  reply_count?: number;
}

export const Community = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All Posts', icon: MessageCircle },
    { id: 'getting-started', name: 'Getting Started', icon: Users },
    { id: 'account-issues', name: 'Account Issues', icon: Users },
    { id: 'payment-billing', name: 'Payment & Billing', icon: TrendingUp },
    { id: 'book-reviews', name: 'Book Reviews', icon: CheckCircle2 },
    { id: 'affiliate-program', name: 'Affiliate Program', icon: Users },
    { id: 'feature-requests', name: 'Feature Requests', icon: Plus },
    { id: 'bug-reports', name: 'Bug Reports', icon: Filter }
  ];

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, searchQuery, sortBy]);

  const fetchPosts = async () => {
    setLoading(true);
    let query = supabase
      .from('community_posts')
      .select('*')
      .eq('status', 'published');

    if (selectedCategory !== 'all') {
      query = query.eq('category', selectedCategory);
    }

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
    }

    // Apply sorting
    switch (sortBy) {
      case 'latest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'popular':
        query = query.order('upvotes', { ascending: false });
        break;
      case 'most-viewed':
        query = query.order('view_count', { ascending: false });
        break;
      case 'solved':
        query = query.eq('is_solved', true).order('created_at', { ascending: false });
        break;
      case 'unsolved':
        query = query.eq('is_solved', false).order('created_at', { ascending: false });
        break;
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load community posts',
        variant: 'destructive'
      });
    } else {
      // Get reply counts and format posts
      const postsWithReplyCounts = await Promise.all(
        (data || []).map(async (post) => {
          const { count } = await supabase
            .from('community_replies')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);
          
          return {
            id: post.id,
            title: post.title,
            content: post.content,
            category: post.category,
            tags: post.tags,
            author_id: post.author_id,
            is_solved: post.is_solved,
            view_count: post.view_count,
            upvotes: post.upvotes,
            created_at: post.created_at,
            profiles: null,
            reply_count: count || 0
          };
        })
      );
      
      setPosts(postsWithReplyCounts);
    }
    setLoading(false);
  };

  const handleCreatePost = () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to create a new post',
        variant: 'destructive'
      });
      navigate('/auth');
      return;
    }
    navigate('/community/new');
  };

  const formatDate = (dateString: string) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.floor((new Date(dateString).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Community <span className="text-primary">Forum</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              Connect with other authors, get help from our community, and share your experience
            </p>
            <Button onClick={handleCreatePost} size="lg" className="w-full sm:w-auto">
              <Plus className="w-5 h-5 mr-2" />
              New Discussion
            </Button>
          </div>

          {/* Search and Stats */}
          <div className="max-w-4xl mx-auto">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search discussions..."
                className="pl-12 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <Card className="text-center">
                <CardContent className="pt-3 sm:pt-4 pb-3 sm:pb-4">
                  <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2" />
                  <div className="text-lg sm:text-2xl font-bold">{posts.length}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Discussions</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-3 sm:pt-4 pb-3 sm:pb-4">
                  <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-lg sm:text-2xl font-bold">
                    {posts.filter(p => p.is_solved).length}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Solved</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-3 sm:pt-4 pb-3 sm:pb-4">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-lg sm:text-2xl font-bold">2.5K</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Members</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-3 sm:pt-4 pb-3 sm:pb-4">
                  <ThumbsUp className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-lg sm:text-2xl font-bold">
                    {posts.reduce((sum, p) => sum + p.upvotes, 0)}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Upvotes</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <h3 className="w-full text-sm font-medium text-muted-foreground mb-2">Categories:</h3>
                  {categories.slice(0, 4).map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                        {category.name}
                      </button>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-2">
                  <h3 className="w-full text-sm font-medium text-muted-foreground mb-2">Sort:</h3>
                  {[
                    { id: 'latest', name: 'Latest', icon: Clock },
                    { id: 'popular', name: 'Popular', icon: ThumbsUp },
                    { id: 'solved', name: 'Solved', icon: CheckCircle2 }
                  ].map((sort) => {
                    const Icon = sort.icon;
                    return (
                      <button
                        key={sort.id}
                        onClick={() => setSortBy(sort.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                          sortBy === sort.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                        {sort.name}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                        selectedCategory === category.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{category.name}</span>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Sort Options */}
            <Card>
              <CardHeader>
                <CardTitle>Sort by</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { id: 'latest', name: 'Latest', icon: Clock },
                  { id: 'popular', name: 'Most Popular', icon: ThumbsUp },
                  { id: 'most-viewed', name: 'Most Viewed', icon: TrendingUp },
                  { id: 'solved', name: 'Solved', icon: CheckCircle2 },
                  { id: 'unsolved', name: 'Unsolved', icon: MessageCircle }
                ].map((sort) => {
                  const Icon = sort.icon;
                  return (
                    <button
                      key={sort.id}
                      onClick={() => setSortBy(sort.id)}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left ${
                        sortBy === sort.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{sort.name}</span>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">
                {selectedCategory === 'all' 
                  ? 'All Discussions' 
                  : categories.find(c => c.id === selectedCategory)?.name
                }
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <span className="text-sm text-muted-foreground">
                  {posts.length} discussions
                </span>
                <Button onClick={handleCreatePost} className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-muted rounded-full"></div>
                        <div className="flex-1 space-y-3">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                          <div className="flex gap-2">
                            <div className="h-6 bg-muted rounded w-16"></div>
                            <div className="h-6 bg-muted rounded w-20"></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Card key={post.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                          <AvatarImage src="" />
                          <AvatarFallback>
                            {post.profiles?.full_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">{post.category}</Badge>
                            {post.is_solved && (
                              <Badge variant="default" className="bg-green-500 text-xs">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Solved
                              </Badge>
                            )}
                          </div>
                          
                          <h3 className="text-base sm:text-lg font-semibold mb-2 leading-tight">
                            <Link 
                              to={`/community/post/${post.id}`}
                              className="hover:text-primary transition-colors"
                            >
                              {post.title}
                            </Link>
                          </h3>
                          
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                            {post.content.substring(0, 150)}...
                          </p>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                              <span className="truncate max-w-[120px] sm:max-w-none">{post.profiles?.full_name || 'Anonymous'}</span>
                              <span>•</span>
                              <span>{formatDate(post.created_at)}</span>
                            </div>
                            
                            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4" />
                                {post.upvotes}
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                {post.reply_count}
                              </div>
                              <span className="hidden sm:inline">{post.view_count} views</span>
                              <span className="sm:hidden">{post.view_count}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No discussions found</h3>
                  <p className="text-muted-foreground mb-6">
                    Be the first to start a discussion in this category
                  </p>
                  <Button onClick={handleCreatePost}>
                    <Plus className="w-4 h-4 mr-2" />
                    Start Discussion
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};