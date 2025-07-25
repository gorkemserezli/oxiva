'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Printer,
  Download
} from 'lucide-react'
import Image from 'next/image'

interface OrderDetail {
  id: string
  orderId: string
  customer: {
    name: string
    email: string
    phone: string
    address: string
    city: string
  }
  items: Array<{
    id: string
    name: string
    image: string
    quantity: number
    price: number
    total: number
  }>
  payment: {
    method: string
    status: string
    transactionId?: string
  }
  shipping: {
    method: string
    trackingNumber?: string
    carrier?: string
  }
  totals: {
    subtotal: number
    shipping: number
    discount: number
    tax: number
    total: number
  }
  status: string
  orderNote?: string
  createdAt: string
  updatedAt: string
  timeline: Array<{
    id: string
    action: string
    date: string
    user: string
  }>
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [newStatus, setNewStatus] = useState('')

  useEffect(() => {
    // Mock data - production'da API'den gelecek
    setTimeout(() => {
      setOrder({
        id: params.id as string,
        orderId: 'OX12345678',
        customer: {
          name: 'Ahmet Yılmaz',
          email: 'ahmet.yilmaz@example.com',
          phone: '+90 555 123 4567',
          address: 'Atatürk Mahallesi, Cumhuriyet Caddesi, No: 123, Daire: 4',
          city: 'İstanbul / Kadıköy'
        },
        items: [
          {
            id: '1',
            name: 'Oxiva Mıknatıslı Burun Bandı',
            image: '/images/logo.png',
            quantity: 2,
            price: 449,
            total: 898
          }
        ],
        payment: {
          method: 'Kredi Kartı',
          status: 'completed',
          transactionId: 'PAY123456789'
        },
        shipping: {
          method: 'Ücretsiz Kargo',
          trackingNumber: 'TR123456789',
          carrier: 'Yurtiçi Kargo'
        },
        totals: {
          subtotal: 898,
          shipping: 0,
          discount: 100,
          tax: 149.67,
          total: 798
        },
        status: 'processing',
        orderNote: 'Lütfen kargo paketini gizli gönderin.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
        timeline: [
          {
            id: '1',
            action: 'Sipariş oluşturuldu',
            date: new Date(Date.now() - 86400000).toISOString(),
            user: 'Sistem'
          },
          {
            id: '2',
            action: 'Ödeme alındı',
            date: new Date(Date.now() - 82800000).toISOString(),
            user: 'PayTR'
          },
          {
            id: '3',
            action: 'Sipariş hazırlanıyor',
            date: new Date(Date.now() - 43200000).toISOString(),
            user: 'Admin'
          }
        ]
      })
      setNewStatus('processing')
      setLoading(false)
    }, 1000)
  }, [params.id])

