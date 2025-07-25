'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PayTRIframe from '@/components/PayTRIframe'

export default function TestPaymentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [iframeToken, setIframeToken] = useState('')

  const testPayment = async () => {
    setLoading(true)
    
    try {
      // Test order data
      const orderData = {
        orderId: 'TEST' + Date.now(),
        total: 100.00, // 100 TL test amount
        user: {
          email: 'test@example.com',
          phone: '5551234567',
          firstName: 'Test',
          lastName: 'User'
        },
        deliveryAddress: {
          address: 'Test Mahallesi Test Sokak No:1',
          city: 'İstanbul',
          district: 'Kadıköy'
        },
        billingAddress: {
          address: 'Test Mahallesi Test Sokak No:1', 
          city: 'İstanbul',
          district: 'Kadıköy'
        },
        items: [
          {
            name: 'Test Ürün',
            quantity: 1,
            price: 100
          }
        ]
      }

      const response = await fetch('/api/payment/paytr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        console.error('Response status:', response.status)
        const errorText = await response.text()
        console.error('Error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      console.log('PayTR Response:', data) // Debug için
      
      if (data.status === 'success' && data.token) {
        setIframeToken(data.token)
      } else {
        // Daha detaylı hata mesajı
        const errorMessage = data.error || data.message || data.reason || 'Ödeme başlatılamadı'
        console.error('PayTR Error:', data)
        alert('Hata: ' + errorMessage)
      }
    } catch (error) {
      alert('Hata: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">PayTR Test Sayfası</h1>
        
        {!iframeToken ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Test Ödeme Başlat</h2>
            <p className="text-gray-600 mb-4">
              100 TL'lik test ödemesi başlatmak için butona tıklayın.
            </p>
            
            <div className="bg-blue-50 p-4 rounded mb-4">
              <p className="text-sm text-blue-800">
                <strong>Test Kartları:</strong><br />
                Başarılı: 4355084355084358<br />
                Başarısız: 4355084355084366<br />
                CVV: 000, Son Kullanma: 12/30
              </p>
            </div>
            
            <button
              onClick={testPayment}
              disabled={loading}
              className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Yükleniyor...' : 'Test Ödemesi Başlat'}
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Ödeme işleminiz başlatıldı</h2>
              <p className="text-gray-600">Güvenli ödeme ekranı açıldı. İşleminizi tamamlayabilirsiniz.</p>
            </div>
            <PayTRIframe 
              token={iframeToken} 
              onClose={() => {
                setIframeToken('')
                alert('Ödeme iptal edildi')
              }}
            />
          </>
        )}
      </div>
    </div>
  )
}