import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  ThumbsUp, 
  MessageCircle, 
  CheckCircle2, 
  Eye, 
  Calendar, 
  Shield,
  Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author_id: string;
  is_solved: boolean;
  view_count: number;
  upvotes: number;
  created_at: string;
}

interface Reply {
  id: string;
  content: string;
  author_id: string;
  is_solution: boolean;
  is_support_reply: boolean;
  upvotes: number;
  created_at: string;
  profiles?: {
    full_name: string | null;
    email: string | null;
  } | null;
}

export const CommunityPost = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userVotes, setUserVotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchReplies();
      if (user) {
        fetchUserVotes();
      }
    }
  }, [id, user]);

  const fetchPost = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .eq('id', id)
        .eq('status', 'published')
        .single();

      if (error) throw error;

      setPost(data);

      // Increment view count
      await supabase
        .from('community_posts')
        .update({ view_count: data.view_count + 1 })
        .eq('id', id);

    } catch (error) {
      console.error('Error fetching post:', error);
      toast({
        title: 'Error',
        description: 'Failed to load post',
        variant: 'destructive'
      });
    }
  };

  const fetchReplies = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('community_replies')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Format replies with null profiles for now
      const formattedReplies = (data || []).map(reply => ({
        ...reply,
        profiles: null
      }));
      
      setReplies(formattedReplies);
    } catch (error) {
      console.error('Error fetching replies:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVotes = async () => {
    if (!user || !id) return;

    try {
      const { data } = await supabase
        .from('community_votes')
        .select('*')
        .eq('user_id', user.id)
        .or(`post_id.eq.${id},reply_id.in.(${replies.map(r => r.id).join(',')})`);

      const votes: Record<string, string> = {};
      data?.forEach(vote => {
        const key = vote.post_id || vote.reply_id;
        if (key) votes[key] = vote.vote_type;
      });
      setUserVotes(votes);
    } catch (error) {
      console.error('Error fetching user votes:', error);
    }
  };

  const handleVote = async (targetId: string, type: 'post' | 'reply', voteType: 'upvote' | 'downvote') => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to vote',
        variant: 'destructive'
      });
      navigate('/auth');
      return;
    }

    try {
      const currentVote = userVotes[targetId];
      
      if (currentVote === voteType) {
        // Remove vote
        await supabase
          .from('community_votes')
          .delete()
          .eq('user_id', user.id)
          .eq(type === 'post' ? 'post_id' : 'reply_id', targetId);
        
        const newVotes = { ...userVotes };
        delete newVotes[targetId];
        setUserVotes(newVotes);
      } else {
        // Add or update vote
        await supabase
          .from('community_votes')
          .upsert({
            user_id: user.id,
            [type === 'post' ? 'post_id' : 'reply_id']: targetId,
            vote_type: voteType
          });
        
        setUserVotes({ ...userVotes, [targetId]: voteType });
      }
      
      // Refresh data
      if (type === 'post') {
        fetchPost();
      } else {
        fetchReplies();
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit vote',
        variant: 'destructive'
      });
    }
  };

  const handleSubmitReply = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to reply',
        variant: 'destructive'
      });
      navigate('/auth');
      return;
    }

    if (!newReply.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a reply',
        variant: 'destructive'
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('community_replies')
        .insert({
          post_id: id!,
          content: newReply.trim(),
          author_id: user.id
        });

      if (error) throw error;

      setNewReply('');
      fetchReplies();
      toast({
        title: 'Success',
        description: 'Reply posted successfully'
      });
    } catch (error) {
      console.error('Error submitting reply:', error);
      toast({
        title: 'Error',
        description: 'Failed to post reply',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.floor((new Date(dateString).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  if (loading || !post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="h-12 bg-muted rounded w-3/4"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 bg-muted rounded"></div>
                ))}
              </div>
            </div>
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
              <Link to="/community" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Community
              </Link>
            </Button>
          </div>

          {/* Post */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline">{post.category}</Badge>
                {post.is_solved && (
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Solved
                  </Badge>
                )}
              </div>
              <CardTitle className="text-3xl">{post.title}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.created_at)}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {post.view_count} views
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {replies.length} replies
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-2">
                  <Button
                    variant={userVotes[post.id] === 'upvote' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleVote(post.id, 'post', 'upvote')}
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium">{post.upvotes}</span>
                </div>
                
                <div className="flex-1">
                  <div className="prose prose-gray dark:prose-invert max-w-none mb-4">
                    {post.content.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                  
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-2 mt-4">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Replies */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">
              {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
            </h2>

            {replies.map((reply) => (
              <Card key={reply.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="" />
                        <AvatarFallback>
                          {reply.profiles?.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <Button
                        variant={userVotes[reply.id] === 'upvote' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => handleVote(reply.id, 'reply', 'upvote')}
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-medium">{reply.upvotes}</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-medium">
                          {reply.profiles?.full_name || 'Anonymous'}
                        </span>
                        {reply.is_support_reply && (
                          <Badge variant="default" className="bg-blue-500">
                            <Shield className="w-3 h-3 mr-1" />
                            Support
                          </Badge>
                        )}
                        {reply.is_solution && (
                          <Badge variant="default" className="bg-green-500">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Solution
                          </Badge>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {formatDate(reply.created_at)}
                        </span>
                      </div>
                      
                      <div className="prose prose-gray dark:prose-invert max-w-none">
                        {reply.content.split('\n').map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Reply Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add Your Reply</CardTitle>
              </CardHeader>
              <CardContent>
                {user ? (
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Share your thoughts, solutions, or ask for clarification..."
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      rows={4}
                    />
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleSubmitReply}
                        disabled={submitting || !newReply.trim()}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {submitting ? 'Posting...' : 'Post Reply'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Sign in to join the conversation
                    </p>
                    <Button asChild>
                      <Link to="/auth">Sign In</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};