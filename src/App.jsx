import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import LeadLeakCalculator from "./components/LeadLeakCalculator";
import FeaturesSection from "./components/FeaturesSection";
import SyncVisualSection from "./components/SyncVisualSection";
import HowItWorksSection from "./components/HowItWorksSection";
import BetaSection from "./components/BetaSection";
import PricingSection from "./components/PricingSection";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <LeadLeakCalculator />
        <FeaturesSection />
        <SyncVisualSection />
        <HowItWorksSection />
        <BetaSection />
        <PricingSection />
      </main>
      <Footer />
    </>
  );
}

export default App;
