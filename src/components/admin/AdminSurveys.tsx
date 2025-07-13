import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Search, Eye, Users, BookOpen, Target, DollarSign } from 'lucide-react';

interface Survey {
  id: string;
  user_id: string;
  writing_experience: string;
  previous_publishing: string;
  book_genres: string[];
  target_audience: string;
  marketing_budget: string;
  main_goals: string[];
  current_challenges: string[];
  book_status: string;
  how_did_you_hear: string;
  monthly_revenue_goal: string;
  primary_interest: string;
  additional_comments: string;
  created_at: string;
  profiles?: {
    full_name: string;
    email: string;
  } | null;
}

export const AdminSurveys = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      // Fetch surveys first
      const { data: surveysData, error: surveysError } = await supabase
        .from('user_surveys')
        .select('*')
        .order('created_at', { ascending: false });

      if (surveysError) throw surveysError;

      // Fetch profiles for these survey users
      const userIds = surveysData?.map(s => s.user_id) || [];
      let profilesData: any[] = [];
      
      if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, full_name, email')
          .in('user_id', userIds);
        
        if (profilesError) throw profilesError;
        profilesData = profiles || [];
      }

      // Combine survey data with profiles
      const surveysWithProfiles = surveysData?.map(survey => ({
        ...survey,
        profiles: profilesData.find(p => p.user_id === survey.user_id)
      })) || [];

      setSurveys(surveysWithProfiles || []);
    } catch (error) {
      console.error('Error fetching surveys:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load surveys"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredSurveys = surveys.filter(survey => 
    survey.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey.writing_experience?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey.book_genres?.some(genre => genre.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getExperienceBadgeColor = (experience: string) => {
    switch (experience) {
      case 'beginner': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'experienced': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'writing': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'editing': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'ready': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'published': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const ViewSurveyDetails = ({ survey }: { survey: Survey }) => (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      {/* Basic Info */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground">Author</h4>
          <p className="font-medium">{survey.profiles?.full_name}</p>
          <p className="text-sm text-muted-foreground">{survey.profiles?.email}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground">Joined</h4>
          <p className="font-medium">{new Date(survey.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Experience & Publishing */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground mb-2">Writing Experience</h4>
          <Badge className={getExperienceBadgeColor(survey.writing_experience)}>
            {survey.writing_experience}
          </Badge>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground mb-2">Previous Publishing</h4>
          <Badge className="bg-primary/10 text-primary border-primary/20">
            {survey.previous_publishing}
          </Badge>
        </div>
      </div>

      {/* Book Status */}
      <div>
        <h4 className="font-semibold text-sm text-muted-foreground mb-2">Current Book Status</h4>
        <Badge className={getStatusBadgeColor(survey.book_status)}>
          {survey.book_status}
        </Badge>
      </div>

      {/* Genres */}
      <div>
        <h4 className="font-semibold text-sm text-muted-foreground mb-2">Book Genres</h4>
        <div className="flex flex-wrap gap-2">
          {survey.book_genres?.map((genre, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {genre}
            </Badge>
          ))}
        </div>
      </div>

      {/* Target Audience */}
      <div>
        <h4 className="font-semibold text-sm text-muted-foreground mb-2">Target Audience</h4>
        <p className="text-sm bg-muted/50 p-3 rounded-lg">{survey.target_audience}</p>
      </div>

      {/* Budget & Revenue Goals */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground mb-2">Marketing Budget</h4>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">{survey.marketing_budget}/month</span>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground mb-2">Revenue Goal</h4>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">{survey.monthly_revenue_goal}/month</span>
          </div>
        </div>
      </div>

      {/* Goals */}
      <div>
        <h4 className="font-semibold text-sm text-muted-foreground mb-2">Main Goals</h4>
        <div className="flex flex-wrap gap-2">
          {survey.main_goals?.map((goal, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {goal}
            </Badge>
          ))}
        </div>
      </div>

      {/* Challenges */}
      <div>
        <h4 className="font-semibold text-sm text-muted-foreground mb-2">Current Challenges</h4>
        <div className="flex flex-wrap gap-2">
          {survey.current_challenges?.map((challenge, index) => (
            <Badge key={index} variant="outline" className="text-xs border-orange-500/20 text-orange-600">
              {challenge}
            </Badge>
          ))}
        </div>
      </div>

      {/* How they heard about us */}
      <div>
        <h4 className="font-semibold text-sm text-muted-foreground mb-2">How They Found Us</h4>
        <Badge variant="outline">{survey.how_did_you_hear}</Badge>
      </div>

      {/* Primary Interest */}
      <div>
        <h4 className="font-semibold text-sm text-muted-foreground mb-2">Primary Interest</h4>
        <Badge className="bg-accent/10 text-accent border-accent/20">
          {survey.primary_interest}
        </Badge>
      </div>

      {/* Additional Comments */}
      {survey.additional_comments && (
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground mb-2">Additional Comments</h4>
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm whitespace-pre-wrap">{survey.additional_comments}</p>
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Surveys</h2>
          <p className="text-muted-foreground">View author onboarding survey responses</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          {surveys.length} total responses
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or experience..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Surveys Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSurveys.map((survey) => (
          <Card key={survey.id} className="hover:shadow-medium transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{survey.profiles?.full_name || 'Unknown'}</CardTitle>
                  <CardDescription className="text-sm">{survey.profiles?.email}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedSurvey(survey);
                    setShowDetails(true);
                  }}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <Badge className={getExperienceBadgeColor(survey.writing_experience)}>
                  {survey.writing_experience}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{survey.primary_interest}</span>
              </div>

              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Budget: {survey.marketing_budget}</span>
              </div>

              <div className="text-xs text-muted-foreground">
                Submitted: {new Date(survey.created_at).toLocaleDateString()}
              </div>

              {survey.book_genres && survey.book_genres.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {survey.book_genres.slice(0, 3).map((genre, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                  {survey.book_genres.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{survey.book_genres.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSurveys.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No surveys found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? 'Try adjusting your search terms' : 'No survey responses have been submitted yet'}
          </p>
        </div>
      )}

      {/* Survey Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Survey Details - {selectedSurvey?.profiles?.full_name}</DialogTitle>
          </DialogHeader>
          {selectedSurvey && <ViewSurveyDetails survey={selectedSurvey} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};