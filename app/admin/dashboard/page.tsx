'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart2, 
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  Loader2,
  AlertCircle
} from 'lucide-react'

interface StatCard {
  title: string
  value: string | number
  change: number
  icon: React.ReactNode
  trend: 'up' | 'down'
}

interface DashboardData {
  stats: {
    totalRevenue: number
    totalOrders: number
    totalCustomers: number
    totalProducts: number
    monthRevenue: number
    growth: string
  }
  recentOrders: any[]
  topProducts: any[]
}

export default function AdminDashboard() {
  const router = useRouter()
  const [adminName, setAdminName] = useState('')
  const [greeting, setGreeting] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    // Auth kontrolü
    const auth = localStorage.getItem('adminAuth')
    if (!auth) {
      router.push('/admin/login')
      return
    }

    const authData = JSON.parse(auth)
    setAdminName(authData.user?.name || 'Admin')

    // Günün saatine göre selamlama
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Günaydın')
    else if (hour < 18) setGreeting('İyi günler')
    else setGreeting('İyi akşamlar')

    // Fetch dashboard data
    fetchDashboardData()
  }, [router])

  const fetchDashboardData = async () => {
    try {
      const auth = localStorage.getItem('adminAuth')
      if (!auth) return

      const { token } = JSON.parse(auth)
      const response = await fetch('/api/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Veriler yüklenemedi')
      }

      const dashboardData = await response.json()
      setData(dashboardData)
    } catch (err) {
      setError('Dashboard verileri yüklenirken hata oluştu')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  const formatTimeAgo = (date: string) => {
    const now = new Date()
    const past = new Date(date)
    const diff = now.getTime() - past.getTime()
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days} gün önce`
    if (hours > 0) return `${hours} saat önce`
    if (minutes > 0) return `${minutes} dk önce`
    return 'Az önce'
  }

  const stats: StatCard[] = data ? [
    {
      title: 'Aylık Gelir',
      value: formatCurrency(data.stats.monthRevenue),
      change: parseFloat(data.stats.growth),
      icon: <TrendingUp className="w-6 h-6" />,
      trend: parseFloat(data.stats.growth) >= 0 ? 'up' : 'down'
    },
    {
      title: 'Sipariş Sayısı',
      value: data.stats.totalOrders,
      change: 0,
      icon: <ShoppingCart className="w-6 h-6" />,
      trend: 'up'
    },
    {
      title: 'Müşteri Sayısı',
      value: data.stats.totalCustomers,
      change: 0,
      icon: <Users className="w-6 h-6" />,
      trend: 'up'
    },
    {
      title: 'Aktif Ürün',
      value: data.stats.totalProducts,
      change: 0,
      icon: <Package className="w-6 h-6" />,
      trend: 'up'
    }
  ] : []

  const statusColors = {
    NEW: 'bg-blue-100 text-blue-800',
    CONFIRMED: 'bg-indigo-100 text-indigo-800',
    PROCESSING: 'bg-yellow-100 text-yellow-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    RETURNED: 'bg-gray-100 text-gray-800'
  }

  const statusLabels = {
    NEW: 'Yeni',
    CONFIRMED: 'Onaylandı',
    PROCESSING: 'Hazırlanıyor',
    SHIPPED: 'Kargoda',
    DELIVERED: 'Teslim Edildi',
    CANCELLED: 'İptal',
    RETURNED: 'İade'
  }

  const statusIcons = {
    NEW: <Clock className="w-4 h-4" />,
    CONFIRMED: <CheckCircle className="w-4 h-4" />,
    PROCESSING: <Package className="w-4 h-4" />,
    SHIPPED: <Package className="w-4 h-4" />,
    DELIVERED: <CheckCircle className="w-4 h-4" />,
    CANCELLED: <AlertCircle className="w-4 h-4" />,
    RETURNED: <AlertCircle className="w-4 h-4" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
        {/* Header */}
        <header className="bg-white shadow">
          <div className="px-6 py-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {greeting}, {adminName}!
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {new Date().toLocaleDateString('tr-TR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-4 md:p-6">
                <div className="flex items-center justify-between mb-2 md:mb-4">
                  <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
                    {stat.icon}
                  </div>
                  {stat.change !== 0 && (
                    <span className={`flex items-center text-xs md:text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.trend === 'up' ? <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1" /> : <TrendingDown className="w-3 h-3 md:w-4 md:h-4 mr-1" />}
                      {Math.abs(stat.change)}%
                    </span>
                  )}
                </div>
                <h3 className="text-xs md:text-sm font-medium text-gray-600">{stat.title}</h3>
                <p className="text-lg md:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Son Siparişler</h3>
                <Link href="/admin/orders" className="text-sm text-primary-600 hover:text-primary-700">
                  Tümünü Gör →
                </Link>
              </div>
            </div>
            <div className="p-6">
              {data?.recentOrders && data.recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {data.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                          <p className="text-sm text-gray-600">{order.customerName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[order.status as keyof typeof statusColors]
                        }`}>
                          {statusIcons[order.status as keyof typeof statusIcons]}
                          {statusLabels[order.status as keyof typeof statusLabels]}
                        </span>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{formatCurrency(order.total)}</p>
                          <p className="text-xs text-gray-500">{formatTimeAgo(order.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">Henüz sipariş bulunmuyor</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Link href="/admin/orders/new" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Yeni Sipariş</h4>
                  <p className="text-sm text-gray-600">Manuel sipariş oluştur</p>
                </div>
              </div>
            </Link>
            <Link href="/admin/products/new" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg text-green-600">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Ürün Ekle</h4>
                  <p className="text-sm text-gray-600">Yeni ürün ekle</p>
                </div>
              </div>
            </Link>
            <Link href="/admin/reports" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                  <BarChart2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Raporlar</h4>
                  <p className="text-sm text-gray-600">Detaylı analizler</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
    </div>
  )
}