  const handleStatusUpdate = () => {
    if (order) {
      setOrder({ ...order, status: newStatus })
      // API'ye gönder
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock
      case 'processing': return Package
      case 'shipped': return Truck
      case 'delivered': return CheckCircle
      case 'cancelled': return XCircle
      default: return AlertCircle
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!order) {
    return <div>Sipariş bulunamadı</div>
  }

  const StatusIcon = getStatusIcon(order.status)

  return (
    <div>
      {/* Header */}
      <header className="bg-white shadow">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/admin/orders"
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Sipariş #{order.orderId}</h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 ml-11 sm:ml-0">
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
              >
                <Printer className="w-4 sm:w-5 h-4 sm:h-5" />
                <span className="hidden sm:inline">Yazdır</span>
              </button>
              <button 
                onClick={() => {
                  // Production'da jsPDF veya benzeri bir kütüphane kullanılabilir
                  alert('PDF indirme özelliği yakında eklenecek!')
                }}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
              >
                <Download className="w-4 sm:w-5 h-4 sm:h-5" />
                <span className="hidden sm:inline">PDF İndir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Sol Kolon - Sipariş Detayları */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Sipariş Durumu */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Sipariş Durumu</h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <div className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(order.status)}`}>
                  <StatusIcon className="w-3 sm:w-4 h-3 sm:h-4" />
                  <span>
                    {order.status === 'pending' && 'Beklemede'}
                    {order.status === 'processing' && 'Hazırlanıyor'}
                    {order.status === 'shipped' && 'Kargoya Verildi'}
                    {order.status === 'delivered' && 'Teslim Edildi'}
                    {order.status === 'cancelled' && 'İptal Edildi'}
                  </span>
                </div>
                <div className="flex flex-1 w-full sm:w-auto items-center gap-2">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="pending">Beklemede</option>
                    <option value="processing">Hazırlanıyor</option>
                    <option value="shipped">Kargoya Verildi</option>
                    <option value="delivered">Teslim Edildi</option>
                    <option value="cancelled">İptal Edildi</option>
                  </select>
                  <button
                    onClick={handleStatusUpdate}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm sm:text-base"
                  >
                    Güncelle
                  </button>
                </div>
              </div>
            </div>

            {/* Ürünler */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Sipariş Kalemleri</h3>
              <div className="space-y-3 sm:space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="w-16 sm:w-20 h-16 sm:h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{item.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {item.quantity} adet x ₺{item.price}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">₺{item.total}</p>
                  </div>
                ))}
              </div>

              {/* Sipariş Notu */}
              {order.orderNote && (
                <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs sm:text-sm text-yellow-800">
                    <strong>Müşteri Notu:</strong> {order.orderNote}
                  </p>
                </div>
              )}

              {/* Fiyat Özeti */}
              <div className="mt-4 sm:mt-6 space-y-2 border-t pt-4">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Ara Toplam</span>
                  <span>₺{order.totals.subtotal.toFixed(2)}</span>
                </div>
                {order.totals.discount > 0 && (
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">İndirim</span>
                    <span className="text-green-600">-₺{order.totals.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Kargo</span>
                  <span>{order.totals.shipping === 0 ? 'Ücretsiz' : `₺${order.totals.shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">KDV (%20)</span>
                  <span>₺{order.totals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base sm:text-lg font-semibold pt-2 border-t">
                  <span>Toplam</span>
                  <span className="text-primary-600">₺{order.totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Kargo Bilgileri */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Kargo Bilgileri</h3>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="text-gray-600 text-sm">Kargo Yöntemi</span>
                  <span className="font-medium text-sm sm:text-base">{order.shipping.method}</span>
                </div>
                {order.shipping.carrier && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <span className="text-gray-600 text-sm">Kargo Firması</span>
                    <span className="font-medium text-sm sm:text-base">{order.shipping.carrier}</span>
                  </div>
                )}
                {order.shipping.trackingNumber && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <span className="text-gray-600 text-sm">Takip Numarası</span>
                    <span className="font-medium text-primary-600 text-sm sm:text-base break-all">{order.shipping.trackingNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sağ Kolon - Müşteri ve Ödeme Bilgileri */}
          <div className="space-y-4 sm:space-y-6">
            {/* Müşteri Bilgileri */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Müşteri Bilgileri</h3>
              <div className="space-y-3">
                <div className="flex items-start sm:items-center gap-3">
                  <User className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400 mt-0.5 sm:mt-0" />
                  <span className="font-medium text-sm sm:text-base break-words">{order.customer.name}</span>
                </div>
                <div className="flex items-start sm:items-center gap-3">
                  <Mail className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400 mt-0.5 sm:mt-0" />
                  <a href={`mailto:${order.customer.email}`} className="text-primary-600 hover:underline text-sm sm:text-base break-all">
                    {order.customer.email}
                  </a>
                </div>
                <div className="flex items-start sm:items-center gap-3">
                  <Phone className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400 mt-0.5 sm:mt-0" />
                  <a href={`tel:${order.customer.phone}`} className="text-primary-600 hover:underline text-sm sm:text-base">
                    {order.customer.phone}
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400 mt-0.5" />
                  <div className="text-sm sm:text-base">
                    <p className="text-gray-900">{order.customer.address}</p>
                    <p className="text-gray-600">{order.customer.city}</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => window.open(`https://wa.me/${order.customer.phone.replace(/\s+/g, '').replace('+', '')}`, '_blank')}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:text-base"
              >
                <MessageSquare className="w-4 sm:w-5 h-4 sm:h-5" />
                WhatsApp&apos;tan Mesaj Gönder
              </button>
            </div>

            {/* Ödeme Bilgileri */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Ödeme Bilgileri</h3>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="text-gray-600 text-sm">Ödeme Yöntemi</span>
                  <span className="font-medium text-sm sm:text-base">{order.payment.method}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="text-gray-600 text-sm">Ödeme Durumu</span>
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${
                    order.payment.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.payment.status === 'completed' ? 'Ödendi' : 'Beklemede'}
                  </span>
                </div>
                {order.payment.transactionId && (
                  <div>
                    <span className="text-gray-600 text-xs sm:text-sm">İşlem No:</span>
                    <p className="font-mono text-xs sm:text-sm mt-1 break-all">{order.payment.transactionId}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sipariş Geçmişi */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Sipariş Geçmişi</h3>
              <div className="space-y-3 sm:space-y-4">
                {order.timeline.map((event, index) => (
                  <div key={event.id} className="relative">
                    {index < order.timeline.length - 1 && (
                      <div className="absolute left-1.5 sm:left-2 top-5 sm:top-6 bottom-0 w-0.5 bg-gray-200"></div>
                    )}
                    <div className="flex gap-2 sm:gap-3">
                      <div className="w-3 sm:w-4 h-3 sm:h-4 bg-primary-600 rounded-full mt-0.5 sm:mt-1 z-10 shrink-0"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm sm:text-base">{event.action}</p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {new Date(event.date).toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'long',
                            hour: '2-digit',
                            minute: '2-digit'
                          })} - {event.user}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}