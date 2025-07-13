import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Eye, Calendar, Tag, ThumbsUp, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  view_count: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export const HelpArticle = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    if (!id) return;

    try {
      // Fetch article
      const { data: articleData, error: articleError } = await supabase
        .from('help_articles')
        .select('*')
        .eq('id', id)
        .eq('status', 'published')
        .single();

      if (articleError) throw articleError;

      setArticle(articleData);

      // Fetch related articles
      const { data: relatedData } = await supabase
        .from('help_articles')
        .select('*')
        .eq('status', 'published')
        .eq('category', articleData.category)
        .neq('id', id)
        .order('view_count', { ascending: false })
        .limit(3);

      setRelatedArticles(relatedData || []);

      // Increment view count
      await supabase
        .from('help_articles')
        .update({ view_count: articleData.view_count + 1 })
        .eq('id', id);

    } catch (error) {
      console.error('Error fetching article:', error);
      toast({
        title: 'Error',
        description: 'Failed to load article',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: article?.title,
        text: article?.excerpt,
        url: window.location.href
      });
    } catch (error) {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied',
        description: 'Article link copied to clipboard'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="h-12 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="space-y-3">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-4 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Article not found</h1>
            <p className="text-muted-foreground mb-6">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/help">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Help Center
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link to="/help" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Help Center
              </Link>
            </Button>
          </div>

          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">{article.category}</Badge>
              {article.featured && (
                <Badge variant="default">Featured</Badge>
              )}
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(article.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {article.view_count} views
                </div>
              </div>
              
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <div className="flex gap-2">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Article Content */}
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-8">
                  <div 
                    className="prose prose-gray dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                </CardContent>
              </Card>

              {/* Feedback Section */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Was this article helpful?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1">
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Yes, it was helpful
                    </Button>
                    <Button variant="outline" className="flex-1">
                      No, I need more help
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Still need help? <Link to="/community" className="text-primary hover:underline">Ask our community</Link> or <Link to="/contact" className="text-primary hover:underline">contact support</Link>.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {relatedArticles.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Related Articles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {relatedArticles.map((related) => (
                      <div key={related.id} className="border-b border-border pb-4 last:border-b-0">
                        <h4 className="font-medium mb-2">
                          <Link 
                            to={`/help/article/${related.id}`}
                            className="hover:text-primary transition-colors"
                          >
                            {related.title}
                          </Link>
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {related.excerpt}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Eye className="w-3 h-3" />
                          {related.view_count} views
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Quick Links */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link to="/community">Community Forum</Link>
                  </Button>
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link to="/contact">Contact Support</Link>
                  </Button>
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link to="/help">All Articles</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};