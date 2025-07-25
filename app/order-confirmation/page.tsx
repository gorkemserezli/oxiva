'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, Truck, Mail, Phone, MapPin, Printer, ArrowLeft, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface OrderDetails {
  id: string
  orderNumber: string
  status: string
  createdAt: string
  total: number
  subtotal: number
  shipping: number
  discount: number
  kdv: number
  items: Array<{
    id: string
    quantity: number
    price: number
    total: number
    product: {
      name: string
      images: string[]
    }
  }>
  user: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  deliveryAddress: {
    firstName: string
    lastName: string
    address: string
    city: string
    district: string
    phone?: string
  }
  billingAddress: {
    title?: string
    address: string
    city: string
    district: string
    taxOffice?: string
    taxNo?: string
    tcNo?: string
  }
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const orderId = searchParams.get('orderId')
  const orderNumber = searchParams.get('orderNumber')
  
  useEffect(() => {
    if (!orderId && !orderNumber) {
      router.push('/')
      return
    }
    
    const fetchOrder = async () => {
      try {
        const params = new URLSearchParams()
        if (orderId) params.append('orderId', orderId)
        if (orderNumber) params.append('orderNumber', orderNumber)
        
        const response = await fetch(`/api/checkout?${params}`)
        if (!response.ok) {
          throw new Error('Sipariş bilgileri alınamadı')
        }
        
        const data = await response.json()
        setOrder(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }
    
    fetchOrder()
  }, [orderId, orderNumber, router])
  
  const handlePrint = () => {
    window.print()
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }
  
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Sipariş bulunamadı'}</p>
          <Link href="/" className="text-primary-600 hover:underline">
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-max section-padding">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-8 text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Siparişiniz Alındı!
          </h1>
          <p className="text-gray-600 mb-4">
            Siparişiniz başarıyla oluşturuldu. En kısa sürede kargoya verilecektir.
          </p>
          <p className="text-lg font-semibold text-primary-600">
            Sipariş Numarası: {order.orderNumber}
          </p>
        </motion.div>
        
        {/* Order Details */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Order Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Sipariş Detayları</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 pb-4 border-b last:border-0">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={item.product.images[0] || '/images/logo.png'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">Adet: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">₺{item.total.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Delivery Address */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Teslimat Adresi
              </h2>
              <div className="space-y-2">
                <p className="font-medium">
                  {order.deliveryAddress.firstName} {order.deliveryAddress.lastName}
                </p>
                <p className="text-gray-600">{order.deliveryAddress.address}</p>
                <p className="text-gray-600">
                  {order.deliveryAddress.district}, {order.deliveryAddress.city}
                </p>
                {order.deliveryAddress.phone && (
                  <p className="text-gray-600 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {order.deliveryAddress.phone}
                  </p>
                )}
              </div>
            </div>
            
            {/* Billing Address */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Fatura Adresi
              </h2>
              <div className="space-y-2">
                {order.billingAddress.title && (
                  <p className="font-medium">{order.billingAddress.title}</p>
                )}
                <p className="text-gray-600">{order.billingAddress.address}</p>
                <p className="text-gray-600">
                  {order.billingAddress.district}, {order.billingAddress.city}
                </p>
                {order.billingAddress.taxOffice && (
                  <p className="text-gray-600">
                    Vergi Dairesi: {order.billingAddress.taxOffice}
                  </p>
                )}
                {order.billingAddress.taxNo && (
                  <p className="text-gray-600">
                    Vergi No: {order.billingAddress.taxNo}
                  </p>
                )}
                {order.billingAddress.tcNo && (
                  <p className="text-gray-600">
                    TC Kimlik No: {order.billingAddress.tcNo}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold mb-4">Sipariş Özeti</h2>
              
              <div className="space-y-3 pb-4 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ara Toplam (KDV Hariç)</span>
                  <span>₺{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kargo</span>
                  <span className="text-green-600">
                    {order.shipping === 0 ? 'Ücretsiz' : `₺${order.shipping.toFixed(2)}`}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">İndirim</span>
                    <span className="text-green-600">-₺{order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">KDV (%20)</span>
                  <span>₺{order.kdv.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4">
                <span className="text-lg font-semibold">Toplam</span>
                <span className="text-2xl font-bold text-primary-600">
                  ₺{order.total.toFixed(2)}
                </span>
              </div>
              
              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <h3 className="font-medium mb-2">İletişim Bilgileri</h3>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    {order.user.email}
                  </p>
                  {order.user.phone && (
                    <p className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      {order.user.phone}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={handlePrint}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Yazdır
                </button>
                <Link
                  href="/"
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Ana Sayfaya Dön
                </Link>
              </div>
            </div>
            
            {/* Tracking Info */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="font-medium text-blue-900 mb-2">
                Kargo Takibi
              </h3>
              <p className="text-sm text-blue-800">
                Siparişiniz hazırlandıktan sonra kargo takip numaranız e-posta adresinize gönderilecektir.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .container-max, .container-max * {
            visibility: visible;
          }
          .container-max {
            position: absolute;
            left: 0;
            top: 0;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}