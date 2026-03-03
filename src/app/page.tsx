import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import OrganizationSection from "@/components/OrganizationSection";
import VisionSection from "@/components/VisionSection";
import ContactMapSection from "@/components/ContactMapSection";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <Navbar />

      <main>
        <HeroSlider />
        <VisionSection />
        <OrganizationSection />
        <ContactMapSection />
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
}
