'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import confetti from 'canvas-confetti'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const [orderNumber, setOrderNumber] = useState('')
  
  useEffect(() => {
    // Get order number from URL params
    const params = new URLSearchParams(window.location.search)
    const merchantOid = params.get('merchant_oid')
    if (merchantOid) {
      setOrderNumber(merchantOid)
    }
    
    // Trigger confetti
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Ödeme Başarılı! 🎉
          </h1>
          
          <p className="text-gray-600 mb-8">
            Siparişiniz başarıyla alındı. En kısa sürede kargoya verilecektir.
          </p>
          
          {/* Order Info */}
          {orderNumber && (
            <div className="bg-gray-50 rounded-lg p-4 mb-8">
              <p className="text-sm text-gray-600 mb-1">Sipariş Numaranız</p>
              <p className="text-xl font-semibold text-gray-900">{orderNumber}</p>
            </div>
          )}
          
          {/* What's Next */}
          <div className="text-left mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Sırada Ne Var?</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-primary-600 font-semibold">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Sipariş Onayı</p>
                  <p className="text-sm text-gray-600">E-posta adresinize sipariş detaylarını gönderdik</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-primary-600 font-semibold">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Kargo Süreci</p>
                  <p className="text-sm text-gray-600">Ürününüz 24 saat içinde kargoya verilecek</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-primary-600 font-semibold">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Teslimat</p>
                  <p className="text-sm text-gray-600">1-3 iş günü içinde adresinize teslim</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="space-y-3">
            <Link 
              href="/"
              className="block w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Ana Sayfaya Dön
            </Link>
            <Link 
              href="/contact"
              className="block w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Destek Al
            </Link>
          </div>
        </div>
        
        {/* Contact Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Sorularınız mı var?</p>
          <p className="font-medium">
            <a href="tel:08501234567" className="text-primary-600 hover:text-primary-700">
              0850 123 45 67
            </a>
            {' veya '}
            <a href="mailto:info@oxiva.com" className="text-primary-600 hover:text-primary-700">
              info@oxiva.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}