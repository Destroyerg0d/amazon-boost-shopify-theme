import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const TermsOfService = () => {
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
            <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Welcome to ReviewProMax</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-foreground">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing and using ReviewProMax services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Service Description</h2>
                <p className="text-muted-foreground mb-3">
                  ReviewProMax provides professional book review services for authors looking to enhance their Amazon presence. Our services include:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Professional book reviews from verified readers</li>
                  <li>Amazon optimization consulting</li>
                  <li>Review strategy planning and implementation</li>
                  <li>Author consultation services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. User Responsibilities</h2>
                <p className="text-muted-foreground mb-3">
                  As a user of our services, you agree to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Provide accurate and complete information about your book</li>
                  <li>Ensure your content complies with Amazon's terms of service</li>
                  <li>Use our services in good faith and for legitimate purposes</li>
                  <li>Not attempt to manipulate or abuse our review system</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Quality Standards</h2>
                <p className="text-muted-foreground">
                  We maintain high standards for all reviews provided through our platform. All reviews are written by real readers who have genuinely engaged with your content. We do not provide fake, misleading, or incentivized reviews that violate Amazon's policies.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Payment Terms</h2>
                <p className="text-muted-foreground">
                  Payment is required before service delivery. All prices are listed in USD and include applicable fees. We use secure payment processing through Razorpay to ensure your financial information is protected.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Intellectual Property</h2>
                <p className="text-muted-foreground">
                  You retain all rights to your book content. ReviewProMax retains rights to our proprietary review methodologies and platform technology. Reviews generated through our service become part of the public domain once published.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  ReviewProMax shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Termination</h2>
                <p className="text-muted-foreground">
                  Either party may terminate this agreement at any time. Upon termination, you will receive any services already paid for, but no refunds will be provided for services not yet delivered unless covered by our refund policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">9. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We reserve the right to modify these terms at any time. Changes will be posted on this page, and your continued use of our services constitutes acceptance of the modified terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">10. Contact Information</h2>
                <p className="text-muted-foreground">
                  If you have any questions about these Terms of Service, please contact us at Support@reviewpromax.com or call +1 (678) 831-5443.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;