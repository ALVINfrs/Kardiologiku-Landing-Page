import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import TentangAritmiaSection from "@/components/landing/TentangAritmiaSection";
import DokterKamiSection from "./components/landing/DokterKamiSection";
import ObatTerapiSection from "./components/landing/ObatTerapiSection";
import FiturSection from "./components/landing/FiturSection";
import TestimoniSection from "./components/landing/TestimoniSection";
import Faq from "./components/landing/Faq";
import KontakFooterSection from "./components/landing/KontakFooterSection";
import AritmiaComandCenter from "./components/landing/AritmiaCommandCenter";
import WebAppShowcaseSection from "./components/landing/WebAppShowcaseSection";
import PengingatObatSection from "./components/landing/PengingatObatSection";
import InteractiveEducationSection from "./components/landing/InteractiveEducationSection";

const KardiologikuLandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <TentangAritmiaSection />
        <InteractiveEducationSection />
        <AritmiaComandCenter />
        <DokterKamiSection />
        <ObatTerapiSection />
        <FiturSection />
        <PengingatObatSection />
        <WebAppShowcaseSection />
        <TestimoniSection />
        <Faq />
        <KontakFooterSection />
      </main>
    </div>
  );
};

export default KardiologikuLandingPage;
