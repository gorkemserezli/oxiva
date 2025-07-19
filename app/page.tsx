'use client'

import { useEffect } from 'react'
import HeroSection from '@/components/sections/HeroSection'
import TrustBar from '@/components/sections/TrustBar'
import FeaturesSection from '@/components/sections/FeaturesSection'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import ComparisonSection from '@/components/sections/ComparisonSection'
import FAQSection from '@/components/sections/FAQSection'
import CTASection from '@/components/sections/CTASection'

export default function Home() {
  useEffect(() => {
    // URL'de hash varsa ilgili section'a scroll et
    if (window.location.hash) {
      setTimeout(() => {
        const id = window.location.hash.substring(1)
        const element = document.getElementById(id)
        if (element) {
          const offset = 140 // Header height offset
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - offset
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      }, 100) // Sayfanın yüklenmesini bekle
    }
  }, [])

  return (
    <>
      <HeroSection />
      <TrustBar />
      <FeaturesSection />
      <ComparisonSection />
      <HowItWorksSection />
      <FAQSection />
      <CTASection />
    </>
  )
}