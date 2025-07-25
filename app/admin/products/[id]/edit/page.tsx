'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  X, 
  Plus,
  Trash2,
  AlertCircle,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Loader2
} from 'lucide-react'
import Image from 'next/image'

interface ProductForm {
  name: string
  description: string
  shortDescription: string
  price: number
  comparePrice: number
  stock: number
  sku: string
  status: 'active' | 'draft' | 'archived'
  images: string[]
  features: string[]
  seoTitle: string
  seoDescription: string
  seoKeywords: string
}

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [product, setProduct] = useState<ProductForm>({
    name: '',
    description: '',
    shortDescription: '',
    price: 0,
    comparePrice: 0,
    stock: 0,
    sku: '',
    status: 'active',
    images: [],
    features: [],
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  })

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const auth = localStorage.getItem('adminAuth')
        if (!auth) {
          router.push('/admin/login')
          return
        }
        
        const { token } = JSON.parse(auth)
        const response = await fetch(`/api/admin/products/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Ürün bulunamadı')
        }
        
        const data = await response.json()
        setProduct({
          name: data.name,
          description: data.description || '',
          shortDescription: data.shortDescription || '',
          price: data.price,
          comparePrice: data.comparePrice || 0,
          stock: data.stock,
          sku: data.sku || '',
          status: data.status.toLowerCase() as 'active' | 'draft' | 'archived',
          images: data.images || [],
          features: data.features || [],
          seoTitle: data.seoTitle || '',
          seoDescription: data.seoDescription || '',
          seoKeywords: data.seoKeywords || ''
        })
      } catch (error) {
        console.error('Error fetching product:', error)
        alert('Ürün yüklenirken hata oluştu')
        router.push('/admin/products')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProduct()
  }, [params.id, router])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      // Production'da gerçek upload işlemi yapılacak
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setProduct({ ...product, images: [...product.images, ...newImages] })
    }
  }

  const removeImage = (index: number) => {
    setProduct({
      ...product,
      images: product.images.filter((_, i) => i !== index)
    })
  }

  const addFeature = () => {
    setProduct({
      ...product,
      features: [...product.features, '']
    })
  }

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...product.features]
    newFeatures[index] = value
    setProduct({ ...product, features: newFeatures })
  }

  const removeFeature = (index: number) => {
    setProduct({
      ...product,
      features: product.features.filter((_, i) => i !== index)
    })
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const auth = localStorage.getItem('adminAuth')
      if (!auth) {
        router.push('/admin/login')
        return
      }
      
      const { token } = JSON.parse(auth)
      
      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: product.name,
          description: product.description,
          shortDescription: product.shortDescription,
          price: product.price,
          comparePrice: product.comparePrice || undefined,
          stock: product.stock,
          sku: product.sku,
          status: product.status.toUpperCase() as 'ACTIVE' | 'DRAFT' | 'ARCHIVED',
          features: product.features.filter(f => f.trim()),
          images: product.images,
          seoTitle: product.seoTitle,
          seoDescription: product.seoDescription,
          seoKeywords: product.seoKeywords
        })
      })
      
      if (!response.ok) {
        throw new Error('Ürün güncellenemedi')
      }
      
      router.push('/admin/products')
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Ürün güncellenirken bir hata oluştu')
    } finally {
      setSaving(false)
    }
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
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/products"
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Ürün Düzenle</h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Temel Bilgiler */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Temel Bilgiler</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ürün Adı <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={product.name}
                  onChange={(e) => setProduct({...product, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kısa Açıklama</label>
                <input
                  type="text"
                  value={product.shortDescription}
                  onChange={(e) => setProduct({...product, shortDescription: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ürün listelerinde görünecek kısa açıklama"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Detaylı Açıklama (HTML destekli)</label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const selection = window.getSelection()?.toString() || ''
                        const newText = product.description.replace(selection, `<strong>${selection}</strong>`)
                        setProduct({ ...product, description: newText })
                      }}
                      className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                      title="Kalın"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const selection = window.getSelection()?.toString() || ''
                        const newText = product.description.replace(selection, `<em>${selection}</em>`)
                        setProduct({ ...product, description: newText })
                      }}
                      className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                      title="İtalik"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProduct({ ...product, description: product.description + '<ul>\n<li></li>\n</ul>' })
                      }}
                      className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                      title="Liste"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const url = prompt('Link URL:')
                        if (url) {
                          const selection = window.getSelection()?.toString() || 'Link'
                          const newText = product.description.replace(selection, `<a href="${url}" target="_blank">${selection}</a>`)
                          setProduct({ ...product, description: newText })
                        }
                      }}
                      className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                      title="Link"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={product.description}
                    onChange={(e) => setProduct({...product, description: e.target.value})}
                    className="w-full px-4 py-3 focus:ring-0 focus:outline-none"
                    placeholder="Ürün açıklamasını girin... HTML etiketleri kullanabilirsiniz."
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Desteklenen HTML etiketleri: &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;a&gt;, &lt;p&gt;, &lt;br&gt;
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fiyat <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₺</span>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={product.price}
                      onChange={(e) => setProduct({...product, price: parseFloat(e.target.value)})}
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">İndirimli Fiyat</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₺</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={product.comparePrice}
                      onChange={(e) => setProduct({...product, comparePrice: parseFloat(e.target.value)})}
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                  <input
                    type="number"
                    min="0"
                    value={product.stock}
                    onChange={(e) => setProduct({...product, stock: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Stok Kodu)</label>
                <input
                  type="text"
                  value={product.sku}
                  onChange={(e) => setProduct({...product, sku: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="OXV-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                <select
                  value={product.status}
                  onChange={(e) => setProduct({...product, status: e.target.value as any})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="active">Aktif</option>
                  <option value="draft">Taslak</option>
                  <option value="archived">Arşivlenmiş</option>
                </select>
              </div>
            </div>
          </div>

          {/* Görseller */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ürün Görselleri</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={image}
                      alt={`Product ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-600">Görsel Ekle</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              
              <p className="text-sm text-gray-500">
                <AlertCircle className="inline w-4 h-4 mr-1" />
                Önerilen boyut: 800x800px, Maksimum: 5MB
              </p>
            </div>
          </div>

          {/* Özellikler */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ürün Özellikleri</h2>
            
            <div className="space-y-3">
              {product.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Özellik girin"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <Plus className="w-5 h-5" />
                Özellik Ekle
              </button>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO Ayarları</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Başlığı</label>
                <input
                  type="text"
                  value={product.seoTitle}
                  onChange={(e) => setProduct({...product, seoTitle: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Arama motorlarında görünecek başlık"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Açıklaması</label>
                <textarea
                  rows={3}
                  value={product.seoDescription}
                  onChange={(e) => setProduct({...product, seoDescription: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Arama motorlarında görünecek açıklama"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Anahtar Kelimeler</label>
                <input
                  type="text"
                  value={product.seoKeywords}
                  onChange={(e) => setProduct({...product, seoKeywords: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Virgülle ayrılmış anahtar kelimeler"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link
              href="/admin/products"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <X className="w-5 h-5" />
              İptal
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}