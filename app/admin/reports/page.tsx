'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Package,
  Users,
  CreditCard,
  BarChart3,
  LineChart,
  PieChart,
  FileText,
  Filter
} from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js'
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

interface ReportStat {
  title: string
  value: string
  change: number
  trend: 'up' | 'down'
  icon: React.ReactNode
}

export default function ReportsPage() {
  const router = useRouter()
  const [dateRange, setDateRange] = useState('last30days')
  const [reportType, setReportType] = useState('sales')
  const [loading, setLoading] = useState(false)

  // Check auth
  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (!auth) {
      router.push('/admin/login')
    }
  }, [router])

  // Stats data
  const stats: ReportStat[] = [
    {
      title: 'Toplam Satış',
      value: '₺124,567',
      change: 12.5,
      trend: 'up',
      icon: <CreditCard className="w-6 h-6" />
    },
    {
      title: 'Sipariş Sayısı',
      value: '856',
      change: 8.2,
      trend: 'up',
      icon: <ShoppingCart className="w-6 h-6" />
    },
    {
      title: 'Ortalama Sepet',
      value: '₺145.50',
      change: -2.4,
      trend: 'down',
      icon: <BarChart3 className="w-6 h-6" />
    },
    {
      title: 'Yeni Müşteri',
      value: '124',
      change: 15.8,
      trend: 'up',
      icon: <Users className="w-6 h-6" />
    }
  ]

  // Chart options for line charts
  const lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₺' + value
          }
        }
      }
    }
  }

  // Chart options for bar charts
  const barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 50
        }
      }
    }
  }

  // Sales trend data
  const salesData = {
    labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
    datasets: [
      {
        label: 'Satışlar',
        data: [12500, 15200, 18900, 17600, 21300, 24567],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      },
      {
        label: 'Hedef',
        data: [15000, 15000, 20000, 20000, 25000, 25000],
        borderColor: 'rgb(156, 163, 175)',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        borderDash: [5, 5]
      }
    ]
  }

  // Category sales data
  const categoryData = {
    labels: ['Sağlık', 'Elektronik', 'Ev & Yaşam', 'Spor', 'Diğer'],
    datasets: [
      {
        label: 'Kategori Satışları',
        data: [45, 25, 15, 10, 5],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(107, 114, 128, 0.8)'
        ],
        borderWidth: 0
      }
    ]
  }

  // Product performance data
  const productData = {
    labels: ['Oxiva Burun Bandı', 'Oxiva Pro', 'Oxiva Plus', 'Oxiva Kids', 'Diğer'],
    datasets: [
      {
        label: 'Satış Adedi',
        data: [320, 180, 120, 80, 156],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1
      }
    ]
  }

  // Top products table data
  const topProducts = [
    { id: 1, name: 'Oxiva Mıknatıslı Burun Bandı', sales: 320, revenue: '₺143,680', growth: 12.5 },
    { id: 2, name: 'Oxiva Pro Burun Bandı', sales: 180, revenue: '₺98,820', growth: 8.2 },
    { id: 3, name: 'Oxiva Plus Burun Bandı', sales: 120, revenue: '₺65,880', growth: -2.4 },
    { id: 4, name: 'Oxiva Kids Burun Bandı', sales: 80, revenue: '₺35,920', growth: 15.8 },
    { id: 5, name: 'Oxiva Sporcu Paketi', sales: 65, revenue: '₺42,185', growth: 5.3 }
  ]

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    setLoading(true)
    // Simulate export
    setTimeout(() => {
      setLoading(false)
      alert(`${format.toUpperCase()} formatında rapor indirildi!`)
    }, 1500)
  }

  return (
    <div>
      {/* Header */}
      <header className="bg-white shadow">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Raporlar</h1>
              <p className="text-sm text-gray-600 mt-1">Detaylı satış ve performans analizleri</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="today">Bugün</option>
                <option value="yesterday">Dün</option>
                <option value="last7days">Son 7 Gün</option>
                <option value="last30days">Son 30 Gün</option>
                <option value="last90days">Son 90 Gün</option>
                <option value="custom">Özel Tarih</option>
              </select>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Calendar className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
                  {stat.icon}
                </div>
                <span className={`flex items-center text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {Math.abs(stat.change)}%
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Report Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setReportType('sales')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  reportType === 'sales'
                    ? 'text-primary-600 border-primary-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                Satış Raporu
              </button>
              <button
                onClick={() => setReportType('products')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  reportType === 'products'
                    ? 'text-primary-600 border-primary-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                Ürün Performansı
              </button>
              <button
                onClick={() => setReportType('customers')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  reportType === 'customers'
                    ? 'text-primary-600 border-primary-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                Müşteri Analizi
              </button>
              <button
                onClick={() => setReportType('inventory')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  reportType === 'inventory'
                    ? 'text-primary-600 border-primary-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                Stok Durumu
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Export Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => handleExport('pdf')}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <FileText className="w-5 h-5" />
                PDF İndir
              </button>
              <button
                onClick={() => handleExport('excel')}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <Download className="w-5 h-5" />
                Excel İndir
              </button>
              <button
                onClick={() => handleExport('csv')}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <Download className="w-5 h-5" />
                CSV İndir
              </button>
            </div>

            {/* Charts */}
            {reportType === 'sales' && (
              <div className="space-y-6">
                {/* Sales Trend Chart */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Satış Trendi</h3>
                  <div className="h-80">
                    <Line options={lineChartOptions} data={salesData} />
                  </div>
                </div>

                {/* Category Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategori Dağılımı</h3>
                    <div className="h-64">
                      <Pie data={categoryData} options={{ maintainAspectRatio: false }} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Ödeme Yöntemleri</h3>
                    <div className="h-64">
                      <Doughnut 
                        data={{
                          labels: ['Kredi Kartı', 'Havale/EFT', 'Kapıda Ödeme'],
                          datasets: [{
                            data: [65, 25, 10],
                            backgroundColor: [
                              'rgba(59, 130, 246, 0.8)',
                              'rgba(16, 185, 129, 0.8)',
                              'rgba(251, 146, 60, 0.8)'
                            ],
                            borderWidth: 0
                          }]
                        }} 
                        options={{ maintainAspectRatio: false }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {reportType === 'products' && (
              <div className="space-y-6">
                {/* Product Sales Chart */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ürün Satışları</h3>
                  <div className="h-80">
                    <Bar 
                      data={productData} 
                      options={barChartOptions}
                    />
                  </div>
                </div>

                {/* Top Products Table */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">En Çok Satan Ürünler</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ürün
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Satış Adedi
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Gelir
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Büyüme
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {topProducts.map((product) => (
                          <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {product.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {product.sales}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {product.revenue}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center text-sm font-medium ${
                                product.growth > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {product.growth > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                                {Math.abs(product.growth)}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {reportType === 'customers' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Müşteri Büyümesi</h3>
                    <div className="h-64">
                      <Line 
                        data={{
                          labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
                          datasets: [{
                            label: 'Yeni Müşteriler',
                            data: [45, 52, 48, 65, 72, 84],
                            borderColor: 'rgb(16, 185, 129)',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            tension: 0.4
                          }]
                        }}
                        options={lineChartOptions}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Müşteri Segmentleri</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Yeni Müşteriler</p>
                          <p className="text-sm text-gray-600">Son 30 günde katılan</p>
                        </div>
                        <span className="text-2xl font-bold text-primary-600">124</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Tekrar Eden Müşteriler</p>
                          <p className="text-sm text-gray-600">2+ sipariş veren</p>
                        </div>
                        <span className="text-2xl font-bold text-primary-600">89</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">VIP Müşteriler</p>
                          <p className="text-sm text-gray-600">5+ sipariş veren</p>
                        </div>
                        <span className="text-2xl font-bold text-primary-600">23</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {reportType === 'inventory' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-green-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-green-900">Stokta</h4>
                      <Package className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-green-900">385</p>
                    <p className="text-sm text-green-700 mt-1">Ürün mevcut</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-yellow-900">Azalan Stok</h4>
                      <Package className="w-6 h-6 text-yellow-600" />
                    </div>
                    <p className="text-3xl font-bold text-yellow-900">12</p>
                    <p className="text-sm text-yellow-700 mt-1">Ürün kritik seviyede</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-red-900">Stok Yok</h4>
                      <Package className="w-6 h-6 text-red-600" />
                    </div>
                    <p className="text-3xl font-bold text-red-900">3</p>
                    <p className="text-sm text-red-700 mt-1">Ürün tükendi</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Kritik Stok Durumu</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Filter className="w-5 h-5 text-yellow-600" />
                      <p className="font-medium text-yellow-900">Acil stok yenilenmesi gereken ürünler</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-white rounded">
                        <span className="font-medium">Oxiva Pro Burun Bandı</span>
                        <span className="text-red-600 font-bold">Stok: 2</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded">
                        <span className="font-medium">Oxiva Kids Burun Bandı</span>
                        <span className="text-orange-600 font-bold">Stok: 8</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded">
                        <span className="font-medium">Oxiva Sporcu Paketi</span>
                        <span className="text-orange-600 font-bold">Stok: 5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}