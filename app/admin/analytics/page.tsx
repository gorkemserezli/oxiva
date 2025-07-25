'use client'

import { useState } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Calendar,
  Download,
  Filter
} from 'lucide-react'

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState('month')
  const [selectedMetric, setSelectedMetric] = useState('revenue')

  // Mock data - production'da gerçek veriler gelecek
  const stats = {
    revenue: { value: '₺124,567', change: 12.5, trend: 'up' },
    orders: { value: '456', change: 8.2, trend: 'up' },
    customers: { value: '89', change: -2.4, trend: 'down' },
    averageOrder: { value: '₺273', change: 4.1, trend: 'up' }
  }

  // Grafik için mock data
  const chartData = [
    { date: '1 Oca', revenue: 2400, orders: 12 },
    { date: '8 Oca', revenue: 3200, orders: 18 },
    { date: '15 Oca', revenue: 2800, orders: 15 },
    { date: '22 Oca', revenue: 4100, orders: 22 },
    { date: '29 Oca', revenue: 3600, orders: 19 },
  ]

  const topProducts = [
    { name: 'Oxiva Mıknatıslı Burun Bandı', sales: 156, revenue: '₺70,044' },
    { name: 'Oxiva Pro Model', sales: 89, revenue: '₺44,411' },
    { name: 'Oxiva Lite', sales: 45, revenue: '₺10,112' },
  ]

  const ordersByStatus = [
    { status: 'Tamamlandı', count: 342, percentage: 75 },
    { status: 'İşlemde', count: 68, percentage: 15 },
    { status: 'Beklemede', count: 23, percentage: 5 },
    { status: 'İptal', count: 23, percentage: 5 },
  ]

  return (
    <div>
      {/* Header */}
      <header className="bg-white shadow">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Raporlar & Analitik</h1>
              <p className="text-sm text-gray-600 mt-1">Detaylı iş analizleri ve performans metrikleri</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              <Download className="w-5 h-5" />
              Rapor İndir
            </button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Date Range Selector */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div className="flex gap-2">
                {['week', 'month', 'quarter', 'year'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      dateRange === range
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {range === 'week' && 'Hafta'}
                    {range === 'month' && 'Ay'}
                    {range === 'quarter' && 'Çeyrek'}
                    {range === 'year' && 'Yıl'}
                  </button>
                ))}
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Filtrele
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <span className={`flex items-center text-sm font-medium ${
                stats.revenue.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stats.revenue.trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {stats.revenue.change}%
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Toplam Gelir</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.revenue.value}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <span className={`flex items-center text-sm font-medium ${
                stats.orders.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stats.orders.trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {stats.orders.change}%
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Toplam Sipariş</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.orders.value}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <span className={`flex items-center text-sm font-medium ${
                stats.customers.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stats.customers.trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {Math.abs(stats.customers.change)}%
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Yeni Müşteriler</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.customers.value}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <span className={`flex items-center text-sm font-medium ${
                stats.averageOrder.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stats.averageOrder.trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {stats.averageOrder.change}%
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Ortalama Sipariş</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.averageOrder.value}</p>
          </div>
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gelir Grafiği</h3>
            <div className="h-64 flex items-end justify-between gap-4">
              {chartData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-primary-100 rounded-t-lg relative" style={{ height: `${(parseInt(data.revenue.toString()) / 5000) * 100}%` }}>
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                      {data.revenue}
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 mt-2">{data.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sipariş Durumu</h3>
            <div className="space-y-4">
              {ordersByStatus.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.status}</span>
                    <span className="text-sm text-gray-600">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        item.status === 'Tamamlandı' ? 'bg-green-500' :
                        item.status === 'İşlemde' ? 'bg-yellow-500' :
                        item.status === 'Beklemede' ? 'bg-blue-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow p-6">
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
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topProducts.map((product, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.sales}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {product.revenue}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="flex items-center text-green-600">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          <span className="text-sm">+12%</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}