import { Hero } from "@/components/Hero";
import { ReaderCommunity } from "@/components/ReaderCommunity";
import { AuthorJourney } from "@/components/AuthorJourney";
import { Pricing } from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { FloatingHelp } from "@/components/FloatingHelp";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <ReaderCommunity />
      <AuthorJourney />
      <div id="pricing">
        <Pricing />
      </div>
      <Testimonials />
      <div id="contact">
        <Contact />
      </div>
      <Footer />
      <FloatingHelp />
    </div>
  );
};

export default Index;
