'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import confetti from 'canvas-confetti'

export default function SuccessPage() {
  useEffect(() => {
    // Confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }, [])

  const orderNumber = `OX${Date.now().toString().slice(-8)}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full mx-auto px-4"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-500" />
          </motion.div>

          {/* Success Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Siparişiniz Alındı!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Teşekkür ederiz! Siparişiniz başarıyla oluşturuldu ve hazırlanmaya başlandı.
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <p className="text-sm text-gray-600 mb-2">Sipariş Numaranız</p>
            <p className="text-2xl font-bold text-primary-600">{orderNumber}</p>
          </div>

          {/* What's Next */}
          <div className="space-y-4 text-left mb-8">
            <h3 className="font-semibold text-gray-900 text-center">Sonraki Adımlar</h3>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Onay E-postası</p>
                <p className="text-sm text-gray-600">
                  Sipariş detaylarınızı içeren bir e-posta gönderdik.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Package className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Kargo Takibi</p>
                <p className="text-sm text-gray-600">
                  Ürününüz kargoya verildiğinde SMS ile bilgilendirileceksiniz.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Teslimat</p>
                <p className="text-sm text-gray-600">
                  1-3 iş günü içinde ürününüz adresinize teslim edilecek.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
            <Link
              href="/product"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
            >
              Alışverişe Devam Et
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Sorularınız mı var? Bize{' '}
              <a href="mailto:info@oxiva.com" className="text-primary-500 hover:underline">
                info@oxiva.com
              </a>
              {' '}adresinden ulaşabilirsiniz.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}