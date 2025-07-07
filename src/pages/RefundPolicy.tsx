import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const RefundPolicy = () => {
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
            <h1 className="text-4xl font-bold text-foreground mb-4">Cancellation & Refund Policy</h1>
            <p className="text-muted-foreground">Understanding our refund terms and when cancellations are possible</p>
          </div>

          <div className="space-y-6">
            {/* Important Notice */}
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="w-5 h-5" />
                  Important Policy Notice
                </CardTitle>
              </CardHeader>
              <CardContent className="text-red-800">
                <p className="font-medium">
                  Due to the immediate and digital nature of our professional review services, 
                  refunds are strictly limited and subject to specific conditions outlined below.
                </p>
              </CardContent>
            </Card>

            {/* Refund Eligibility */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Refundable Scenarios */}
              <Card className="border-green-200 bg-green-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    Refundable Scenarios
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-green-700">
                  <div className="bg-green-100/50 p-3 rounded-md">
                    <h3 className="font-medium mb-1">Order Status: Pending</h3>
                    <p className="text-sm">Full refund available if service has not yet begun</p>
                  </div>
                  <div className="bg-green-100/50 p-3 rounded-md">
                    <h3 className="font-medium mb-1">Technical Issues</h3>
                    <p className="text-sm">Platform errors preventing service delivery</p>
                  </div>
                  <div className="bg-green-100/50 p-3 rounded-md">
                    <h3 className="font-medium mb-1">Service Unavailability</h3>
                    <p className="text-sm">If we cannot fulfill your specific requirements</p>
                  </div>
                </CardContent>
              </Card>

              {/* Non-Refundable Scenarios */}
              <Card className="border-red-200 bg-red-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-800">
                    <XCircle className="w-5 h-5" />
                    Non-Refundable Scenarios
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-red-700">
                  <div className="bg-red-100/50 p-3 rounded-md">
                    <h3 className="font-medium mb-1">Service In Progress</h3>
                    <p className="text-sm">Once review process has begun</p>
                  </div>
                  <div className="bg-red-100/50 p-3 rounded-md">
                    <h3 className="font-medium mb-1">Service Completed</h3>
                    <p className="text-sm">Reviews have been delivered and published</p>
                  </div>
                  <div className="bg-red-100/50 p-3 rounded-md">
                    <h3 className="font-medium mb-1">Change of Mind</h3>
                    <p className="text-sm">Personal decisions after service initiation</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Policy */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Refund Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-foreground">
                <section>
                  <h2 className="text-xl font-semibold mb-3">When Refunds Are Available</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <div className="border-l-4 border-green-500 pl-4">
                      <h3 className="font-medium text-foreground mb-1">Pending Orders (Full Refund)</h3>
                      <p>
                        If your order status shows "Pending" and our team has not yet begun the review assignment 
                        process, you are eligible for a complete refund. This typically applies within the first 
                        24-48 hours after order placement.
                      </p>
                    </div>
                    <div className="border-l-4 border-amber-500 pl-4">
                      <h3 className="font-medium text-foreground mb-1">Service Issues (Partial/Full Refund)</h3>
                      <p>
                        If we encounter technical difficulties, cannot match qualified readers to your book, 
                        or fail to deliver the agreed-upon service quality, we will offer appropriate compensation 
                        or refund based on the specific circumstances.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">When Refunds Are NOT Available</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <div className="border-l-4 border-red-500 pl-4">
                      <h3 className="font-medium text-foreground mb-1">Service In Progress</h3>
                      <p>
                        Once our team begins working on your order (readers assigned, review process initiated), 
                        the service is considered delivered and no refunds are available. This ensures fair 
                        compensation for our professional readers and team members.
                      </p>
                    </div>
                    <div className="border-l-4 border-red-500 pl-4">
                      <h3 className="font-medium text-foreground mb-1">Completed Services</h3>
                      <p>
                        After reviews have been written, quality-checked, and published on Amazon, 
                        the service is fully complete. No refunds are available as the digital product 
                        has been delivered in full.
                      </p>
                    </div>
                    <div className="border-l-4 border-red-500 pl-4">
                      <h3 className="font-medium text-foreground mb-1">Dissatisfaction with Review Content</h3>
                      <p>
                        Reviews reflect genuine reader opinions and experiences. While we ensure quality 
                        and professionalism, we cannot guarantee specific ratings or review content, 
                        as this would compromise authenticity.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">How to Request a Refund</h2>
                  <p className="text-muted-foreground mb-4">
                    If you believe your situation qualifies for a refund according to this policy, 
                    please contact our support team immediately:
                  </p>
                  <div className="bg-secondary/20 p-6 rounded-lg space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Email Support</p>
                        <p className="text-muted-foreground">Support@reviewpromax.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Phone Support</p>
                        <p className="text-muted-foreground">+1 (678) 831-5443</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">Required Information for Refund Requests</h2>
                  <p className="text-muted-foreground mb-3">
                    To process your refund request efficiently, please provide:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Your order number and account email</li>
                    <li>Detailed explanation of why you're requesting a refund</li>
                    <li>Screenshots or documentation supporting your request</li>
                    <li>Preferred refund method (original payment method recommended)</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">Refund Processing Timeline</h2>
                  <div className="space-y-3 text-muted-foreground">
                    <div className="flex justify-between items-center p-3 bg-secondary/20 rounded-md">
                      <span>Review of refund request</span>
                      <span className="font-medium text-foreground">2-3 business days</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-secondary/20 rounded-md">
                      <span>Refund processing (if approved)</span>
                      <span className="font-medium text-foreground">3-5 business days</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-secondary/20 rounded-md">
                      <span>Bank/card processing time</span>
                      <span className="font-medium text-foreground">2-7 business days</span>
                    </div>
                  </div>
                </section>

                <section className="bg-blue-50/50 border border-blue-200 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-3 text-blue-800">Customer Satisfaction Commitment</h2>
                  <p className="text-blue-700">
                    While our refund policy is strict due to the nature of our digital services, 
                    we are committed to customer satisfaction. If you have concerns about your experience, 
                    please reach out to us. We're always willing to discuss solutions and may offer 
                    service credits, additional reviews, or other accommodations on a case-by-case basis.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">Contact Our Support Team</h2>
                  <p className="text-muted-foreground">
                    Our dedicated support team is here to help with any questions or concerns about 
                    our refund policy. We respond to all inquiries within 12 hours during business days 
                    and are committed to resolving any issues promptly and fairly.
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

export default RefundPolicy;