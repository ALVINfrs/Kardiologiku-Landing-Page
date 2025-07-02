import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import TentangAritmiaSection from "@/components/landing/TentangAritmiaSection";
import DokterKamiSection from "./components/landing/DokterKamiSection";
import ObatTerapiSection from "./components/landing/ObatTerapiSection";
import FiturSection from "./components/landing/FiturSection";
import TestimoniSection from "./components/landing/TestimoniSection";
import KontakFooterSection from "./components/landing/KontakFooterSection";
const KardiologikuLandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <TentangAritmiaSection />
        <DokterKamiSection />
        <ObatTerapiSection />
        <FiturSection />
        <TestimoniSection />
        <KontakFooterSection />
      </main>
    </div>
  );
};

export default KardiologikuLandingPage;
