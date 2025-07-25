'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Plus,
  Save,
  AlertCircle,
  Bold,
  Italic,
  List,
  Link as LinkIcon
} from 'lucide-react'
import Image from 'next/image'

export default function NewProductPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountedPrice: '',
    stock: '',
    sku: '',
    status: 'active',
    features: ['']
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Production'da gerçek upload işlemi yapılacak
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImages([...images, reader.result as string])
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, '']
    })
  }

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData({ ...formData, features: newFeatures })
  }

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
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
      
      // Generate slug from name
      const slug = formData.name
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          slug,
          description: formData.description,
          shortDescription: formData.description.substring(0, 150).replace(/<[^>]*>/g, ''),
          price: parseFloat(formData.price),
          comparePrice: formData.discountedPrice ? parseFloat(formData.discountedPrice) : undefined,
          stock: parseInt(formData.stock),
          sku: formData.sku,
          status: formData.status.toUpperCase() as 'ACTIVE' | 'DRAFT',
          features: formData.features.filter(f => f.trim()),
          images: images
        })
      })
      
      if (!response.ok) {
        throw new Error('Ürün eklenemedi')
      }
      
      router.push('/admin/products')
    } catch (error) {
      console.error('Error creating product:', error)
      alert('Ürün eklenirken bir hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <header className="bg-white shadow">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/products"
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Yeni Ürün Ekle</h1>
              <p className="text-sm text-gray-600 mt-1">Ürün bilgilerini doldurun</p>
            </div>
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

      <div className="p-6">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sol Kolon - Ürün Bilgileri */}
            <div className="lg:col-span-2 space-y-6">
              {/* Temel Bilgiler */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Temel Bilgiler</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ürün Adı *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Örn: Oxiva Mıknatıslı Burun Bandı"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Açıklama * (HTML destekli)
                    </label>
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const selection = window.getSelection()?.toString() || ''
                            const newText = formData.description.replace(selection, `<strong>${selection}</strong>`)
                            setFormData({ ...formData, description: newText })
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
                            const newText = formData.description.replace(selection, `<em>${selection}</em>`)
                            setFormData({ ...formData, description: newText })
                          }}
                          className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                          title="İtalik"
                        >
                          <Italic className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, description: formData.description + '<ul>\n<li></li>\n</ul>' })
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
                              const newText = formData.description.replace(selection, `<a href="${url}" target="_blank">${selection}</a>`)
                              setFormData({ ...formData, description: newText })
                            }
                          }}
                          className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                          title="Link"
                        >
                          <LinkIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={6}
                        className="w-full px-4 py-3 focus:ring-0 focus:outline-none"
                        placeholder="Ürün açıklamasını girin... HTML etiketleri kullanabilirsiniz."
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Desteklenen HTML etiketleri: &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;a&gt;, &lt;p&gt;, &lt;br&gt;
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU (Stok Kodu)
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="OXV-001"
                    />
                  </div>
                </div>
              </div>

              {/* Ürün Görselleri */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ürün Görselleri</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={image}
                        alt={`Ürün ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  <label className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Görsel Ekle</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  PNG, JPG, WEBP formatında maksimum 5MB
                </p>
              </div>

              {/* Özellikler */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ürün Özellikleri</h3>
                
                <div className="space-y-3">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Özellik girin..."
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addFeature}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                    Özellik Ekle
                  </button>
                </div>
              </div>
            </div>

            {/* Sağ Kolon - Fiyat ve Stok */}
            <div className="space-y-6">
              {/* Fiyat Bilgileri */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Fiyat Bilgileri</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Normal Fiyat (₺) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="499.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İndirimli Fiyat (₺)
                    </label>
                    <input
                      type="number"
                      value={formData.discountedPrice}
                      onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="449.00"
                    />
                  </div>
                  
                  {formData.price && formData.discountedPrice && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-800">
                        <span className="font-medium">İndirim Oranı:</span>{' '}
                        %{Math.round(((parseFloat(formData.price) - parseFloat(formData.discountedPrice)) / parseFloat(formData.price)) * 100)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Stok Bilgileri */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Stok Bilgileri</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stok Adedi *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ürün Durumu
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="active">Aktif</option>
                      <option value="inactive">Pasif</option>
                    </select>
                  </div>
                  
                  {parseInt(formData.stock) < 20 && formData.stock && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                      <p className="text-sm text-yellow-800">
                        Düşük stok uyarısı! Stok seviyesi 20&apos;nin altında.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}