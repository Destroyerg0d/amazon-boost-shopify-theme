import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ArrowRight, BookOpen } from 'lucide-react';

interface UserSurveyProps {
  onComplete: () => void;
  showSkipButton?: boolean;
}

export const UserSurvey = ({ onComplete, showSkipButton = true }: UserSurveyProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    writingExperience: '',
    previousPublishing: '',
    bookGenres: [] as string[],
    targetAudience: '',
    marketingBudget: '',
    mainGoals: [] as string[],
    currentChallenges: [] as string[],
    bookStatus: '',
    howDidYouHear: '',
    monthlyRevenueGoal: '',
    primaryInterest: '',
    additionalComments: ''
  });

  const genreOptions = [
    'Fiction', 'Non-Fiction', 'Romance', 'Mystery/Thriller', 'Science Fiction', 
    'Fantasy', 'Self-Help', 'Business', 'Biography/Memoir', 'Children\'s Books',
    'Young Adult', 'Horror', 'Historical Fiction', 'Health & Wellness', 'Other'
  ];

  const goalOptions = [
    'Increase book sales', 'Build author brand', 'Get more reviews', 'Improve Amazon ranking',
    'Launch new book successfully', 'Generate passive income', 'Reach bestseller status',
    'Build readership', 'Get media attention', 'Other'
  ];

  const challengeOptions = [
    'Getting initial reviews', 'Low book visibility', 'Competition', 'Marketing knowledge',
    'Time management', 'Budget constraints', 'Technical challenges', 'Writing quality',
    'Cover design', 'Finding target audience', 'Other'
  ];

  const handleGenreChange = (genre: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      bookGenres: checked 
        ? [...prev.bookGenres, genre]
        : prev.bookGenres.filter(g => g !== genre)
    }));
  };

  const handleGoalChange = (goal: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      mainGoals: checked 
        ? [...prev.mainGoals, goal]
        : prev.mainGoals.filter(g => g !== goal)
    }));
  };

  const handleChallengeChange = (challenge: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      currentChallenges: checked 
        ? [...prev.currentChallenges, challenge]
        : prev.currentChallenges.filter(c => c !== challenge)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('user_surveys')
        .insert({
          user_id: user.id,
          writing_experience: formData.writingExperience,
          previous_publishing: formData.previousPublishing,
          book_genres: formData.bookGenres,
          target_audience: formData.targetAudience,
          marketing_budget: formData.marketingBudget,
          main_goals: formData.mainGoals,
          current_challenges: formData.currentChallenges,
          book_status: formData.bookStatus,
          how_did_you_hear: formData.howDidYouHear,
          monthly_revenue_goal: formData.monthlyRevenueGoal,
          primary_interest: formData.primaryInterest,
          additional_comments: formData.additionalComments
        });

      if (error) throw error;

      toast({
        title: "Survey completed!",
        description: "Thank you for providing your information. You can now access your dashboard."
      });

      onComplete();
    } catch (error: any) {
      console.error('Error submitting survey:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit survey. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero px-4 py-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-primary mr-2" />
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Welcome to ReviewProMax!
            </h1>
          </div>
          <p className="text-primary-foreground/80 text-lg">
            Help us personalize your experience by sharing a bit about your publishing journey
          </p>
        </div>

        <Card className="glass-card shadow-strong border-primary/20 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Author Survey</CardTitle>
            <CardDescription className="text-center">
              This information helps us provide better recommendations and support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Writing Experience */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">How would you describe your writing experience?</Label>
                <RadioGroup 
                  value={formData.writingExperience} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, writingExperience: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="beginner" id="exp-beginner" />
                    <Label htmlFor="exp-beginner">Beginner (0-1 books)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intermediate" id="exp-intermediate" />
                    <Label htmlFor="exp-intermediate">Intermediate (2-5 books)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="experienced" id="exp-experienced" />
                    <Label htmlFor="exp-experienced">Experienced (6+ books)</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Previous Publishing */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Have you published books before?</Label>
                <RadioGroup 
                  value={formData.previousPublishing} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, previousPublishing: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="never" id="pub-never" />
                    <Label htmlFor="pub-never">Never published</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="self-published" id="pub-self" />
                    <Label htmlFor="pub-self">Self-published</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="traditional" id="pub-traditional" />
                    <Label htmlFor="pub-traditional">Traditional publishing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="pub-both" />
                    <Label htmlFor="pub-both">Both self and traditional</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Book Genres */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">What genres do you write? (Select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {genreOptions.map((genre) => (
                    <div key={genre} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`genre-${genre}`}
                        checked={formData.bookGenres.includes(genre)}
                        onCheckedChange={(checked) => handleGenreChange(genre, checked as boolean)}
                      />
                      <Label htmlFor={`genre-${genre}`} className="text-sm">{genre}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Audience */}
              <div className="space-y-3">
                <Label htmlFor="target-audience" className="text-base font-semibold">Who is your target audience?</Label>
                <Input
                  id="target-audience"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                  placeholder="e.g., Young adults, Business professionals, Romance readers..."
                  className="w-full"
                />
              </div>

              {/* Marketing Budget */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">What's your monthly marketing budget?</Label>
                <Select value={formData.marketingBudget} onValueChange={(value) => setFormData(prev => ({ ...prev, marketingBudget: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-100">$0 - $100</SelectItem>
                    <SelectItem value="100-500">$100 - $500</SelectItem>
                    <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                    <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                    <SelectItem value="2500+">$2,500+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Main Goals */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">What are your main goals? (Select all that apply)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {goalOptions.map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`goal-${goal}`}
                        checked={formData.mainGoals.includes(goal)}
                        onCheckedChange={(checked) => handleGoalChange(goal, checked as boolean)}
                      />
                      <Label htmlFor={`goal-${goal}`} className="text-sm">{goal}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Challenges */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">What are your current challenges? (Select all that apply)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {challengeOptions.map((challenge) => (
                    <div key={challenge} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`challenge-${challenge}`}
                        checked={formData.currentChallenges.includes(challenge)}
                        onCheckedChange={(checked) => handleChallengeChange(challenge, checked as boolean)}
                      />
                      <Label htmlFor={`challenge-${challenge}`} className="text-sm">{challenge}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Book Status */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">What's your current book status?</Label>
                <RadioGroup 
                  value={formData.bookStatus} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, bookStatus: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="writing" id="status-writing" />
                    <Label htmlFor="status-writing">Still writing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="editing" id="status-editing" />
                    <Label htmlFor="status-editing">In editing phase</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ready" id="status-ready" />
                    <Label htmlFor="status-ready">Ready to publish</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="published" id="status-published" />
                    <Label htmlFor="status-published">Already published</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* How did you hear */}
              <div className="space-y-3">
                <Label htmlFor="how-hear" className="text-base font-semibold">How did you hear about us?</Label>
                <Select value={formData.howDidYouHear} onValueChange={(value) => setFormData(prev => ({ ...prev, howDidYouHear: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google Search</SelectItem>
                    <SelectItem value="social-media">Social Media</SelectItem>
                    <SelectItem value="friend">Friend/Referral</SelectItem>
                    <SelectItem value="facebook-group">Facebook Group</SelectItem>
                    <SelectItem value="blog">Blog/Article</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Revenue Goal */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">What's your monthly revenue goal from book sales?</Label>
                <Select value={formData.monthlyRevenueGoal} onValueChange={(value) => setFormData(prev => ({ ...prev, monthlyRevenueGoal: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-500">$0 - $500</SelectItem>
                    <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                    <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                    <SelectItem value="2500-5000">$2,500 - $5,000</SelectItem>
                    <SelectItem value="5000+">$5,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Primary Interest */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">What's your primary interest in our services?</Label>
                <RadioGroup 
                  value={formData.primaryInterest} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, primaryInterest: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="reviews" id="interest-reviews" />
                    <Label htmlFor="interest-reviews">Getting more reviews</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="marketing" id="interest-marketing" />
                    <Label htmlFor="interest-marketing">Marketing advice</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sales" id="interest-sales" />
                    <Label htmlFor="interest-sales">Increasing sales</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="launch" id="interest-launch" />
                    <Label htmlFor="interest-launch">Book launch support</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Additional Comments */}
              <div className="space-y-3">
                <Label htmlFor="comments" className="text-base font-semibold">Any additional comments or specific needs?</Label>
                <Textarea
                  id="comments"
                  value={formData.additionalComments}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalComments: e.target.value }))}
                  placeholder="Tell us anything else that would help us serve you better..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex gap-4 justify-end">
                {showSkipButton && (
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => onComplete()}
                    className="flex items-center gap-2"
                  >
                    Skip for Later
                  </Button>
                )}
                <Button 
                  type="submit" 
                  className="flex items-center gap-2" 
                  variant="hero"
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Complete Survey'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};