import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, Mail, Phone, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessType: "",
    monthlyRevenue: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('customers')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            business_type: formData.businessType,
            monthly_revenue: formData.monthlyRevenue,
            message: formData.message,
            lead_source: 'website_footer_contact',
            status: 'new'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Strategy Call Request Submitted!",
        description: "Thank you for your interest! Our Amazon experts will contact you within 12 hours to schedule your free consultation.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        businessType: "",
        monthlyRevenue: "",
        message: ""
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again or contact us directly.",
        variant: "destructive"
      });
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="py-24 bg-gradient-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 text-primary-foreground">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Dominate Amazon?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Get a free strategy call with our Amazon experts and discover exactly how to scale your business with professional book reviews and publishing services.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <Card className="shadow-strong bg-background/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                  <CalendarDays className="w-6 h-6 text-primary" />
                  Book Your Free Strategy Call
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Your Name *"
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                      required
                    />
                    <Input
                      type="email"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      required
                    />
                  </div>
                  
                  <Input
                    type="tel"
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    required
                  />
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <Select onValueChange={(value) => updateFormData("businessType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Business Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new-seller">New to Amazon</SelectItem>
                        <SelectItem value="existing-seller">Existing Seller</SelectItem>
                        <SelectItem value="brand-owner">Brand Owner</SelectItem>
                        <SelectItem value="agency">Agency</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select onValueChange={(value) => updateFormData("monthlyRevenue", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Monthly Revenue" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-5k">$0 - $5K</SelectItem>
                        <SelectItem value="5k-20k">$5K - $20K</SelectItem>
                        <SelectItem value="20k-50k">$20K - $50K</SelectItem>
                        <SelectItem value="50k-100k">$50K - $100K</SelectItem>
                        <SelectItem value="100k+">$100K+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Textarea
                    placeholder="Tell us about your current challenges and goals..."
                    value={formData.message}
                    onChange={(e) => updateFormData("message", e.target.value)}
                    rows={4}
                  />
                  
                  <Button type="submit" variant="hero" size="lg" className="w-full text-lg py-6">
                    Get My Free Strategy Call
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    No spam, ever. We respect your privacy and will only contact you about your Amazon business.
                  </p>
                </form>
              </CardContent>
            </Card>
            
            {/* Contact Info & Benefits */}
            <div className="space-y-8 text-primary-foreground">
              {/* What You'll Get */}
              <div>
                <h3 className="text-2xl font-bold mb-6">What You'll Get in Your Strategy Call:</h3>
                <ul className="space-y-4">
                  {[
                    "Complete Amazon business audit and opportunity analysis",
                    "Custom strategy roadmap for your specific products",
                    "Competitive analysis and market positioning insights",
                    "Review and optimization recommendations",
                    "Clear next steps to accelerate your growth"
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                      <span className="opacity-90">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Direct Contact */}
              <div className="bg-background/10 backdrop-blur-sm rounded-lg p-6 border border-primary-foreground/20">
                <h4 className="text-xl font-semibold mb-4">Need Immediate Assistance?</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-accent" />
                    <span>+1 (678) 831-5443</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-accent" />
                    <span>Support@reviewpromax.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-accent" />
                    <span>Response within 12 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};