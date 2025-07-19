'use client'

import Link from 'next/link'
import { ArrowRight, Clock, TruckIcon, Shield, Star, Package } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function CTASection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 23,
    seconds: 45
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev
        
        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          minutes--
          seconds = 59
        } else if (hours > 0) {
          hours--
          minutes = 59
          seconds = 59
        } else if (days > 0) {
          days--
          hours = 23
          minutes = 59
          seconds = 59
        }
        
        return { days, hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-20 bg-gradient-to-br from-primary-500 to-primary-600">
      <div className="container-max section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Huzurlu Uykular İçin Harekete Geçin!
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Özel indirimli fiyatımızdan yararlanın ve horlama problemine son verin.
            Stoklar tükenmeden sipariş verin!
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto mb-8">
            {/* Trust Badges */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center justify-center">
                <Clock className="w-6 h-6 mr-2" />
                <span className="font-semibold">Sınırlı Süreli %20 İndirim</span>
              </div>
              <div className="flex items-center justify-center">
                <TruckIcon className="w-6 h-6 mr-2" />
                <span className="font-semibold">Ücretsiz Kargo</span>
              </div>
              <div className="flex items-center justify-center">
                <Shield className="w-6 h-6 mr-2" />
                <span className="font-semibold">30 Gün İade Garantisi</span>
              </div>
            </div>

            {/* Price */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                ))}
                <span className="ml-2">4.9/5 (2.847+ değerlendirme)</span>
              </div>
              <div className="text-4xl font-bold mb-2">
                <span className="line-through opacity-60 text-2xl">₺199</span>{' '}
                <span className="text-yellow-300">₺159</span>
              </div>
              <div className="flex items-center justify-center gap-4 text-sm">
                <span className="bg-yellow-400/20 px-3 py-1 rounded-full">%20 İndirim</span>
                <span>🔥 Son 47 adet!</span>
              </div>
            </div>
            {/* Countdown Timer */}
            <div className="mb-6">
              <p className="text-sm opacity-75 mb-3">Kampanya bitimine kalan süre:</p>
              <div className="flex items-center justify-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-2xl font-bold">{timeLeft.days}</div>
                  <div className="text-xs opacity-75">Gün</div>
                </div>
                <div className="text-2xl font-bold">:</div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-xs opacity-75">Saat</div>
                </div>
                <div className="text-2xl font-bold">:</div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-xs opacity-75">Dakika</div>
                </div>
                <div className="text-2xl font-bold">:</div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-xs opacity-75">Saniye</div>
                </div>
              </div>
            </div>

            <Link 
              href="/product"
              className="inline-flex items-center justify-center bg-white text-primary-600 px-8 py-4 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl font-semibold text-lg"
            >
              İncele
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>

          {/* Additional Features */}
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="flex items-center">
              <Package className="w-5 h-5 mr-2 text-yellow-300" />
              <span className="text-sm">3&apos;lü Paket</span>
            </div>
            <div className="flex items-center">
              <TruckIcon className="w-5 h-5 mr-2 text-yellow-300" />
              <span className="text-sm">Hızlı Teslimat</span>
            </div>
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-yellow-300" />
              <span className="text-sm">Güvenli Ödeme</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}