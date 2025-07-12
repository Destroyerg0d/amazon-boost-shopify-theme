import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { UserSurvey } from '@/components/UserSurvey';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [showSurvey, setShowSurvey] = useState(false);
  const [newUserId, setNewUserId] = useState<string | null>(null);
  const { signIn, signUp, signInWithGoogle, signInWithFacebook, signInWithApple, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect authenticated users
  useEffect(() => {
    if (!loading && user && !showSurvey) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate, showSurvey]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await signIn(email, password);
    
    if (error) {
      let errorMessage = error.message;
      
      // Provide more user-friendly error messages
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = "Incorrect email or password. Please try again.";
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = "Your account is ready to use. Please try signing in again.";
      } else if (error.message.includes('Too many requests')) {
        errorMessage = "Too many login attempts. Please wait a moment before trying again.";
      }
      
      toast({
        variant: "destructive",
        title: "Unable to sign in",
        description: errorMessage
      });
    } else {
      toast({
        title: "Welcome back! 🎉",
        description: "Successfully signed in to your account",
        className: "border-green-500 bg-green-50 text-green-800"
      });
      navigate('/dashboard');
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;

    const { error } = await signUp(email, password, fullName);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error creating account",
        description: error.message
      });
    } else {
      // Automatically sign in the user since email confirmation is disabled
      const { error: signInError } = await signIn(email, password);
      
      if (!signInError) {
        toast({
          title: "Welcome to ReviewProMax! 🚀",
          description: "Your account is ready to go!",
          className: "border-green-500 bg-green-50 text-green-800"
        });
        
        // Check for existing survey and show if needed
        const { data: session } = await supabase.auth.getSession();
        if (session.session?.user) {
          const { data: existingSurvey } = await supabase
            .from('user_surveys')
            .select('id')
            .eq('user_id', session.session.user.id)
            .maybeSingle();

          if (!existingSurvey) {
            setNewUserId(session.session.user.id);
            setShowSurvey(true);
          } else {
            navigate('/dashboard');
          }
        }
      } else {
        toast({
          title: "Account created! 🎉",
          description: "Please sign in with your new credentials",
          className: "border-blue-500 bg-blue-50 text-blue-800"
        });
      }
    }
    
    setIsLoading(false);
  };

  const handleSurveyComplete = () => {
    setShowSurvey(false);
    navigate('/dashboard');
  };

  const handleSocialSignIn = async (provider: 'google' | 'facebook' | 'apple') => {
    setSocialLoading(provider);
    
    try {
      let result;
      switch (provider) {
        case 'google':
          result = await signInWithGoogle();
          break;
        case 'facebook':
          result = await signInWithFacebook();
          break;
        case 'apple':
          result = await signInWithApple();
          break;
        default:
          throw new Error('Unknown provider');
      }

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error signing in",
          description: result.error.message
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: error.message
      });
    } finally {
      setSocialLoading(null);
    }
  };

  if (showSurvey && newUserId) {
    return <UserSurvey onComplete={handleSurveyComplete} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero px-4 relative overflow-hidden">
      {/* Enhanced floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
        
        {/* Add sparkle effects */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '5s' }}></div>
      </div>
      
      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4 animate-scale-in">
            ReviewProMax
          </h1>
          <p className="text-primary-foreground/90 text-xl font-medium mb-2">
            Boost your Amazon book success
          </p>
          <p className="text-primary-foreground/70 text-sm">
            Get authentic reviews and grow your audience
          </p>
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-accent rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>

        <Card className="glass-card shadow-strong border-primary/20 backdrop-blur-xl hover-scale transition-all duration-300">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl bg-gradient-primary bg-clip-text text-transparent">Welcome</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Join thousands of authors growing their book success
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">{/* ... keep existing code */}
            {/* Enhanced Google Sign In */}
            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={() => handleSocialSignIn('google')}
                disabled={socialLoading !== null}
                className="w-full flex items-center gap-3 h-12 bg-white hover:bg-gray-50 border-2 hover:border-primary/50 transition-all duration-200 hover-scale"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-medium text-gray-700">
                  {socialLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
                </span>
              </Button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-primary/20" />
              </div>
              <div className="relative flex justify-center text-sm uppercase">
                <span className="bg-background px-4 text-muted-foreground font-medium">Or continue with email</span>
              </div>
            </div>

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 h-12">
                <TabsTrigger value="signin" className="font-medium">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="font-medium">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4 mt-6">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-sm font-medium">Email Address</Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="h-12 border-2 focus:border-primary transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-sm font-medium">Password</Label>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      className="h-12 border-2 focus:border-primary transition-colors"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-medium" 
                    variant="hero"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Signing in...
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4 mt-6">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-sm font-medium">Full Name</Label>
                    <Input
                      id="signup-name"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      className="h-12 border-2 focus:border-primary transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-medium">Email Address</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="h-12 border-2 focus:border-primary transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="Create a strong password (min 6 characters)"
                      className="h-12 border-2 focus:border-primary transition-colors"
                      minLength={6}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Password should be at least 6 characters long
                    </p>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-medium" 
                    variant="hero"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Creating account...
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            {/* Trust indicators */}
            <div className="text-center mt-6 space-y-2">
              <p className="text-xs text-muted-foreground">
                🔒 Your data is secure and protected
              </p>
              <p className="text-xs text-muted-foreground">
                Join 1000+ authors already using ReviewProMax
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;