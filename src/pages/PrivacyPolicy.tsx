import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Eye, Lock, Database } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
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
            <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">
              How we collect, use, and protect your personal information
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-6">
            {/* Privacy Commitment */}
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Shield className="w-5 h-5" />
                  Our Privacy Commitment
                </CardTitle>
              </CardHeader>
              <CardContent className="text-blue-800">
                <p>
                  At ReviewProMax, we take your privacy seriously. This policy explains how we collect, 
                  use, and protect your personal information when you use our professional book review services.
                </p>
              </CardContent>
            </Card>

            {/* Information Collection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-foreground">
                <section>
                  <h2 className="text-xl font-semibold mb-3">Personal Information</h2>
                  <p className="text-muted-foreground mb-3">
                    We collect information you provide directly to us when you:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Create an account or register for our services</li>
                    <li>Submit contact forms or request consultations</li>
                    <li>Upload books for review services</li>
                    <li>Communicate with our support team</li>
                    <li>Subscribe to newsletters or marketing communications</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">Types of Data Collected</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-secondary/20 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Contact Information</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Full name</li>
                        <li>• Email address</li>
                        <li>• Phone number</li>
                        <li>• Business information</li>
                      </ul>
                    </div>
                    <div className="bg-secondary/20 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Book Information</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Book titles and descriptions</li>
                        <li>• Author information</li>
                        <li>• Genre and category data</li>
                        <li>• Manuscript files</li>
                      </ul>
                    </div>
                    <div className="bg-secondary/20 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Payment Information</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Billing address</li>
                        <li>• Payment method details</li>
                        <li>• Transaction history</li>
                        <li>• Invoice information</li>
                      </ul>
                    </div>
                    <div className="bg-secondary/20 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Usage Data</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Platform activity</li>
                        <li>• Service preferences</li>
                        <li>• Communication logs</li>
                        <li>• Support interactions</li>
                      </ul>
                    </div>
                  </div>
                </section>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground">
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="font-medium mb-1">Service Delivery</h3>
                    <p className="text-muted-foreground text-sm">
                      Process your orders, deliver review services, and manage your account
                    </p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="font-medium mb-1">Communication</h3>
                    <p className="text-muted-foreground text-sm">
                      Send order updates, respond to inquiries, and provide customer support
                    </p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="font-medium mb-1">Payment Processing</h3>
                    <p className="text-muted-foreground text-sm">
                      Process payments securely through our trusted payment partners
                    </p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="font-medium mb-1">Service Improvement</h3>
                    <p className="text-muted-foreground text-sm">
                      Analyze usage patterns to enhance our platform and services
                    </p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="font-medium mb-1">Marketing (Optional)</h3>
                    <p className="text-muted-foreground text-sm">
                      Send newsletters and promotional content (with your consent)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Data Security & Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground">
                <section>
                  <h2 className="text-lg font-semibold mb-3">Security Measures</h2>
                  <p className="text-muted-foreground mb-3">
                    We implement industry-standard security measures to protect your personal information:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>SSL encryption for all data transmission</li>
                    <li>Secure cloud storage with encrypted databases</li>
                    <li>Regular security audits and updates</li>
                    <li>Access controls and employee training</li>
                    <li>Payment processing through PCI-compliant providers</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-3">Data Retention</h2>
                  <p className="text-muted-foreground">
                    We retain your personal information only as long as necessary to provide our services 
                    and fulfill legal obligations. Account data is typically retained for 7 years after 
                    account closure for business and legal purposes.
                  </p>
                </section>
              </CardContent>
            </Card>

            {/* Information Sharing */}
            <Card>
              <CardHeader>
                <CardTitle>Information Sharing & Disclosure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground">
                <section>
                  <h2 className="text-lg font-semibold mb-3">We DO NOT Sell Your Data</h2>
                  <p className="text-muted-foreground mb-3">
                    ReviewProMax does not sell, rent, or trade your personal information to third parties for marketing purposes.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-3">Limited Sharing Scenarios</h2>
                  <p className="text-muted-foreground mb-3">
                    We may share your information only in these specific circumstances:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>With qualified readers (book content only, no personal details)</li>
                    <li>With payment processors for transaction processing</li>
                    <li>With service providers who assist in platform operations</li>
                    <li>When required by law or legal process</li>
                    <li>To protect our rights, property, or safety</li>
                  </ul>
                </section>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card>
              <CardHeader>
                <CardTitle>Your Rights & Choices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Access & Correction</h3>
                    <p className="text-sm text-muted-foreground">
                      View and update your personal information through your account dashboard
                    </p>
                  </div>
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Data Export</h3>
                    <p className="text-sm text-muted-foreground">
                      Request a copy of your personal data in a portable format
                    </p>
                  </div>
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Marketing Opt-out</h3>
                    <p className="text-sm text-muted-foreground">
                      Unsubscribe from marketing emails at any time
                    </p>
                  </div>
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Account Deletion</h3>
                    <p className="text-sm text-muted-foreground">
                      Request deletion of your account and associated data
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cookies & Tracking */}
            <Card>
              <CardHeader>
                <CardTitle>Cookies & Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground">
                <section>
                  <h2 className="text-lg font-semibold mb-3">Cookie Usage</h2>
                  <p className="text-muted-foreground mb-3">
                    We use cookies and similar technologies to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Remember your login status and preferences</li>
                    <li>Analyze website traffic and user behavior</li>
                    <li>Improve platform functionality and user experience</li>
                    <li>Provide relevant content and recommendations</li>
                  </ul>
                  <p className="text-muted-foreground mt-3">
                    You can control cookie settings through your browser preferences, though some features 
                    may not function properly with cookies disabled.
                  </p>
                </section>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Privacy Questions & Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground">
                <section>
                  <h2 className="text-lg font-semibold mb-3">Contact Our Privacy Team</h2>
                  <p className="text-muted-foreground mb-4">
                    If you have questions about this privacy policy or how we handle your personal information:
                  </p>
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <p className="font-medium mb-2">Email: Support@reviewpromax.com</p>
                    <p className="font-medium mb-2">Phone: +1 (678) 831-5443</p>
                    <p className="text-muted-foreground text-sm">
                      We respond to all privacy inquiries within 48 hours
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-3">Policy Updates</h2>
                  <p className="text-muted-foreground">
                    We may update this privacy policy periodically to reflect changes in our practices 
                    or legal requirements. We will notify you of significant changes via email or through 
                    our platform. Your continued use of our services after policy updates constitutes 
                    acceptance of the revised terms.
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

export default PrivacyPolicy;