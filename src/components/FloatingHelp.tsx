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
        
        <DialogContent className="max-w-md bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <MessageCircle className="w-5 h-5 text-blue-400" />
              Need Help?
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Quick Start Guide */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Get started in 3 simple steps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-medium">1</div>
                  <span className="text-sm text-slate-300">Create your account</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-medium">2</div>
                  <span className="text-sm text-slate-300">Upload your book details</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-medium">3</div>
                  <span className="text-sm text-slate-300">Choose your review plan</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Options */}
            <div className="grid grid-cols-1 gap-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-3 h-auto p-4 justify-start hover:bg-slate-700/50 border-slate-600 text-white"
                onClick={() => window.open('mailto:support@reviewpromax.com', '_blank')}
              >
                <Mail className="w-5 h-5 text-blue-400" />
                <div className="text-left">
                  <div className="font-medium text-white">Email Support</div>
                  <div className="text-xs text-slate-400">support@reviewpromax.com</div>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto text-slate-400" />
              </Button>

              <Button 
                variant="outline" 
                className="flex items-center gap-3 h-auto p-4 justify-start hover:bg-slate-700/50 border-slate-600 text-white"
                onClick={() => {
                  setIsOpen(false);
                  const contactElement = document.querySelector('#contact') as HTMLElement;
                  if (contactElement) {
                    window.scrollTo({ top: contactElement.offsetTop, behavior: 'smooth' });
                  }
                }}
              >
                <Phone className="w-5 h-5 text-green-400" />
                <div className="text-left">
                  <div className="font-medium text-white">Book Appointment</div>
                  <div className="text-xs text-slate-400">Schedule a call with our team</div>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto text-slate-400" />
              </Button>

              <Button 
                variant="outline" 
                className="flex items-center gap-3 h-auto p-4 justify-start hover:bg-slate-700/50 border-slate-600 text-white"
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
                <MessageCircle className="w-5 h-5 text-purple-400" />
                <div className="text-left">
                  <div className="font-medium text-white">Live Chat</div>
                  <div className="text-xs text-slate-400">
                    {user && hasPurchases ? "Get instant help" : "Purchase required"}
                  </div>
                </div>
                {user && hasPurchases ? (
                  <ArrowRight className="w-4 h-4 ml-auto text-slate-400" />
                ) : (
                  <Lock className="w-4 h-4 ml-auto text-slate-400" />
                )}
              </Button>
            </div>

            {/* Purchase Requirement Alert */}
            {(!user || !hasPurchases) && !purchasesLoading && (
              <Alert className="border-slate-600 bg-slate-800/50">
                <ShoppingCart className="h-4 w-4 text-slate-400" />
                <AlertDescription className="text-sm text-slate-300">
                  <strong className="text-white">Live Chat & AI Support</strong> are available exclusively for customers who have purchased any review plan with ReviewProMax.
                  <Button asChild variant="link" className="p-0 h-auto ml-1 text-blue-400 hover:text-blue-300">
                    <a href="/pricing">View Plans →</a>
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* FAQ Link */}
            <Card className="bg-slate-800/50 border-slate-600">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm text-white">Frequently Asked Questions</div>
                    <div className="text-xs text-slate-400">Find answers to common questions</div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-700">
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