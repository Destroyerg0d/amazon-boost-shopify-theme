import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  BookOpen, 
  Plus, 
  Star, 
  TrendingUp, 
  Users, 
  Eye,
  Calendar,
  Activity,
  Bell,
  Settings,
  User,
  LogOut,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Upload,
  Check,
  X,
  FileText,
  Image as ImageIcon,
  Link,
  Globe
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';

interface Book {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  genre: string | null;
  language: string | null;
  amazon_url: string | null;
  manuscript_url: string | null;
  front_cover_url: string | null;
  explicit_content: boolean | null;
  upload_status: string | null;
  uploaded_at: string;
}

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string | null;
  reviewed_at: string;
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
  const manuscriptInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalBooks: 0,
    totalReviews: 0,
    averageRating: 0,
    thisMonthBooks: 0
  });
  const [loading, setLoading] = useState(true);
  const [showAddBook, setShowAddBook] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    genre: '',
    language: 'English',
    amazon_url: '',
    explicit_content: false,
    manuscript_file: null as File | null,
    cover_file: null as File | null,
  });

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

      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*, books!inner(*)')
        .eq('books.user_id', user?.id);

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

  const uploadFile = async (file: File, bucket: string, filePath: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;
    return data;
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newBook.title.trim() || !newBook.author.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Book title and author are required"
      });
      return;
    }

    if (!newBook.manuscript_file || !newBook.cover_file) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload both manuscript and cover files"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      // Upload manuscript file
      const manuscriptPath = `${user?.id}/${Date.now()}_${newBook.manuscript_file.name}`;
      await uploadFile(newBook.manuscript_file, 'manuscripts', manuscriptPath);
      setUploadProgress(40);

      // Upload cover file
      const coverPath = `${user?.id}/${Date.now()}_${newBook.cover_file.name}`;
      await uploadFile(newBook.cover_file, 'covers', coverPath);
      setUploadProgress(70);

      // Get public URLs
      const { data: manuscriptUrl } = supabase.storage
        .from('manuscripts')
        .getPublicUrl(manuscriptPath);

      const { data: coverUrl } = supabase.storage
        .from('covers')
        .getPublicUrl(coverPath);

      setUploadProgress(90);

      // Insert book record
      const { data, error } = await supabase
        .from('books')
        .insert([
          {
            user_id: user?.id,
            title: newBook.title.trim(),
            author: newBook.author.trim(),
            description: newBook.description.trim() || null,
            genre: newBook.genre || null,
            language: newBook.language,
            amazon_url: newBook.amazon_url.trim() || null,
            manuscript_url: manuscriptUrl.publicUrl,
            front_cover_url: coverUrl.publicUrl,
            explicit_content: newBook.explicit_content,
            upload_status: 'complete'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setBooks(prev => [data, ...prev]);
      setNewBook({
        title: '',
        author: '',
        description: '',
        genre: '',
        language: 'English',
        amazon_url: '',
        explicit_content: false,
        manuscript_file: null,
        cover_file: null,
      });
      setShowAddBook(false);
      setUploadProgress(100);
      
      toast({
        title: "Success",
        description: "Book uploaded successfully!"
      });

      // Reset progress after a delay
      setTimeout(() => setUploadProgress(0), 2000);
    } catch (error) {
      console.error('Error adding book:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload book. Please try again."
      });
    } finally {
      setIsUploading(false);
    }
  };

  const genres = [
    "Science Fiction",
    "Satire", 
    "Drama & Literary Fiction",
    "Action and Adventure",
    "Romance",
    "Mystery",
    "Horror",
    "Poetry",
    "Short Stories",
    "Children's Fiction",
    "Comics & Graphic Novels",
    "Fantasy",
    "Erotica",
    "Young Adult",
    "Chick Lit",
    "LGBTQ+",
    "Crime & Mystery",
    "Self-Help",
    "Business",
    "Health & Fitness",
    "Travel",
    "Religion, Spirituality, & New Age",
    "Math, Science & Technology",
    "History & Biography",
    "Academic Disciplines",
    "Cookbooks",
    "Diaries & Journals",
    "Memoir & Autobiography",
    "Art & Music",
    "Paranormal",
    "Philosophy",
    "Sports",
    "Family & Relationships",
    "Politics",
    "Crafts & Hobbies",
    "Education & Reference",
    "Pets",
    "Nature",
    "Children's Non-Fiction",
    "Non-English",
    "Learn a Language"
  ];

  const languages = [
    "English",
    "Spanish", 
    "French",
    "German",
    "Dutch",
    "Italian",
    "Japanese",
    "Other"
  ];

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.genre?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'books', label: 'My Books', icon: BookOpen },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-medium transition-all hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Books</p>
                <p className="text-3xl font-bold text-primary">{stats.totalBooks}</p>
              </div>
              <div className="bg-gradient-primary p-3 rounded-full">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-success mr-1" />
              <span className="text-success">+{stats.thisMonthBooks} this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-all hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
                <p className="text-3xl font-bold text-accent">{stats.totalReviews}</p>
              </div>
              <div className="bg-gradient-accent p-3 rounded-full">
                <Star className="w-6 h-6 text-accent-foreground" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Eye className="w-4 h-4 text-muted-foreground mr-1" />
              <span className="text-muted-foreground">Across all books</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-all hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                <p className="text-3xl font-bold text-success">{stats.averageRating}</p>
              </div>
              <div className="bg-gradient-success p-3 rounded-full">
                <Star className="w-6 h-6 text-success-foreground" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < Math.floor(stats.averageRating) ? 'fill-current' : ''}`} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-all hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-3xl font-bold text-primary">{stats.thisMonthBooks}</p>
              </div>
              <div className="bg-gradient-primary p-3 rounded-full">
                <Calendar className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={(stats.thisMonthBooks / Math.max(stats.totalBooks, 1)) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>Get started with common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => setShowAddBook(true)}
              className="h-20 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <Plus className="w-6 h-6" />
              Add New Book
            </Button>
            <Button 
              onClick={() => setActiveTab('reviews')}
              className="h-20 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <Star className="w-6 h-6" />
              View Reviews
            </Button>
            <Button 
              onClick={() => setActiveTab('settings')}
              className="h-20 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <Settings className="w-6 h-6" />
              Account Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Books */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Recent Books
          </CardTitle>
          <CardDescription>Your latest book uploads</CardDescription>
        </CardHeader>
        <CardContent>
          {books.slice(0, 3).length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No books uploaded yet</p>
              <Button onClick={() => setShowAddBook(true)} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Book
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {books.slice(0, 3).map((book) => (
                <div key={book.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{book.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {book.genre && <Badge variant="secondary">{book.genre}</Badge>}
                        <span>•</span>
                        <span>{new Date(book.uploaded_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderBooks = () => (
    <div className="space-y-6">
      {/* Header with Add Book and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">My Books</h2>
          <p className="text-muted-foreground">Manage your book collection</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button onClick={() => setShowAddBook(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Book
          </Button>
        </div>
      </div>

      {/* Add Book Form */}
      {showAddBook && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  New Book
                </CardTitle>
                <CardDescription>
                  {isUploading ? `${uploadProgress}% complete` : 'Hey there! Got a new book? Awesome! First, let\'s start with the basics.'}
                </CardDescription>
              </div>
              {isUploading && (
                <Badge variant="secondary" className="bg-success/10 text-success">
                  <Check className="w-3 h-3 mr-1" />
                  Uploading...
                </Badge>
              )}
            </div>
            {isUploading && (
              <Progress value={uploadProgress} className="h-2 mt-4" />
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddBook} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-base font-medium">
                      Title *
                    </Label>
                    <Input
                      id="title"
                      value={newBook.title}
                      onChange={(e) => setNewBook(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="The title of your book is required."
                      className="h-12"
                      required
                      disabled={isUploading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author" className="text-base font-medium">
                      Author *
                    </Label>
                    <Input
                      id="author"
                      value={newBook.author}
                      onChange={(e) => setNewBook(prev => ({ ...prev, author: e.target.value }))}
                      placeholder="Provide the author of your book."
                      className="h-12"
                      required
                      disabled={isUploading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newBook.description}
                    onChange={(e) => setNewBook(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter book description"
                    rows={4}
                    disabled={isUploading}
                  />
                </div>
              </div>

              <Separator />

              {/* File Uploads */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">File Uploads</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    All readers can review your book using a free copy that you provide to read.
                  </p>
                  
                  {/* Manuscript Upload */}
                  <div className="space-y-2 mb-6">
                    <Label className="text-base font-medium">Manuscript *</Label>
                    <div 
                      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => manuscriptInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        ref={manuscriptInputRef}
                        accept=".epub,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setNewBook(prev => ({ ...prev, manuscript_file: file }));
                          }
                        }}
                        className="hidden"
                        disabled={isUploading}
                      />
                      <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      {newBook.manuscript_file ? (
                        <div>
                          <p className="font-medium text-foreground">{newBook.manuscript_file.name}</p>
                          <p className="text-sm text-muted-foreground mt-1">Click to change file</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium text-foreground mb-2">Drop files here to upload</p>
                          <p className="text-sm text-muted-foreground">Accepted file types: .epub, .pdf</p>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your book copy will be securely encrypted and only made accessible to readers who have already agreed to review your book.
                    </p>
                  </div>

                  {/* Cover Upload */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Front Cover *</Label>
                    <div 
                      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => coverInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        ref={coverInputRef}
                        accept=".jpg,.jpeg,.png,.gif"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setNewBook(prev => ({ ...prev, cover_file: file }));
                          }
                        }}
                        className="hidden"
                        disabled={isUploading}
                      />
                      <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      {newBook.cover_file ? (
                        <div>
                          <p className="font-medium text-foreground">{newBook.cover_file.name}</p>
                          <p className="text-sm text-muted-foreground mt-1">Click to change file</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium text-foreground mb-2">Drop files here to upload</p>
                          <p className="text-sm text-muted-foreground">Accepted file types: .jpg, .png, .gif</p>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Please provide the 2D image of your front cover only. We do not accept 3D models or front-spine-back covers.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Additional Information */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amazon_url" className="text-base font-medium flex items-center gap-2">
                    <Link className="w-4 h-4" />
                    Amazon URL
                  </Label>
                  <Input
                    id="amazon_url"
                    value={newBook.amazon_url}
                    onChange={(e) => setNewBook(prev => ({ ...prev, amazon_url: e.target.value }))}
                    placeholder="https://www.amazon.com/Meditations-Marcus-Aurelius-ebook/dp/B08RYB957M/"
                    className="h-12"
                    disabled={isUploading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Example URL: https://www.amazon.com/Meditations-Marcus-Aurelius-ebook/dp/B08RYB957M/
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Genre *</Label>
                    <Select 
                      value={newBook.genre} 
                      onValueChange={(value) => setNewBook(prev => ({ ...prev, genre: value }))}
                      disabled={isUploading}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select the genre of your book." />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {genres.map(genre => (
                          <SelectItem key={genre} value={genre}>
                            {genre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Language *
                    </Label>
                    <Select 
                      value={newBook.language} 
                      onValueChange={(value) => setNewBook(prev => ({ ...prev, language: value }))}
                      disabled={isUploading}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Please select the language your book is written in" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map(language => (
                          <SelectItem key={language} value={language}>
                            {language}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="explicit_content"
                    checked={newBook.explicit_content}
                    onCheckedChange={(checked) => setNewBook(prev => ({ ...prev, explicit_content: !!checked }))}
                    disabled={isUploading}
                  />
                  <Label htmlFor="explicit_content" className="text-base font-medium cursor-pointer">
                    Explicit content?
                  </Label>
                </div>
              </div>

              <Separator />

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={isUploading || !newBook.title.trim() || !newBook.author.trim() || !newBook.manuscript_file || !newBook.cover_file}
                  className="flex-1 h-12"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    'Submit Book'
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowAddBook(false);
                    setNewBook({
                      title: '',
                      author: '',
                      description: '',
                      genre: '',
                      language: 'English',
                      amazon_url: '',
                      explicit_content: false,
                      manuscript_file: null,
                      cover_file: null,
                    });
                  }}
                  disabled={isUploading}
                  className="h-12"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Books Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredBooks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            {searchQuery ? (
              <>
                <p className="text-lg font-medium mb-2">No books found</p>
                <p className="text-muted-foreground">Try adjusting your search terms</p>
              </>
            ) : (
              <>
                <p className="text-lg font-medium mb-2">No books uploaded yet</p>
                <p className="text-muted-foreground mb-4">Add your first book to get started</p>
                <Button onClick={() => setShowAddBook(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Book
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="hover:shadow-medium transition-all hover:scale-105 group">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                    {book.title}
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
                <CardDescription>
                  <div className="space-y-2">
                    {book.genre && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {book.genre}
                      </Badge>
                    )}
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Uploaded {new Date(book.uploaded_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardDescription>
              </CardHeader>
              {book.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {book.description}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Reviews</h2>
        <p className="text-muted-foreground">Track all reviews for your books</p>
      </div>
      <Card>
        <CardContent className="py-12 text-center">
          <Star className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">Reviews coming soon</p>
          <p className="text-muted-foreground">This feature is under development</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>
      <Card>
        <CardContent className="py-12 text-center">
          <Settings className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">Settings coming soon</p>
          <p className="text-muted-foreground">This feature is under development</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex w-64 min-h-screen bg-card border-r border-border flex-col">
          {/* User Profile Section */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-primary p-2 rounded-full">
                <User className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">Author Dashboard</p>
                <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Sign Out Button */}
          <div className="p-4 border-t border-border">
            <Button variant="outline" onClick={signOut} className="w-full justify-start">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

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
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap text-sm transition-colors ${
                      activeTab === item.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Page Content */}
          <div className="p-6">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'books' && renderBooks()}
            {activeTab === 'reviews' && renderReviews()}
            {activeTab === 'settings' && renderSettings()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;