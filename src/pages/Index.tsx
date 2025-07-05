import { Hero } from "@/components/Hero";
import { ReaderCommunity } from "@/components/ReaderCommunity";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { Pricing } from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <ReaderCommunity />
      <ProcessTimeline />
      <Pricing />
      <Testimonials />
      <Contact />
    </div>
  );
};

export default Index;
