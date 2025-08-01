'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Shield, CreditCard, Truck, HeadphonesIcon } from 'lucide-react'
import { useState, useEffect } from 'react'

interface StoreSettings {
  storeName?: string
  storeDescription?: string
  email?: string
  phone?: string
  whatsappNumber?: string
  storeAddress?: string
  logo?: string
}

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [settings, setSettings] = useState<StoreSettings>({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  return (
    <footer className="bg-gray-50">
      {/* Trust Badges */}
      <div className="border-t border-gray-200">
        <div className="container-max section-padding py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <Shield className="w-8 h-8 text-primary-500 mb-2" />
              <h4 className="font-semibold text-sm">Güvenli Alışveriş</h4>
              <p className="text-xs text-gray-600 mt-1">256-bit SSL Sertifikası</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <CreditCard className="w-8 h-8 text-primary-500 mb-2" />
              <h4 className="font-semibold text-sm">Güvenli Ödeme</h4>
              <p className="text-xs text-gray-600 mt-1">Tüm kartlar güvende</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Truck className="w-8 h-8 text-primary-500 mb-2" />
              <h4 className="font-semibold text-sm">Hızlı Kargo</h4>
              <p className="text-xs text-gray-600 mt-1">1-3 iş günü teslimat</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <HeadphonesIcon className="w-8 h-8 text-primary-500 mb-2" />
              <h4 className="font-semibold text-sm">7/24 Destek</h4>
              <p className="text-xs text-gray-600 mt-1">Müşteri hizmetleri</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-primary-900 text-white">
        <div className="container-max section-padding py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg p-2 inline-block mb-4">
                <Image
                  src={settings.logo ? settings.logo : "/images/logo.png"}
                  alt={`${settings.storeName || 'Oxiva'} Logo`}
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </div>
              <p className="text-sm text-gray-300">
                {settings.storeDescription || "Mıknatıslı burun bandı ile rahat nefes alın, horlama sorununa son verin."}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Hızlı Linkler</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Ana Sayfa</Link></li>
                <li><Link href="/product" className="text-gray-300 hover:text-white transition-colors">Ürün</Link></li>
                <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">Hakkımızda</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">İletişim</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="font-semibold mb-4">Müşteri Hizmetleri</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/shipping" className="text-gray-300 hover:text-white transition-colors">Kargo Bilgileri</Link></li>
                <li><Link href="/returns" className="text-gray-300 hover:text-white transition-colors">İade & Değişim</Link></li>
                <li><Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Gizlilik Politikası</Link></li>
                <li><Link href="/terms" className="text-gray-300 hover:text-white transition-colors">Kullanım Koşulları</Link></li>
                <li><Link href="/admin/login" className="text-gray-300 hover:text-white transition-colors">Admin Panel</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold mb-4">İletişim</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                {settings.email && (
                  <li>E-posta: {settings.email}</li>
                )}
                {settings.phone && (
                  <li>Telefon: {settings.phone}</li>
                )}
                {settings.whatsappNumber && (
                  <li>WhatsApp: {settings.whatsappNumber}</li>
                )}
                {settings.storeAddress && (
                  <li>Adres: {settings.storeAddress}</li>
                )}
                <li>Çalışma Saatleri: 09:00 - 18:00</li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
            <p>&copy; {currentYear} {settings.storeName || 'Oxiva'}. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}