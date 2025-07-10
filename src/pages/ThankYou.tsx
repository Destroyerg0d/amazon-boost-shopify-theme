import { useEffect } from "react";
import { CheckCircle, ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const ThankYou = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect to dashboard after 10 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-6 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground mb-2">
            Thank You for Your Purchase!
          </CardTitle>
          <p className="text-muted-foreground text-lg">
            Your review plan has been successfully activated
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3">What happens next?</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-sm font-semibold">1</span>
                </div>
                <div>
                  <p className="font-medium">Upload Your Book</p>
                  <p className="text-sm text-muted-foreground">
                    Go to your dashboard to upload your manuscript and book details
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-sm font-semibold">2</span>
                </div>
                <div>
                  <p className="font-medium">Review Assignment</p>
                  <p className="text-sm text-muted-foreground">
                    Our team will assign qualified reviewers to your book
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-sm font-semibold">3</span>
                </div>
                <div>
                  <p className="font-medium">Receive Reviews</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when reviews are completed and published
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => window.open('mailto:support@reviewpromax.com', '_blank')}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Contact Support
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>You'll be automatically redirected to your dashboard in 10 seconds</p>
            <p className="mt-2">
              Need help? Email us at{" "}
              <a 
                href="mailto:support@reviewpromax.com" 
                className="text-primary hover:underline"
              >
                support@reviewpromax.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThankYou;