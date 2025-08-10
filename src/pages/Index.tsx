import { Hero } from "@/components/Hero";
import { lazy, Suspense } from "react";

const ReaderCommunity = lazy(() => import("@/components/ReaderCommunity").then(m => ({ default: m.ReaderCommunity })));
const AuthorJourney = lazy(() => import("@/components/AuthorJourney").then(m => ({ default: m.AuthorJourney })));
const Pricing = lazy(() => import("@/components/Pricing").then(m => ({ default: m.Pricing })));
const AffiliateSection = lazy(() => import("@/components/AffiliateSection").then(m => ({ default: m.AffiliateSection })));
const Testimonials = lazy(() => import("@/components/Testimonials").then(m => ({ default: m.Testimonials })));
const Contact = lazy(() => import("@/components/Contact").then(m => ({ default: m.Contact })));
const Footer = lazy(() => import("@/components/Footer").then(m => ({ default: m.Footer })));
const FloatingHelp = lazy(() => import("@/components/FloatingHelp").then(m => ({ default: m.FloatingHelp })));

const Index = () => {
  return (
    <main className="min-h-screen" role="main">
      <Hero />
      <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center text-muted-foreground" aria-busy="true">Loading…</div>}>
        <ReaderCommunity />
        <AuthorJourney />
        <div id="pricing">
          <Pricing />
        </div>
        <AffiliateSection />
        <Testimonials />
        <div id="contact">
          <Contact />
        </div>
        <Footer />
        <FloatingHelp />
      </Suspense>
    </main>
  );
};

export default Index;
