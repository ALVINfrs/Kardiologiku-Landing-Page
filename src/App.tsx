import { useState, useEffect } from "react";
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
import FoodJournalSection from "./components/landing/FoodJournalSection";
import HeartRiskCalculator from "./components/landing/HeartRiskCalculator";
import LoadingScreen from "./components/LoadingScreen";
import AritmiaMythBuster from "./components/landing/AritmiaMythBuster";
import ArrhythmiaClinicalCommand from "./components/landing/ArhytmiaClinicalComand";
import LifestyleImpactSimulator from "./components/landing/LifestyleImpactSimulator";
import PersonalizedActionPlanner from "./components/landing/PersonalizedActionPlanner";
import ECG12LeadSimulatorSuite from "./components/landing/ECG12LeadSimulatorSuite";

const KardiologikuLandingPage = () => {
  const [isLoading, setIsLoading] = useState(true); // <-- TAMBAHKAN STATE LOADING

  useEffect(() => {
    // Simulasikan waktu loading, misalnya 3.5 detik
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    // Cleanup timer jika komponen di-unmount
    return () => clearTimeout(timer);
  }, []); // <-- [] berarti useEffect hanya berjalan sekali saat komponen dimuat

  // Tampilkan LoadingScreen jika isLoading true
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <TentangAritmiaSection />
        <ECG12LeadSimulatorSuite />
        <ArrhythmiaClinicalCommand />
        <LifestyleImpactSimulator />
        <PersonalizedActionPlanner />
        <InteractiveEducationSection />
        <AritmiaComandCenter />
        <FoodJournalSection />
        <HeartRiskCalculator />
        <DokterKamiSection />
        <ObatTerapiSection />
        <FiturSection />
        <AritmiaMythBuster />
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
