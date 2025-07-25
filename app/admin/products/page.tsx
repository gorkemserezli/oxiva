'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, Package, Loader2, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  stock: number
  status: string
  images: string[]
  _count: {
    orderItems: number
  }
  createdAt: string
}

interface ProductsResponse {
  products: Product[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (!auth) {
      router.push('/admin/login')
      return
    }
    fetchProducts()
  }, [router, page, searchTerm, statusFilter])
  
  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError('')
      
      const auth = localStorage.getItem('adminAuth')
      if (!auth) return
      
      const { token } = JSON.parse(auth)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search: searchTerm,
        status: statusFilter
      })
      
      const response = await fetch(`/api/admin/products?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Ürünler yüklenemedi')
      }
      
      const data: ProductsResponse = await response.json()
      setProducts(data.products)
      setTotalPages(data.pagination.pages)
      setTotal(data.pagination.total)
    } catch (err) {
      setError('Ürünler yüklenirken hata oluştu')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      try {
        const auth = localStorage.getItem('adminAuth')
        if (!auth) return
        
        const { token } = JSON.parse(auth)
        const response = await fetch(`/api/admin/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Ürün silinemedi')
        }
        
        fetchProducts()
      } catch (err) {
        console.error('Error deleting product:', err)
      }
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const auth = localStorage.getItem('adminAuth')
      if (!auth) return
      
      const newStatus = currentStatus === 'ACTIVE' ? 'DRAFT' : 'ACTIVE'
      const { token } = JSON.parse(auth)
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (!response.ok) {
        throw new Error('Durum güncellenemedi')
      }
      
      fetchProducts()
    } catch (err) {
      console.error('Error updating product status:', err)
    }
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <header className="bg-white shadow">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ürünler</h1>
            <p className="text-sm text-gray-600 mt-1">Ürünleri yönetin</p>
          </div>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-5 h-5" />
            Yeni Ürün
          </Link>
        </div>
      </header>

      <div className="p-6">
        {/* Error State */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}
        
        {/* Search and Filters */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Ürün adı veya SKU ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="ACTIVE">Aktif</option>
              <option value="DRAFT">Taslak</option>
              <option value="ARCHIVED">Arşivlenmiş</option>
            </select>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Ürün</p>
                <p className="text-2xl font-bold text-gray-900">{total}</p>
              </div>
              <Package className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aktif Ürünler</p>
                <p className="text-2xl font-bold text-green-600">
                  {products.filter(p => p.status === 'ACTIVE').length}
                </p>
              </div>
              <Eye className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Stok</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.reduce((sum, p) => sum + p.stock, 0)}
                </p>
              </div>
              <Package className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ortalama Fiyat</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.length > 0 ? formatCurrency(products.reduce((sum, p) => sum + p.price, 0) / products.length) : '₺0'}
                </p>
              </div>
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        {/* Products Table */}
        {products.length === 0 && !loading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ürün bulunamadı</h3>
            <p className="text-sm text-gray-600">
              {searchTerm ? 'Arama kriterlerinize uygun ürün bulunamadı.' : 'Henüz ürün bulunmuyor.'}
            </p>
          </div>
        ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ürün
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fiyat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stok
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">SKU: {product.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.comparePrice ? (
                        <>
                          <span className="line-through text-gray-500">{formatCurrency(product.comparePrice)}</span>
                          <span className="ml-2 font-medium">{formatCurrency(product.price)}</span>
                        </>
                      ) : (
                        <span className="font-medium">{formatCurrency(product.price)}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className={`font-medium ${product.stock < 50 ? 'text-red-600' : 'text-green-600'}`}>
                        {product.stock} adet
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(product.id, product.status)}
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer ${
                        product.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : product.status === 'DRAFT'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.status === 'ACTIVE' ? 'Aktif' : product.status === 'DRAFT' ? 'Taslak' : 'Arşiv'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Düzenle"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Sil"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-700">
              Toplam <span className="font-medium">{total}</span> üründen{' '}
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