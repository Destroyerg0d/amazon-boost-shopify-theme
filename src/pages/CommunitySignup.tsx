import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Star, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CommunitySignup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    age: "",
    location: "",
    occupation: "",
    readingExperience: "",
    favoriteGenres: [] as string[],
    readingFrequency: "",
    recentBookPurchases: "",
    preferredBookFormats: [] as string[],
    socialMediaHandles: {
      instagram: "",
      goodreads: "",
      facebook: "",
      twitter: ""
    },
    whyJoinCommunity: "",
    monthlyBookBudget: "",
    reviewWritingExperience: ""
  });

  const genres = [
    "Fiction", "Non-Fiction", "Mystery/Thriller", "Romance", "Science Fiction", 
    "Fantasy", "Historical Fiction", "Biography/Memoir", "Self-Help", "Business",
    "Health/Wellness", "True Crime", "Young Adult", "Children's Books", "Poetry"
  ];

  const bookFormats = ["Physical Books", "E-books", "Audiobooks"];

  const handleGenreChange = (genre: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        favoriteGenres: [...prev.favoriteGenres, genre]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        favoriteGenres: prev.favoriteGenres.filter(g => g !== genre)
      }));
    }
  };

  const handleFormatChange = (format: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        preferredBookFormats: [...prev.preferredBookFormats, format]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        preferredBookFormats: prev.preferredBookFormats.filter(f => f !== format)
      }));
    }
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialMediaHandles: {
        ...prev.socialMediaHandles,
        [platform]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('community_readers').insert({
        email: formData.email,
        full_name: formData.fullName,
        age: formData.age ? parseInt(formData.age) : null,
        location: formData.location,
        occupation: formData.occupation,
        reading_experience: formData.readingExperience,
        favorite_genres: formData.favoriteGenres,
        reading_frequency: formData.readingFrequency,
        recent_book_purchases: formData.recentBookPurchases,
        preferred_book_formats: formData.preferredBookFormats,
        social_media_handles: formData.socialMediaHandles,
        why_join_community: formData.whyJoinCommunity,
        monthly_book_budget: formData.monthlyBookBudget,
        review_writing_experience: formData.reviewWritingExperience
      });

      if (error) throw error;

      toast({
        title: "Application Submitted Successfully! 🎉",
        description: "Thank you for your interest! We'll review your application and get back to you within 2-3 business days.",
      });

      // Show success message and redirect after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Premium floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '6s' }}></div>
      </div>
      
      <div className="container mx-auto px-6 py-8 relative z-10">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="mb-6 glass-card border-primary/30 text-primary-foreground hover:bg-primary/20 backdrop-blur-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="max-w-4xl mx-auto">
          <Card className="glass-card border-primary/20 backdrop-blur-xl shadow-strong">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-8 h-8 text-primary" />
                  <Users className="w-8 h-8 text-primary" />
                  <Star className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Join Our Elite Reading Community
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Become part of our exclusive community of passionate readers and help shape the literary world through your authentic reviews.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-primary">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        min="13"
                        max="100"
                        value={formData.age}
                        onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                        placeholder="Your age"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="City, Country"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="occupation">Occupation</Label>
                      <Input
                        id="occupation"
                        value={formData.occupation}
                        onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
                        placeholder="Your profession or occupation"
                      />
                    </div>
                  </div>
                </div>

                {/* Reading Profile */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-primary">Reading Profile</h3>
                  
                  <div>
                    <Label>Reading Experience Level *</Label>
                    <Select value={formData.readingExperience} onValueChange={(value) => setFormData(prev => ({ ...prev, readingExperience: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your reading experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner (1-10 books per year)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (11-30 books per year)</SelectItem>
                        <SelectItem value="advanced">Advanced (30+ books per year)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>How Often Do You Read? *</Label>
                    <Select value={formData.readingFrequency} onValueChange={(value) => setFormData(prev => ({ ...prev, readingFrequency: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reading frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="several-times-week">Several times a week</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="occasionally">Occasionally</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Monthly Book Budget</Label>
                    <Select value={formData.monthlyBookBudget} onValueChange={(value) => setFormData(prev => ({ ...prev, monthlyBookBudget: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your monthly book budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-25">Under $25</SelectItem>
                        <SelectItem value="25-50">$25 - $50</SelectItem>
                        <SelectItem value="50-100">$50 - $100</SelectItem>
                        <SelectItem value="100-200">$100 - $200</SelectItem>
                        <SelectItem value="over-200">Over $200</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Favorite Genres (Select all that apply) *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {genres.map((genre) => (
                        <div key={genre} className="flex items-center space-x-2">
                          <Checkbox
                            id={genre}
                            checked={formData.favoriteGenres.includes(genre)}
                            onCheckedChange={(checked) => handleGenreChange(genre, checked as boolean)}
                          />
                          <Label htmlFor={genre} className="text-sm">{genre}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Preferred Book Formats (Select all that apply)</Label>
                    <div className="flex flex-wrap gap-4 mt-2">
                      {bookFormats.map((format) => (
                        <div key={format} className="flex items-center space-x-2">
                          <Checkbox
                            id={format}
                            checked={formData.preferredBookFormats.includes(format)}
                            onCheckedChange={(checked) => handleFormatChange(format, checked as boolean)}
                          />
                          <Label htmlFor={format}>{format}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="recentPurchases">Recent Book Purchases</Label>
                    <Textarea
                      id="recentPurchases"
                      value={formData.recentBookPurchases}
                      onChange={(e) => setFormData(prev => ({ ...prev, recentBookPurchases: e.target.value }))}
                      placeholder="Tell us about some books you've purchased or read recently..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Social Media & Review Experience */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-primary">Social Media & Review Experience</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="instagram">Instagram Handle</Label>
                      <Input
                        id="instagram"
                        value={formData.socialMediaHandles.instagram}
                        onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                        placeholder="@yourusername"
                      />
                    </div>
                    <div>
                      <Label htmlFor="goodreads">Goodreads Profile</Label>
                      <Input
                        id="goodreads"
                        value={formData.socialMediaHandles.goodreads}
                        onChange={(e) => handleSocialMediaChange('goodreads', e.target.value)}
                        placeholder="Goodreads username or URL"
                      />
                    </div>
                    <div>
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        value={formData.socialMediaHandles.facebook}
                        onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                        placeholder="Facebook profile"
                      />
                    </div>
                    <div>
                      <Label htmlFor="twitter">Twitter/X</Label>
                      <Input
                        id="twitter"
                        value={formData.socialMediaHandles.twitter}
                        onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                        placeholder="@yourusername"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="reviewExperience">Review Writing Experience</Label>
                    <Textarea
                      id="reviewExperience"
                      value={formData.reviewWritingExperience}
                      onChange={(e) => setFormData(prev => ({ ...prev, reviewWritingExperience: e.target.value }))}
                      placeholder="Tell us about your experience writing book reviews (Amazon, Goodreads, blogs, etc.)"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="whyJoin">Why do you want to join our community? *</Label>
                    <Textarea
                      id="whyJoin"
                      required
                      value={formData.whyJoinCommunity}
                      onChange={(e) => setFormData(prev => ({ ...prev, whyJoinCommunity: e.target.value }))}
                      placeholder="Share your motivation for joining our reading community and how you can contribute..."
                      rows={4}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting Application..." : "Submit Application"}
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  * Required fields. We'll review your application within 2-3 business days and notify you via email.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunitySignup;