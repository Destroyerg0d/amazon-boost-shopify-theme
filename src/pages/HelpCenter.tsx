import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, BookOpen, Users, MessageCircle, Star, TrendingUp, FileText, HelpCircle } from 'lucide-react';

interface HelpArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  view_count: number;
  featured: boolean;
  created_at: string;
}

export const HelpCenter = () => {
  const [articles, setArticles] = useState<HelpArticle[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<HelpArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All Articles', icon: FileText },
    { id: 'getting-started', name: 'Getting Started', icon: BookOpen },
    { id: 'account-management', name: 'Account Management', icon: Users },
    { id: 'billing-payments', name: 'Billing & Payments', icon: TrendingUp },
    { id: 'book-reviews', name: 'Book Reviews', icon: Star },
    { id: 'affiliate-program', name: 'Affiliate Program', icon: Users },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: HelpCircle }
  ];

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory, searchQuery]);

  const fetchArticles = async () => {
    setLoading(true);
    let query = supabase
      .from('help_articles')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (selectedCategory !== 'all') {
      query = query.eq('category', selectedCategory);
    }

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
    }

    const { data } = await query;
    setArticles(data || []);

    // Fetch featured articles
    const { data: featured } = await supabase
      .from('help_articles')
      .select('*')
      .eq('status', 'published')
      .eq('featured', true)
      .order('view_count', { ascending: false })
      .limit(3);

    setFeaturedArticles(featured || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            How can we <span className="text-primary">help</span> you?
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find answers to your questions, learn how to use our platform, and get the most out of ReviewProMax
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search for help articles..."
              className="pl-12 h-14 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/community">
                <MessageCircle className="w-5 h-5 mr-2" />
                Visit Community
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/contact">
                Contact Support
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">150+</h3>
              <p className="text-muted-foreground">Help Articles</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">10K+</h3>
              <p className="text-muted-foreground">Community Members</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">95%</h3>
              <p className="text-muted-foreground">Questions Answered</p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Featured Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{article.category}</Badge>
                      <Star className="w-4 h-4 text-yellow-500" />
                    </div>
                    <CardTitle className="text-lg">
                      <Link 
                        to={`/help/article/${article.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {article.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{article.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{article.view_count} views</span>
                      <Link 
                        to={`/help/article/${article.id}`}
                        className="text-primary hover:underline"
                      >
                        Read more
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
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
                      <Icon className="w-5 h-5" />
                      {category.name}
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Articles Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {selectedCategory === 'all' ? 'All Articles' : categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <span className="text-muted-foreground">
                {articles.length} articles found
              </span>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-3 bg-muted rounded w-full mb-2"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : articles.length > 0 ? (
              <div className="space-y-4">
                {articles.map((article) => (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{article.category}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {article.view_count} views
                        </span>
                      </div>
                      <CardTitle className="text-xl">
                        <Link 
                          to={`/help/article/${article.id}`}
                          className="hover:text-primary transition-colors"
                        >
                          {article.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{article.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {article.tags?.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Link 
                          to={`/help/article/${article.id}`}
                          className="text-primary hover:underline"
                        >
                          Read article →
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search or browse different categories
                  </p>
                  <Button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                    Show all articles
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