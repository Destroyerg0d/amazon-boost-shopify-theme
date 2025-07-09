import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus,
  Check,
  FileText,
  Image as ImageIcon,
  Link,
  Globe,
  BookOpen,
  User,
  ArrowLeft
} from 'lucide-react';

interface BookUploadProps {
  onBack: () => void;
  onBookAdded: () => void;
}

const BookUpload = ({ onBack, onBookAdded }: BookUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const manuscriptInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [manuscriptPreview, setManuscriptPreview] = useState<string | null>(null);
  
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    author_note: '',
    genre: '',
    language: 'English',
    asin: '',
    explicit_content: false,
    manuscript_file: null as File | null,
    cover_file: null as File | null,
  });

  const genres = [
    "Science Fiction", "Satire", "Drama & Literary Fiction", "Action and Adventure",
    "Romance", "Mystery", "Horror", "Poetry", "Short Stories", "Children's Fiction",
    "Comics & Graphic Novels", "Fantasy", "Erotica", "Young Adult", "Chick Lit",
    "LGBTQ+", "Crime & Mystery", "Self-Help", "Business", "Health & Fitness",
    "Travel", "Religion, Spirituality, & New Age", "Math, Science & Technology",
    "History & Biography", "Academic Disciplines", "Cookbooks", "Diaries & Journals",
    "Memoir & Autobiography", "Art & Music", "Paranormal", "Philosophy", "Sports",
    "Family & Relationships", "Politics", "Crafts & Hobbies", "Education & Reference",
    "Pets", "Nature", "Children's Non-Fiction", "Non-English", "Learn a Language"
  ];

  const languages = [
    "English", "Spanish", "French", "German", "Dutch", "Italian", "Japanese", "Other"
  ];

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

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewBook(prev => ({ ...prev, cover_file: file }));
      const reader = new FileReader();
      reader.onload = (e) => setCoverPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleManuscriptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewBook(prev => ({ ...prev, manuscript_file: file }));
      setManuscriptPreview(file.name);
    }
  };

  const validateASIN = (asin: string) => {
    // ASIN can be 10 characters (older format) or start with B and be 10 characters
    const asinPattern = /^[A-Z0-9]{10}$|^B[A-Z0-9]{9}$/;
    return asinPattern.test(asin.replace(/[^A-Z0-9]/g, ''));
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

    if (!newBook.description.trim() || newBook.description.length < 60) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Description is required and must be at least 60 characters"
      });
      return;
    }

    if (!newBook.asin.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "ASIN is required"
      });
      return;
    }

    if (!validateASIN(newBook.asin)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "ASIN format is invalid. Should be like: B0F4L3F4GD or 1645585425"
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

    if (!newBook.genre) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a genre"
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
            description: newBook.description.trim(),
            author_note: newBook.author_note.trim() || null,
            genre: newBook.genre,
            language: newBook.language,
            asin: newBook.asin.trim(),
            manuscript_url: manuscriptUrl.publicUrl,
            front_cover_url: coverUrl.publicUrl,
            explicit_content: newBook.explicit_content,
            upload_status: 'complete',
            approval_status: 'under_review'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setNewBook({
        title: '',
        author: '',
        description: '',
        author_note: '',
        genre: '',
        language: 'English',
        asin: '',
        explicit_content: false,
        manuscript_file: null,
        cover_file: null,
      });
      setCoverPreview(null);
      setManuscriptPreview(null);
      setUploadProgress(100);
      
      toast({
        title: "Success",
        description: "Book uploaded successfully! It's now under review."
      });

      // Reset progress after a delay
      setTimeout(() => {
        setUploadProgress(0);
        onBookAdded();
      }, 2000);
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

  return (
    <div className="space-y-6 relative">
      {/* Premium background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-accent/5 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Books
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Add New Book</h2>
          <p className="text-muted-foreground">Upload your book for review</p>
        </div>
      </div>

      <Card className="max-w-4xl mx-auto glass-card shadow-strong border-primary/20 backdrop-blur-xl">
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
                  Description * (minimum 60 characters)
                </Label>
                <Textarea
                  id="description"
                  value={newBook.description}
                  onChange={(e) => setNewBook(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter book description (minimum 60 characters required)"
                  rows={4}
                  disabled={isUploading}
                  className={newBook.description.length > 0 && newBook.description.length < 60 ? 'border-destructive' : ''}
                />
                <p className="text-xs text-muted-foreground">
                  {newBook.description.length}/60 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author_note" className="text-base font-medium">
                  Author's Note (Optional)
                </Label>
                <Textarea
                  id="author_note"
                  value={newBook.author_note}
                  onChange={(e) => setNewBook(prev => ({ ...prev, author_note: e.target.value }))}
                  placeholder="Only authors and readers can see this. You can write anything here..."
                  rows={3}
                  disabled={isUploading}
                />
                <p className="text-xs text-muted-foreground">
                  This note will only be visible to you and readers who review your book.
                </p>
              </div>
            </div>

            <Separator />

            {/* File Uploads with Previews */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">File Uploads</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  All readers can review your book using a free copy that you provide to read.
                </p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Manuscript Upload */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Manuscript *</Label>
                    <div 
                      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => manuscriptInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        ref={manuscriptInputRef}
                        accept=".epub,.pdf"
                        onChange={handleManuscriptChange}
                        className="hidden"
                        disabled={isUploading}
                      />
                      <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      {manuscriptPreview ? (
                        <div>
                          <p className="font-medium text-foreground">{manuscriptPreview}</p>
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

                  {/* Cover Upload with Preview */}
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
                        onChange={handleCoverChange}
                        className="hidden"
                        disabled={isUploading}
                      />
                      {coverPreview ? (
                        <div className="space-y-2">
                          <img 
                            src={coverPreview} 
                            alt="Cover preview" 
                            className="w-32 h-48 object-cover mx-auto rounded border"
                          />
                          <p className="text-sm text-muted-foreground">Click to change cover</p>
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                          <p className="font-medium text-foreground mb-2">Drop files here to upload</p>
                          <p className="text-sm text-muted-foreground">Accepted file types: .jpg, .png, .gif</p>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Please provide the 2D image of your front cover only. We do not accept 3D models or front-spine-back covers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Additional Information */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="asin" className="text-base font-medium flex items-center gap-2">
                  <Link className="w-4 h-4" />
                  ASIN *
                </Label>
                <Input
                  id="asin"
                  value={newBook.asin}
                  onChange={(e) => setNewBook(prev => ({ ...prev, asin: e.target.value }))}
                  placeholder="B0F4L3F4GD or 1645585425"
                  className="h-12"
                  disabled={isUploading}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Amazon Standard Identification Number - formats like: "B0F4L3F4GD", "1645585425", "B0C5YYNYZZ"
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
                disabled={isUploading || !newBook.title.trim() || !newBook.author.trim() || !newBook.description.trim() || newBook.description.length < 60 || !newBook.asin.trim() || !newBook.genre || !newBook.manuscript_file || !newBook.cover_file}
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
                onClick={onBack}
                disabled={isUploading}
                className="h-12"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookUpload;