import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, Shield, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link to="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-foreground mb-4">Service Delivery Policy</h1>
            <p className="text-muted-foreground">Understanding how our digital services work for authors</p>
          </div>

          <div className="space-y-6">
            {/* Important Notice */}
            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <Shield className="w-5 h-5" />
                  Important Notice
                </CardTitle>
              </CardHeader>
              <CardContent className="text-amber-800">
                <p className="font-medium">
                  This is a digital service - all our review services are delivered electronically. 
                  No physical products will be shipped. All sales are final and non-refundable once service delivery begins.
                </p>
              </CardContent>
            </Card>

            {/* How Our Service Works */}
            <Card>
              <CardHeader>
                <CardTitle>How Our Review Service Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-foreground">
                <section>
                  <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    Service Overview
                  </h2>
                  <p className="text-muted-foreground mb-3">
                    ReviewProMax provides professional book review services designed exclusively for authors. 
                    Our digital platform connects your book with qualified readers who provide authentic, 
                    detailed reviews to help enhance your Amazon presence.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Service Delivery Timeline
                  </h2>
                  <div className="space-y-3 text-muted-foreground">
                    <div className="bg-secondary/20 p-4 rounded-lg">
                      <h3 className="font-medium text-foreground mb-2">Step 1: Order Processing (24-48 hours)</h3>
                      <p>Your order is reviewed and assigned to our team of professional readers.</p>
                    </div>
                    <div className="bg-secondary/20 p-4 rounded-lg">
                      <h3 className="font-medium text-foreground mb-2">Step 2: Reader Assignment (2-3 days)</h3>
                      <p>Qualified readers are matched to your book based on genre and preferences.</p>
                    </div>
                    <div className="bg-secondary/20 p-4 rounded-lg">
                      <h3 className="font-medium text-foreground mb-2">Step 3: Review Creation (7-14 days)</h3>
                      <p>Readers engage with your content and craft thoughtful, authentic reviews.</p>
                    </div>
                    <div className="bg-secondary/20 p-4 rounded-lg">
                      <h3 className="font-medium text-foreground mb-2">Step 4: Quality Review (1-2 days)</h3>
                      <p>Our team ensures all reviews meet our quality standards and Amazon's guidelines.</p>
                    </div>
                    <div className="bg-secondary/20 p-4 rounded-lg">
                      <h3 className="font-medium text-foreground mb-2">Step 5: Delivery (1 day)</h3>
                      <p>Reviews are published and you receive confirmation via email and dashboard notification.</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">Digital Service Features</h2>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Real-time progress tracking through your author dashboard</li>
                    <li>Email notifications at each stage of the review process</li>
                    <li>Direct communication with our support team</li>
                    <li>Quality assurance checks before review publication</li>
                    <li>Compliance with Amazon's terms of service</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">What You Receive</h2>
                  <p className="text-muted-foreground mb-3">
                    Upon completion of your order, you will receive:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Professional reviews published directly on Amazon</li>
                    <li>Detailed review analytics and performance metrics</li>
                    <li>Follow-up recommendations for continued success</li>
                    <li>Access to ongoing support and consultation</li>
                  </ul>
                </section>

                <section className="bg-red-50/50 border border-red-200 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-3 text-red-800">Non-Refundable Digital Service</h2>
                  <p className="text-red-700">
                    <strong>Important:</strong> Due to the digital nature of our services and the immediate value provided, 
                    all review services are non-refundable once the review process has begun. This policy ensures 
                    the integrity of our review system and protects both authors and readers in our community.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">Support & Communication</h2>
                  <p className="text-muted-foreground mb-3">
                    Our dedicated support team is available to assist you throughout the entire process:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Email support: Support@reviewpromax.com</li>
                    <li>Phone support: +1 (678) 831-5443</li>
                    <li>Response time: Within 12 hours during business days</li>
                    <li>Dashboard messaging system for real-time updates</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">Questions or Concerns?</h2>
                  <p className="text-muted-foreground">
                    If you have any questions about our service delivery process or need clarification on any aspect 
                    of our digital services, please don't hesitate to contact our support team. We're here to ensure 
                    your experience with ReviewProMax exceeds your expectations.
                  </p>
                </section>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;