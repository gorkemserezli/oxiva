'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MapPin, 
  ShoppingBag,
  Calendar,
  MoreVertical,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Users
} from 'lucide-react'

interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: string
  emailVerified: boolean
  createdAt: string
  orders: {
    id: string
    orderNumber: string
    total: number
    status: string
    createdAt: string
  }[]
  _count: {
    orders: number
    addresses: number
  }
  totalSpent: number
  averageOrderValue: number
  lastOrderDate?: string
}

interface CustomersResponse {
  customers: Customer[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

export default function AdminCustomersPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (!auth) {
      router.push('/admin/login')
      return
    }
    fetchCustomers()
  }, [router, page, searchTerm])
  
  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError('')
      
      const auth = localStorage.getItem('adminAuth')
      if (!auth) return
      
      const { token } = JSON.parse(auth)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search: searchTerm
      })
      
      const response = await fetch(`/api/admin/customers?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Müşteriler yüklenemedi')
      }
      
      const data: CustomersResponse = await response.json()
      setCustomers(data.customers)
      setTotalPages(data.pagination.pages)
      setTotal(data.pagination.total)
    } catch (err) {
      setError('Müşteriler yüklenirken hata oluştu')
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Dün'
    if (diffDays < 7) return `${diffDays} gün önce`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} ay önce`
    return date.toLocaleDateString('tr-TR')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <header className="bg-white shadow">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Müşteriler</h1>
            <p className="text-sm text-gray-600 mt-1">Toplam {total} müşteri</p>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="İsim, email veya telefon ile ara..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setPage(1)
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
        
        {/* Error State */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Customers Grid */}
        {customers.length === 0 && !loading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Müşteri bulunamadı</h3>
            <p className="text-sm text-gray-600">
              {searchTerm ? 'Arama kriterlerinize uygun müşteri bulunamadı.' : 'Henüz müşteri bulunmuyor.'}
            </p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <div key={customer.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{customer.firstName} {customer.lastName}</h3>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                      customer.emailVerified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {customer.emailVerified ? 'Doğrulanmış' : 'Doğrulanmamış'}
                    </span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{customer.email}</span>
                  </div>
                  {customer.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{customer._count.addresses} adres</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <div className="flex items-center gap-1 text-gray-500 mb-1">
                      <ShoppingBag className="w-4 h-4" />
                      <span className="text-xs">Siparişler</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{customer._count.orders}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-gray-500 mb-1">
                      <span className="text-xs">Toplam Harcama</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(customer.totalSpent)}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Son sipariş: {customer.lastOrderDate ? formatDate(customer.lastOrderDate) : 'Yok'}</span>
                  </div>
                  <span>Üye: {formatDate(customer.createdAt)}</span>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium">
                    Detaylar
                  </button>
                  <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
                    Mesaj Gönder
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-700">
              Toplam <span className="font-medium">{total}</span> müşteriden{' '}
              <span className="font-medium">{(page - 1) * 10 + 1}</span> -{' '}
              <span className="font-medium">{Math.min(page * 10, total)}</span> arası gösteriliyor
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      page === pageNum
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}