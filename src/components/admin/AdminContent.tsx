import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Edit,
  Trash2,
  FileText,
  MessageSquare,
  Users,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  Star,
  BookOpen,
  HelpCircle
} from 'lucide-react';

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  category: string;
  status: string;
  featured: boolean;
  tags: string[] | null;
  view_count: number;
  author_id: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
    email: string | null;
  } | null;
}

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[] | null;
  status: string;
  is_solved: boolean;
  view_count: number;
  upvotes: number;
  author_id: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
    email: string | null;
  } | null;
}

interface CommunityReply {
  id: string;
  content: string;
  post_id: string;
  author_id: string;
  is_solution: boolean;
  is_support_reply: boolean;
  upvotes: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
    email: string | null;
  } | null;
  community_posts?: {
    title: string;
  } | null;
}

const AdminContent = () => {
  const [helpArticles, setHelpArticles] = useState<HelpArticle[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [communityReplies, setCommunityReplies] = useState<CommunityReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<'article' | 'post' | 'reply' | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    setLoading(true);
    try {
      // Fetch help articles
      const { data: articles, error: articlesError } = await supabase
        .from('help_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (articlesError) {
        console.error('Articles error:', articlesError);
        throw articlesError;
      }

      // Fetch community posts
      const { data: posts, error: postsError } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) {
        console.error('Posts error:', postsError);
        throw postsError;
      }

      // Fetch community replies
      const { data: replies, error: repliesError } = await supabase
        .from('community_replies')
        .select('*')
        .order('created_at', { ascending: false });

      if (repliesError) {
        console.error('Replies error:', repliesError);
        throw repliesError;
      }

      // Fetch all profiles to map authors
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name, email');

      if (profilesError) {
        console.error('Profiles error:', profilesError);
        // Don't throw error for profiles, just continue without author info
      }

      // Create a profile lookup map
      const profileMap = profiles?.reduce((acc, profile) => {
        acc[profile.user_id] = profile;
        return acc;
      }, {} as Record<string, any>) || {};

      // Add profile info to articles
      const articlesWithProfiles = articles?.map(article => ({
        ...article,
        profiles: article.author_id ? profileMap[article.author_id] : null
      })) || [];

      // Add profile info to posts
      const postsWithProfiles = posts?.map(post => ({
        ...post,
        profiles: profileMap[post.author_id] || null
      })) || [];

      // Add profile and post info to replies
      const repliesWithInfo = replies?.map(reply => {
        const relatedPost = posts?.find(post => post.id === reply.post_id);
        return {
          ...reply,
          profiles: profileMap[reply.author_id] || null,
          community_posts: relatedPost ? { title: relatedPost.title } : null
        };
      }) || [];

      setHelpArticles(articlesWithProfiles);
      setCommunityPosts(postsWithProfiles);
      setCommunityReplies(repliesWithInfo);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: "Error",
        description: `Failed to fetch content: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (item: any, type: 'article' | 'post' | 'reply') => {
    setEditingItem({ ...item });
    setEditingType(type);
    setIsDialogOpen(true);
  };

  const openCreateDialog = (type: 'article' | 'post' | 'reply') => {
    const newItem = type === 'article' 
      ? {
          title: '',
          content: '',
          excerpt: '',
          category: '',
          status: 'published',
          featured: false,
          tags: [],
        }
      : type === 'post'
      ? {
          title: '',
          content: '',
          category: '',
          tags: [],
          status: 'published',
          is_solved: false,
        }
      : {
          content: '',
          post_id: '',
          is_solution: false,
          is_support_reply: true,
        };
    
    setEditingItem(newItem);
    setEditingType(type);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingItem || !editingType) return;

    try {
      let result;
      const isNew = !editingItem.id;

      if (editingType === 'article') {
        const articleData = {
          title: editingItem.title,
          content: editingItem.content,
          excerpt: editingItem.excerpt,
          category: editingItem.category,
          status: editingItem.status,
          featured: editingItem.featured,
          tags: Array.isArray(editingItem.tags) ? editingItem.tags : editingItem.tags?.split(',').map((t: string) => t.trim()).filter(Boolean) || [],
          author_id: editingItem.author_id,
          created_at: editingItem.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        if (isNew) {
          result = await supabase.from('help_articles').insert(articleData);
        } else {
          result = await supabase.from('help_articles').update(articleData).eq('id', editingItem.id);
        }
      } else if (editingType === 'post') {
        const postData = {
          title: editingItem.title,
          content: editingItem.content,
          category: editingItem.category,
          tags: Array.isArray(editingItem.tags) ? editingItem.tags : editingItem.tags?.split(',').map((t: string) => t.trim()).filter(Boolean) || [],
          status: editingItem.status,
          is_solved: editingItem.is_solved,
          author_id: editingItem.author_id,
          created_at: editingItem.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        if (isNew) {
          result = await supabase.from('community_posts').insert(postData);
        } else {
          result = await supabase.from('community_posts').update(postData).eq('id', editingItem.id);
        }
      } else if (editingType === 'reply') {
        const replyData = {
          content: editingItem.content,
          post_id: editingItem.post_id,
          author_id: editingItem.author_id,
          is_solution: editingItem.is_solution,
          is_support_reply: editingItem.is_support_reply,
          created_at: editingItem.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        if (isNew) {
          result = await supabase.from('community_replies').insert(replyData);
        } else {
          result = await supabase.from('community_replies').update(replyData).eq('id', editingItem.id);
        }
      }

      if (result?.error) throw result.error;

      toast({
        title: "Success",
        description: `${editingType} ${isNew ? 'created' : 'updated'} successfully`,
      });

      setIsDialogOpen(false);
      setEditingItem(null);
      setEditingType(null);
      fetchAllContent();
    } catch (error) {
      console.error('Error saving:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingItem.id ? 'update' : 'create'} ${editingType}`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string, type: 'article' | 'post' | 'reply') => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      let result;
      if (type === 'article') {
        result = await supabase.from('help_articles').delete().eq('id', id);
      } else if (type === 'post') {
        result = await supabase.from('community_posts').delete().eq('id', id);
      } else if (type === 'reply') {
        result = await supabase.from('community_replies').delete().eq('id', id);
      }

      if (result?.error) throw result.error;

      toast({
        title: "Success",
        description: `${type} deleted successfully`,
      });

      fetchAllContent();
    } catch (error) {
      console.error('Error deleting:', error);
      toast({
        title: "Error",
        description: `Failed to delete ${type}`,
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderEditDialog = () => {
    if (!editingItem || !editingType) return null;

    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem.id ? 'Edit' : 'Create'} {editingType === 'article' ? 'Help Article' : editingType === 'post' ? 'Community Post' : 'Reply'}
            </DialogTitle>
            <DialogDescription>
              {editingItem.id ? 'Make changes to' : 'Create a new'} {editingType}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {editingType !== 'reply' && (
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                  placeholder="Enter title"
                />
              </div>
            )}

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={editingItem.content || ''}
                onChange={(e) => setEditingItem({...editingItem, content: e.target.value})}
                placeholder="Enter content"
                className="min-h-[200px]"
              />
            </div>

            {editingType === 'article' && (
              <>
                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={editingItem.excerpt || ''}
                    onChange={(e) => setEditingItem({...editingItem, excerpt: e.target.value})}
                    placeholder="Enter excerpt"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={editingItem.featured || false}
                    onCheckedChange={(checked) => setEditingItem({...editingItem, featured: checked})}
                  />
                  <Label htmlFor="featured">Featured Article</Label>
                </div>
              </>
            )}

            {editingType !== 'reply' && (
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={editingItem.category || ''}
                  onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                  placeholder="Enter category"
                />
              </div>
            )}

            {editingType !== 'reply' && (
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={Array.isArray(editingItem.tags) ? editingItem.tags.join(', ') : editingItem.tags || ''}
                  onChange={(e) => setEditingItem({...editingItem, tags: e.target.value})}
                  placeholder="tag1, tag2, tag3"
                />
              </div>
            )}

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={editingItem.status || 'published'}
                onValueChange={(value) => setEditingItem({...editingItem, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {editingType === 'post' && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_solved"
                  checked={editingItem.is_solved || false}
                  onCheckedChange={(checked) => setEditingItem({...editingItem, is_solved: checked})}
                />
                <Label htmlFor="is_solved">Mark as Solved</Label>
              </div>
            )}

            {editingType === 'reply' && (
              <>
                <div>
                  <Label htmlFor="post_id">Post ID</Label>
                  <Input
                    id="post_id"
                    value={editingItem.post_id || ''}
                    onChange={(e) => setEditingItem({...editingItem, post_id: e.target.value})}
                    placeholder="Enter post ID"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_solution"
                      checked={editingItem.is_solution || false}
                      onCheckedChange={(checked) => setEditingItem({...editingItem, is_solution: checked})}
                    />
                    <Label htmlFor="is_solution">Mark as Solution</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_support_reply"
                      checked={editingItem.is_support_reply || false}
                      onCheckedChange={(checked) => setEditingItem({...editingItem, is_support_reply: checked})}
                    />
                    <Label htmlFor="is_support_reply">Support Reply</Label>
                  </div>
                </div>
              </>
            )}

            <div>
              <Label htmlFor="author_id">Author ID</Label>
              <Input
                id="author_id"
                value={editingItem.author_id || ''}
                onChange={(e) => setEditingItem({...editingItem, author_id: e.target.value})}
                placeholder="Enter author user ID"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="created_at">Created At</Label>
                <Input
                  id="created_at"
                  type="datetime-local"
                  value={editingItem.created_at ? new Date(editingItem.created_at).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setEditingItem({...editingItem, created_at: e.target.value ? new Date(e.target.value).toISOString() : ''})}
                />
              </div>

              <div>
                <Label htmlFor="updated_at">Updated At</Label>
                <Input
                  id="updated_at"
                  type="datetime-local"
                  value={editingItem.updated_at ? new Date(editingItem.updated_at).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setEditingItem({...editingItem, updated_at: e.target.value ? new Date(e.target.value).toISOString() : ''})}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingItem.id ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Content Management</h2>
        <p className="text-muted-foreground">Manage all website content, articles, posts, and discussions</p>
      </div>

      <Tabs defaultValue="articles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="articles" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            Help Articles ({helpArticles.length})
          </TabsTrigger>
          <TabsTrigger value="posts" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Community Posts ({communityPosts.length})
          </TabsTrigger>
          <TabsTrigger value="replies" className="gap-2">
            <Users className="h-4 w-4" />
            Replies ({communityReplies.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="articles">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Help Articles</CardTitle>
                <CardDescription>Manage help center articles and documentation</CardDescription>
              </div>
              <Button onClick={() => openCreateDialog('article')} className="gap-2">
                <Plus className="h-4 w-4" />
                New Article
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {helpArticles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {article.featured && <Star className="h-4 w-4 text-yellow-500" />}
                          {article.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{article.category}</Badge>
                      </TableCell>
                      <TableCell>
                        {article.profiles?.full_name || article.profiles?.email || 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                          {article.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        {article.view_count}
                      </TableCell>
                      <TableCell>{formatDate(article.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(article, 'article')}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(article.id, 'article')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="posts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Community Posts</CardTitle>
                <CardDescription>Manage community discussions and posts</CardDescription>
              </div>
              <Button onClick={() => openCreateDialog('post')} className="gap-2">
                <Plus className="h-4 w-4" />
                New Post
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Stats</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {communityPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {post.is_solved && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {post.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{post.category}</Badge>
                      </TableCell>
                      <TableCell>
                        {post.profiles?.full_name || post.profiles?.email || 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                          {post.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post.view_count}
                          </span>
                          <span className="flex items-center gap-1">
                            ↑ {post.upvotes}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(post.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(post, 'post')}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(post.id, 'post')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="replies">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Community Replies</CardTitle>
                <CardDescription>Manage replies and responses to community posts</CardDescription>
              </div>
              <Button onClick={() => openCreateDialog('reply')} className="gap-2">
                <Plus className="h-4 w-4" />
                New Reply
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Content</TableHead>
                    <TableHead>Post</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Upvotes</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {communityReplies.map((reply) => (
                    <TableRow key={reply.id}>
                      <TableCell className="max-w-xs">
                        <div className="truncate">{reply.content}</div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate">{reply.community_posts?.title}</div>
                      </TableCell>
                      <TableCell>
                        {reply.profiles?.full_name || reply.profiles?.email || 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {reply.is_solution && <Badge variant="default">Solution</Badge>}
                          {reply.is_support_reply && <Badge variant="secondary">Support</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>↑ {reply.upvotes}</TableCell>
                      <TableCell>{formatDate(reply.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(reply, 'reply')}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(reply.id, 'reply')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {renderEditDialog()}
    </div>
  );
};

export default AdminContent;