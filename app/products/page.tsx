'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Search, Filter } from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  shortDescription?: string
  price: number
  comparePrice?: number
  stock: number
  images: string[]
  _count: {
    orderItems: number
  }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'priceAsc':
        return a.price - b.price
      case 'priceDesc':
        return b.price - a.price
      case 'popular':
        return b._count.orderItems - a._count.orderItems
      default: // newest
        return 0
    }
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2
    }).format(price)
  }

  const calculateDiscount = (price: number, comparePrice: number) => {
    return Math.round(((comparePrice - price) / comparePrice) * 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ürünlerimiz</h1>
          <p className="text-gray-600">
            {products.length} ürün listeleniyor
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="newest">En Yeni</option>
              <option value="priceAsc">Fiyat (Düşük - Yüksek)</option>
              <option value="priceDesc">Fiyat (Yüksek - Düşük)</option>
              <option value="popular">En Popüler</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Ürün bulunamadı</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  {product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">Görsel yok</span>
                    </div>
                  )}
                  
                  {product.comparePrice && product.comparePrice > product.price && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                      %{calculateDiscount(product.price, product.comparePrice)} İndirim
                    </div>
                  )}
                  
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold">Stokta Yok</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  {product.shortDescription && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {product.shortDescription}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      {product.comparePrice && product.comparePrice > product.price && (
                        <p className="text-sm text-gray-500 line-through">
                          {formatPrice(product.comparePrice)}
                        </p>
                      )}
                      <p className="text-lg font-bold text-primary-600">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                    
                    <button
                      className={`p-2 rounded-lg transition-colors ${
                        product.stock > 0
                          ? 'bg-primary-600 text-white hover:bg-primary-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={product.stock === 0}
                      onClick={(e) => {
                        e.preventDefault()
                        if (product.stock > 0) {
                          // Add to cart logic here
                        }
                      }}
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}