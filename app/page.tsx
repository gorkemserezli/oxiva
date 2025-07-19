import HeroSection from '@/components/sections/HeroSection'
import TrustBar from '@/components/sections/TrustBar'
import FeaturesSection from '@/components/sections/FeaturesSection'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import ComparisonSection from '@/components/sections/ComparisonSection'
import FAQSection from '@/components/sections/FAQSection'
import CTASection from '@/components/sections/CTASection'

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <FeaturesSection />
      <HowItWorksSection />
      <ComparisonSection />
      <FAQSection />
      <CTASection />
    </>
  )
}