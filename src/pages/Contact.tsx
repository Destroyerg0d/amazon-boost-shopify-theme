import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Clock, 
  MapPin, 
  Send, 
  Headphones,
  MessageCircle,
  Calendar,
  Star,
  User,
  X
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TawkToChat } from "@/components/TawkToChat";
import { AIChatbot } from "@/components/AIChatbot";
import { useAuth } from "@/hooks/useAuth";
import { useUserPurchases } from "@/hooks/useUserPurchases";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShoppingCart, Lock } from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { hasPurchases, loading: purchasesLoading } = useUserPurchases();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [scheduleCallData, setScheduleCallData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScheduleCallSubmitting, setIsScheduleCallSubmitting] = useState(false);
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isScheduleCallOpen, setIsScheduleCallOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('customers')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: 'Not provided', // Required field, but not collected in contact form
            business_type: null,
            monthly_revenue: null,
            message: `Subject: ${formData.subject}\n\n${formData.message}`,
            lead_source: 'contact_page',
            status: 'new'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for contacting us. We'll get back to you within 12 hours.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Message Failed to Send",
        description: "There was an error sending your message. Please try calling us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScheduleCall = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScheduleCallSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('customers')
        .insert([
          {
            name: scheduleCallData.name,
            email: scheduleCallData.email,
            phone: scheduleCallData.phone,
            business_type: null,
            monthly_revenue: null,
            message: `SCHEDULE CALL REQUEST\n\n${scheduleCallData.message}`,
            lead_source: 'schedule_call',
            status: 'new'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Call Scheduled Successfully!",
        description: "Thank you! Our team will contact you within 24 hours to schedule your consultation call.",
      });

      // Reset form and close modal
      setScheduleCallData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
      setIsScheduleCallOpen(false);
    } catch (error) {
      console.error('Error scheduling call:', error);
      toast({
        title: "Failed to Schedule Call",
        description: "There was an error processing your request. Please try calling us directly.",
        variant: "destructive"
      });
    } finally {
      setIsScheduleCallSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateScheduleCallData = (field: string, value: string) => {
    setScheduleCallData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Premium floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-20 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-accent/10 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '6s' }}></div>
      </div>
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-primary text-primary-foreground relative overflow-hidden z-10">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Get in Touch with Our Experts
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Ready to transform your Amazon book business? Our team of publishing and review experts is here to help you succeed.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="glass-card shadow-strong border-primary/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Send className="w-6 h-6 text-primary" />
                Send Us a Message
              </CardTitle>
              <CardDescription>
                Fill out the form below and we'll respond within 12 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Your Name *</label>
                    <Input
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email Address *</label>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject *</label>
                  <Input
                    placeholder="What can we help you with?"
                    value={formData.subject}
                    onChange={(e) => updateFormData("subject", e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Message *</label>
                  <Textarea
                    placeholder="Tell us about your project, questions, or how we can help you..."
                    value={formData.message}
                    onChange={(e) => updateFormData("message", e.target.value)}
                    rows={6}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full text-lg py-6" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Quick Contact */}
            <Card className="glass-card shadow-strong border-primary/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Phone className="w-6 h-6 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg">
                  <Phone className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Phone Support</h4>
                    <p className="text-lg font-medium text-primary">+1 (678) 831-5443</p>
                    <p className="text-sm text-muted-foreground">Available during business hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg">
                  <Mail className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Email Support</h4>
                    <p className="text-lg font-medium text-primary">Support@reviewpromax.com</p>
                    <p className="text-sm text-muted-foreground">Response within 12 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg">
                  <Clock className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Business Hours</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Monday - Friday:</span> 9:00 AM - 6:00 PM EST</p>
                      <p><span className="font-medium">Saturday:</span> 10:00 AM - 4:00 PM EST</p>
                      <p><span className="font-medium">Sunday:</span> Closed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Support Options */}
            <Card className="glass-card shadow-strong border-primary/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Headphones className="w-6 h-6 text-primary" />
                  Instant Support
                </CardTitle>
                <CardDescription>
                  Need immediate help? Try our live support options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full justify-start gap-3 h-14" 
                  variant="outline"
                  onClick={() => {
                    if (user && hasPurchases) {
                      setIsLiveChatOpen(true);
                    }
                  }}
                  disabled={!user || !hasPurchases}
                >
                  <MessageCircle className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Live Chat</div>
                    <div className="text-sm text-muted-foreground">
                      {user && hasPurchases ? "Chat with our support team" : "Purchase required"}
                    </div>
                  </div>
                  {user && hasPurchases ? (
                    <Badge className="ml-auto bg-green-500">Online</Badge>
                  ) : (
                    <Lock className="w-4 h-4 ml-auto text-muted-foreground" />
                  )}
                </Button>

                <Button 
                  className="w-full justify-start gap-3 h-14" 
                  variant="outline"
                  onClick={() => {
                    if (user && hasPurchases) {
                      setIsAIChatOpen(true);
                    }
                  }}
                  disabled={!user || !hasPurchases}
                >
                  <MessageSquare className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">AI Chat Support</div>
                    <div className="text-sm text-muted-foreground">
                      {user && hasPurchases ? "Get instant answers 24/7" : "Purchase required"}
                    </div>
                  </div>
                  {user && hasPurchases ? (
                    <Badge className="ml-auto bg-green-500">Online</Badge>
                  ) : (
                    <Lock className="w-4 h-4 ml-auto text-muted-foreground" />
                  )}
                </Button>

                <Button 
                  className="w-full justify-start gap-3 h-14" 
                  variant="outline"
                  onClick={() => setIsScheduleCallOpen(true)}
                >
                  <Calendar className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Schedule a Call</div>
                    <div className="text-sm text-muted-foreground">Book a consultation</div>
                  </div>
                </Button>
                
                {/* Purchase Requirement Alert */}
                {(!user || !hasPurchases) && !purchasesLoading && (
                  <Alert className="border-primary/20 bg-primary/5">
                    <ShoppingCart className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      <strong>Live Chat & AI Support</strong> are available exclusively for customers who have purchased any review plan.
                      <Button asChild variant="link" className="p-0 h-auto ml-1">
                        <a href="/pricing">View Plans →</a>
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Why Choose Us */}
            <Card className="glass-card shadow-strong border-primary/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Star className="w-6 h-6 text-primary" />
                  Why Authors Choose Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Expert team specializing in Amazon publishing",
                    "Proven track record of successful book launches",
                    "Professional review services that boost rankings",
                    "Personalized support throughout your journey",
                    "Fast response times and dedicated account management"
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <Card className="glass-card shadow-strong border-primary/20 backdrop-blur-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Frequently Asked Questions</CardTitle>
              <CardDescription>
                Quick answers to common questions about our services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">How quickly do you respond to inquiries?</h4>
                    <p className="text-sm text-muted-foreground">
                      We guarantee a response within 12 hours during business days, often much sooner.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">What types of books do you work with?</h4>
                    <p className="text-sm text-muted-foreground">
                      We work with all genres of books on Amazon, from fiction to non-fiction, self-help, business, and more.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Do you offer free consultations?</h4>
                    <p className="text-sm text-muted-foreground">
                      Yes! We offer free strategy calls to discuss your book and how we can help you succeed on Amazon.
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Are your review services compliant with Amazon's terms?</h4>
                    <p className="text-sm text-muted-foreground">
                      Absolutely. We follow all Amazon guidelines and provide only legitimate, authentic reviews.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">How long does it take to see results?</h4>
                    <p className="text-sm text-muted-foreground">
                      Most clients start seeing improvements in their book's visibility and sales within 2-4 weeks.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Do you work with international authors?</h4>
                    <p className="text-sm text-muted-foreground">
                      Yes, we work with authors worldwide who publish on Amazon's various marketplaces.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Schedule Call Modal */}
      <Dialog open={isScheduleCallOpen} onOpenChange={setIsScheduleCallOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Schedule a Call
            </DialogTitle>
            <DialogDescription>
              Fill out your details and we'll contact you within 24 hours to schedule your consultation.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleScheduleCall} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Your Name *</label>
              <Input
                placeholder="Enter your full name"
                value={scheduleCallData.name}
                onChange={(e) => updateScheduleCallData("name", e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Email Address *</label>
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={scheduleCallData.email}
                onChange={(e) => updateScheduleCallData("email", e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Phone Number *</label>
              <Input
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={scheduleCallData.phone}
                onChange={(e) => updateScheduleCallData("phone", e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Tell us about your project (optional)</label>
              <Textarea
                placeholder="Brief description of your book or what you'd like to discuss..."
                value={scheduleCallData.message}
                onChange={(e) => updateScheduleCallData("message", e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsScheduleCallOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isScheduleCallSubmitting}
                className="flex-1"
              >
                {isScheduleCallSubmitting ? "Scheduling..." : "Schedule Call"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Live Chat Components */}
      <TawkToChat 
        isVisible={isLiveChatOpen} 
        onClose={() => setIsLiveChatOpen(false)} 
      />
      <AIChatbot 
        isOpen={isAIChatOpen} 
        onClose={() => setIsAIChatOpen(false)} 
      />
    </div>
  );
}