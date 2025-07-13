import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { HelpCircle, MessageCircle, Phone, Mail, ExternalLink, CheckCircle, ArrowRight, ShoppingCart, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserPurchases } from '@/hooks/useUserPurchases';

export const FloatingHelp = () => {
  const { user } = useAuth();
  const { hasPurchases, loading: purchasesLoading } = useUserPurchases();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="rounded-full h-14 w-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-110"
          >
            <HelpCircle className="w-6 h-6" />
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Need Help?
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Quick Start Guide */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Quick Start Guide
                </CardTitle>
                <CardDescription>
                  Get started in 3 simple steps
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="w-6 h-6 rounded-full flex items-center justify-center p-0 text-xs">1</Badge>
                  <span className="text-sm">Create your account</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="w-6 h-6 rounded-full flex items-center justify-center p-0 text-xs">2</Badge>
                  <span className="text-sm">Upload your book details</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="w-6 h-6 rounded-full flex items-center justify-center p-0 text-xs">3</Badge>
                  <span className="text-sm">Choose your review plan</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Options */}
            <div className="grid grid-cols-1 gap-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-3 h-auto p-4 justify-start hover:bg-primary/5"
                onClick={() => window.open('mailto:support@reviewpromax.com', '_blank')}
              >
                <Mail className="w-5 h-5 text-blue-500" />
                <div className="text-left">
                  <div className="font-medium">Email Support</div>
                  <div className="text-xs text-muted-foreground">support@reviewpromax.com</div>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto" />
              </Button>

              <Button 
                variant="outline" 
                className="flex items-center gap-3 h-auto p-4 justify-start hover:bg-primary/5"
                onClick={() => window.open('tel:+1234567890', '_blank')}
              >
                <Phone className="w-5 h-5 text-green-500" />
                <div className="text-left">
                  <div className="font-medium">Phone Support</div>
                  <div className="text-xs text-muted-foreground">Mon-Fri 9AM-6PM EST</div>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto" />
              </Button>

              <Button 
                variant="outline" 
                className="flex items-center gap-3 h-auto p-4 justify-start hover:bg-primary/5"
                onClick={() => {
                  if (!user || !hasPurchases) {
                    // Show purchase requirement alert instead of navigating
                    return;
                  }
                  setIsOpen(false);
                  const contactElement = document.querySelector('#contact') as HTMLElement;
                  if (contactElement) {
                    window.scrollTo({ top: contactElement.offsetTop, behavior: 'smooth' });
                  }
                }}
              >
                <MessageCircle className="w-5 h-5 text-purple-500" />
                <div className="text-left">
                  <div className="font-medium">Live Chat</div>
                  <div className="text-xs text-muted-foreground">
                    {user && hasPurchases ? "Get instant help" : "Purchase required"}
                  </div>
                </div>
                {user && hasPurchases ? (
                  <ArrowRight className="w-4 h-4 ml-auto" />
                ) : (
                  <Lock className="w-4 h-4 ml-auto text-muted-foreground" />
                )}
              </Button>
            </div>

            {/* Purchase Requirement Alert */}
            {(!user || !hasPurchases) && !purchasesLoading && (
              <Alert className="border-primary/20 bg-primary/5">
                <ShoppingCart className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Live Chat & AI Support</strong> are available exclusively for customers who have purchased any review plan with ReviewProMax.
                  <Button asChild variant="link" className="p-0 h-auto ml-1">
                    <a href="/pricing">View Plans →</a>
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* FAQ Link */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Frequently Asked Questions</div>
                    <div className="text-xs text-muted-foreground">Find answers to common questions</div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};