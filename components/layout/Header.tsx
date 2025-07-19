'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, Phone } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const element = document.querySelector(href)
      if (element) {
        const offset = 100 // Header height offset
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - offset
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
      setIsMenuOpen(false)
    }
  }

  return (
    <>
      {/* Main Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300`}>
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm border-b border-primary-700/20">
          <div className="container-max section-padding py-2.5">
            <div className="flex items-center justify-between">
              <div className="hidden lg:flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white/90">Ücretsiz Kargo</span>
                </div>
                <div className="w-px h-4 bg-white/20"></div>
                <span className="text-white/90">Aynı Gün Kargo</span>
                <div className="w-px h-4 bg-white/20"></div>
                <span className="text-white/90">%100 Güvenli Alışveriş</span>
              </div>
              
              <div className="flex-1 lg:flex-none text-center">
                <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1 rounded-full backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400"></span>
                  </span>
                  <span className="font-semibold">%20 İNDİRİM</span>
                  <span className="text-white/80 text-xs">Sınırlı Süre</span>
                </div>
              </div>
              
              <div className="hidden lg:flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-white/80" />
                <span className="text-white/90">0850 XXX XX XX</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className={`bg-white transition-all duration-300 ${
          isScrolled ? 'shadow-lg' : 'shadow-sm'
        }`}>
        <div className="container-max section-padding">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.png"
                alt="Oxiva Logo"
                width={140}
                height={46}
                className="h-12 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-10">
              <Link 
                href="/" 
                className="relative text-gray-700 hover:text-primary-500 transition-colors font-medium group"
              >
                Ana Sayfa
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full"></span>
              </Link>
              <Link 
                href="/product" 
                className="relative text-gray-700 hover:text-primary-500 transition-colors font-medium group"
              >
                Ürün Detayı
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full"></span>
              </Link>
              <Link 
                href="#benefits" 
                onClick={(e) => scrollToSection(e, '#benefits')}
                className="relative text-gray-700 hover:text-primary-500 transition-colors font-medium group"
              >
                Faydaları
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full"></span>
              </Link>
              <Link 
                href="#how-it-works" 
                onClick={(e) => scrollToSection(e, '#how-it-works')}
                className="relative text-gray-700 hover:text-primary-500 transition-colors font-medium group"
              >
                Nasıl Çalışır?
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full"></span>
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center">
              <Link 
                href="/checkout"
                className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-3 rounded-full hover:from-primary-600 hover:to-primary-700 transition-all transform hover:scale-105 shadow-md font-medium"
              >
                Hemen Satın Al
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden py-6 border-t border-gray-200 animate-fade-in">
              <nav className="flex flex-col space-y-4">
                <Link 
                  href="/" 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-700 hover:text-primary-500 transition-colors font-medium px-4 py-2 hover:bg-gray-50 rounded-lg"
                >
                  Ana Sayfa
                </Link>
                <Link 
                  href="/product" 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-700 hover:text-primary-500 transition-colors font-medium px-4 py-2 hover:bg-gray-50 rounded-lg"
                >
                  Ürün Detayı
                </Link>
                <Link 
                  href="#benefits" 
                  onClick={(e) => scrollToSection(e, '#benefits')}
                  className="text-gray-700 hover:text-primary-500 transition-colors font-medium px-4 py-2 hover:bg-gray-50 rounded-lg"
                >
                  Faydaları
                </Link>
                <Link 
                  href="#how-it-works" 
                  onClick={(e) => scrollToSection(e, '#how-it-works')}
                  className="text-gray-700 hover:text-primary-500 transition-colors font-medium px-4 py-2 hover:bg-gray-50 rounded-lg"
                >
                  Nasıl Çalışır?
                </Link>
                <Link 
                  href="/checkout"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-full hover:from-primary-600 hover:to-primary-700 transition-all text-center font-medium shadow-md"
                >
                  Hemen Satın Al
                </Link>
              </nav>
            </div>
          )}
        </div>
        </div>
      </header>
    </>
  )
}