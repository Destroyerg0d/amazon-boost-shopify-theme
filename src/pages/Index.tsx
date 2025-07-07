import { Hero } from "@/components/Hero";
import { ReaderCommunity } from "@/components/ReaderCommunity";
import { AuthorJourney } from "@/components/AuthorJourney";
import { Pricing } from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <ReaderCommunity />
      <AuthorJourney />
      <Pricing />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
