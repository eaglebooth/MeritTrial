import HeroSection from "@/components/sections/HeroSection";
import LiveContractStats from "@/components/sections/LiveContractStats";
import StatsSection from "@/components/sections/StatsSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import UseCasesSection from "@/components/sections/UseCasesSection";
import TechSection from "@/components/sections/TechSection";
import ComparisonSection from "@/components/sections/ComparisonSection";
import BiasSection from "@/components/sections/BiasSection";
import ContractFlowSection from "@/components/sections/ContractFlowSection";
import CTASection from "@/components/sections/CTASection";
import FAQSection from "@/components/sections/FAQSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <LiveContractStats />
      <StatsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <UseCasesSection />
      <TechSection />
      <ComparisonSection />
      <BiasSection />
      <ContractFlowSection />
      <CTASection />
      <FAQSection />
    </>
  );
}
