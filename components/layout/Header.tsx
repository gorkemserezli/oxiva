'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, Phone, Mail } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface StoreSettings {
  storeName?: string
  siteTitle?: string
  email?: string
  phone?: string
  whatsappNumber?: string
  logo?: string
  favicon?: string
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [settings, setSettings] = useState<StoreSettings>({})
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fetch store settings
  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
        
        // Update favicon if available
        if (data.favicon) {
          const faviconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement
          if (faviconLink) {
            faviconLink.href = data.favicon
          }
        }
        
        // Update page title if available
        if (data.siteTitle) {
          document.title = data.siteTitle
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    
    if (href.startsWith('#')) {
      const sectionId = href.substring(1)
      
      // Ana sayfada değilsek önce ana sayfaya git
      if (pathname !== '/') {
        router.push(`/${href}`)
      } else {
        // Ana sayfadaysak direkt scroll et
        const element = document.getElementById(sectionId)
        if (element) {
          const offset = 140 // Header height offset
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - offset
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      }
      setIsMenuOpen(false)
    }
  }

  return (
    <>
      {/* Main Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300`}>
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white border-b border-primary-700/20">
          {/* Mobile Version */}
          <div className="md:hidden">
            <div className="container-max section-padding py-2">
              <div className="flex items-center justify-center gap-1 text-xs">
                <div className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">Ücretsiz Kargo</span>
                </div>
                <span className="mx-2 opacity-40">•</span>
                <div className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Hızlı Teslimat</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Desktop Version */}
          <div className="hidden md:block">
            <div className="container-max section-padding py-2.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white/90">Ücretsiz Kargo</span>
                  </div>
                  <div className="w-px h-4 bg-white/20"></div>
                  <span className="text-white/90">Aynı Gün Kargo</span>
                  <div className="w-px h-4 bg-white/20"></div>
                  <span className="text-white/90">%100 Güvenli Alışveriş</span>
                </div>
                
                <div className="flex items-center gap-4">
                  {settings.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-white/80" />
                      <span className="text-white/90">{settings.email}</span>
                    </div>
                  )}
                  {settings.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-white/80" />
                      <span className="text-white/90">{settings.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className={`bg-white transition-all duration-300 ${
          isScrolled ? 'shadow-lg' : 'shadow-sm'
        }`}>
        <div className="container-max section-padding">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src={settings.logo ? settings.logo : "/images/logo.png"}
                alt={`${settings.storeName || 'Oxiva'} Logo`}
                width={140}
                height={46}
                className="h-10 md:h-12 w-auto"
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
                href="/products" 
                className="relative text-gray-700 hover:text-primary-500 transition-colors font-medium group"
              >
                Ürünler
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full"></span>
              </Link>
              <Link 
                href={pathname === '/' ? '#benefits' : '/#benefits'}
                onClick={(e) => scrollToSection(e, '#benefits')}
                className="relative text-gray-700 hover:text-primary-500 transition-colors font-medium group"
              >
                Faydaları
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full"></span>
              </Link>
              <Link 
                href={pathname === '/' ? '#comparison' : '/#comparison'}
                onClick={(e) => scrollToSection(e, '#comparison')}
                className="relative text-gray-700 hover:text-primary-500 transition-colors font-medium group"
              >
                Neden Oxiva?
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full"></span>
              </Link>
              <Link 
                href={pathname === '/' ? '#how-it-works' : '/#how-it-works'}
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
                href="/product"
                className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-3 rounded-full hover:from-primary-600 hover:to-primary-700 transition-all transform hover:scale-105 shadow-md font-medium"
              >
                İncele
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

        </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Dark overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Mobile Menu */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-[88px] md:top-[100px] left-0 right-0 bg-white z-50 lg:hidden shadow-xl"
            >
              <nav className="flex flex-col py-6 overflow-hidden">
              <Link 
                href="/" 
                onClick={() => setIsMenuOpen(false)}
                className="mobile-menu-item text-gray-700 hover:text-primary-500 transition-colors font-medium px-6 py-3 hover:bg-gray-50"
              >
                Ana Sayfa
              </Link>
              <Link 
                href="/products" 
                onClick={() => setIsMenuOpen(false)}
                className="mobile-menu-item text-gray-700 hover:text-primary-500 transition-colors font-medium px-6 py-3 hover:bg-gray-50"
              >
                Ürünler
              </Link>
              <Link 
                href={pathname === '/' ? '#benefits' : '/#benefits'}
                onClick={(e) => scrollToSection(e, '#benefits')}
                className="mobile-menu-item text-gray-700 hover:text-primary-500 transition-colors font-medium px-6 py-3 hover:bg-gray-50"
              >
                Faydaları
              </Link>
              <Link 
                href={pathname === '/' ? '#comparison' : '/#comparison'}
                onClick={(e) => scrollToSection(e, '#comparison')}
                className="mobile-menu-item text-gray-700 hover:text-primary-500 transition-colors font-medium px-6 py-3 hover:bg-gray-50"
              >
                Neden Oxiva?
              </Link>
              <Link 
                href={pathname === '/' ? '#how-it-works' : '/#how-it-works'}
                onClick={(e) => scrollToSection(e, '#how-it-works')}
                className="mobile-menu-item text-gray-700 hover:text-primary-500 transition-colors font-medium px-6 py-3 hover:bg-gray-50"
              >
                Nasıl Çalışır?
              </Link>
              
              {/* CTA Button */}
              <div className="mobile-menu-item px-6 pt-4">
                <Link 
                  href="/product"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-full hover:from-primary-600 hover:to-primary-700 transition-all text-center font-medium shadow-md"
                >
                  İncele
                </Link>
              </div>
              
              {/* Contact Info */}
              <div className="mobile-menu-item border-t border-gray-100 mt-6 pt-4 px-6">
                <div className="space-y-3">
                  {settings.email && (
                    <a 
                      href={`mailto:${settings.email}`}
                      className="flex items-center gap-3 text-gray-600 hover:text-primary-500 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{settings.email}</span>
                    </a>
                  )}
                  {settings.phone && (
                    <a 
                      href={`tel:${settings.phone.replace(/\s/g, '')}`}
                      className="flex items-center gap-3 text-gray-600 hover:text-primary-500 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{settings.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            </nav>
          </motion.div>
        </>
        )}
      </AnimatePresence>
    </>
  )
}