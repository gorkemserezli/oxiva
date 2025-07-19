'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { XCircle, RefreshCw, Phone, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PaymentFailPage() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState('')
  
  useEffect(() => {
    // Get error message from URL params
    const params = new URLSearchParams(window.location.search)
    const reason = params.get('fail_message')
    if (reason) {
      setErrorMessage(reason)
    }
  }, [])
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Error Icon */}
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          
          {/* Error Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Ödeme Başarısız
          </h1>
          
          <p className="text-gray-600 mb-4">
            Üzgünüz, ödemeniz tamamlanamadı. Lütfen tekrar deneyin veya farklı bir ödeme yöntemi kullanın.
          </p>
          
          {/* Error Details */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-sm text-red-800">
                <strong>Hata:</strong> {errorMessage}
              </p>
            </div>
          )}
          
          {/* Common Issues */}
          <div className="text-left mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Olası Nedenler:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                <span>Kart bilgilerinde hata olabilir</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                <span>Kartınızda yeterli bakiye olmayabilir</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                <span>Bankanız işlemi güvenlik nedeniyle reddetmiş olabilir</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                <span>İnternet bağlantınızda sorun yaşanmış olabilir</span>
              </li>
            </ul>
          </div>
          
          {/* Actions */}
          <div className="space-y-3">
            <Link 
              href="/checkout"
              className="flex items-center justify-center gap-2 w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              <RefreshCw className="w-5 h-5" />
              Tekrar Dene
            </Link>
            <Link 
              href="/"
              className="flex items-center justify-center gap-2 w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Ana Sayfaya Dön
            </Link>
          </div>
          
          {/* Alternative Payment */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900 mb-2">
              <strong>Alternatif Ödeme:</strong>
            </p>
            <p className="text-sm text-blue-800 mb-3">
              WhatsApp üzerinden de sipariş verebilirsiniz
            </p>
            <a 
              href="https://wa.me/905555555555"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              <Phone className="w-4 h-4" />
              WhatsApp ile İletişime Geç
            </a>
          </div>
        </div>
        
        {/* Support Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Yardıma mı ihtiyacınız var?</p>
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