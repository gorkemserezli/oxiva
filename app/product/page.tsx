'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, Shield, Truck, RefreshCw, Star, Minus, Plus, Share2, Facebook, Twitter } from 'lucide-react'
import ProductImage from '@/components/ui/ProductImage'
import ProductImageZoom from '@/components/ui/ProductImageZoom'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import ProductTabs from '@/components/sections/ProductTabs'

export default function ProductPage() {
  const [selectedImage, setSelectedImage] = useState(0)
  const { quantity, setQuantity, discountedPrice, price: originalPrice } = useCart()
  const router = useRouter()
  
  // Placeholder images - gerçek görseller gelince güncellenecek
  const productImages = [
    { id: 0, alt: "Oxiva Mıknatıslı Burun Bandı - Önden Görünüm" },
    { id: 1, alt: "Oxiva Mıknatıslı Burun Bandı - Yandan Görünüm" },
    { id: 2, alt: "Oxiva Mıknatıslı Burun Bandı - Kullanım" },
    { id: 3, alt: "Oxiva Mıknatıslı Burun Bandı - Paket İçeriği" }
  ]

  const features = [
    "Medikal silikon malzeme",
    "BPA içermez",
    "Yıkanabilir ve tekrar kullanılabilir",
    "Tek beden - herkese uygun",
    "3-6 ay kullanım ömrü",
    "Ciltte tahriş yapmaz"
  ]

  const handleQuantityChange = (action: 'increase' | 'decrease') => {
    if (action === 'increase') {
      setQuantity(prev => prev + 1)
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const savings = originalPrice - discountedPrice
  
  const handleBuyNow = () => {
    router.push('/checkout')
  }

  return (
    <div className="min-h-screen bg-white pb-20 lg:pb-0">
      {/* Product Section */}
      <section className="py-12">
        <div className="container-max section-padding">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gray-50 rounded-2xl overflow-hidden mb-6">
                <ProductImageZoom className="w-full aspect-square" />
              </div>
              
              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-4">
                {productImages.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.id)}
                    className={`bg-gray-50 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === img.id ? 'border-primary-500' : 'border-transparent'
                    }`}
                  >
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Title & Rating */}
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Oxiva Mıknatıslı Burun Bandı
                </h1>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-gray-600">(2000+ değerlendirme)</span>
                  </div>
                  
                  {/* Social Share */}
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <Share2 className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <Facebook className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <Twitter className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6 bg-gray-50 rounded-xl p-6">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-primary-600">₺{discountedPrice}</span>
                  <span className="text-2xl text-gray-400 line-through">₺{originalPrice}</span>
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    %20 İNDİRİM
                  </span>
                </div>
                <p className="text-green-600 font-medium mt-2">₺{savings} tasarruf ediyorsunuz!</p>
                
                {/* Stock Status */}
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <p className="text-orange-600 font-medium">Son 15 adet! Acele edin!</p>
                </div>
              </div>

              {/* Delivery Date */}
              <div className="mb-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium">
                      Bugün sipariş verirseniz{' '}
                      <span className="font-bold">
                        {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'long',
                          weekday: 'long'
                        })}
                      </span>{' '}
                      günü elinizde!
                    </p>
                    <p className="text-xs text-blue-600 mt-1">Ücretsiz kargo ile gönderilir</p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Ürün Özellikleri</h3>
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4">
                  <span className="font-medium">Adet:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange('decrease')}
                      className="p-3 hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 font-medium">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange('increase')}
                      className="p-3 hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {quantity > 1 && (
                    <span className="text-green-600 font-medium">
                      Toplam: ₺{discountedPrice * quantity}
                    </span>
                  )}
                </div>

                <button
                  onClick={handleBuyNow}
                  className="block w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white text-center py-4 rounded-full hover:from-primary-600 hover:to-primary-700 transition-all transform hover:scale-105 shadow-lg font-semibold text-lg"
                >
                  Hemen Satın Al
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-200">
                <div className="flex flex-col items-center text-center">
                  <Shield className="w-8 h-8 text-primary-500 mb-2" />
                  <span className="text-sm text-gray-700">Güvenli Ödeme</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Truck className="w-8 h-8 text-primary-500 mb-2" />
                  <span className="text-sm text-gray-700">Ücretsiz Kargo</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <RefreshCw className="w-8 h-8 text-primary-500 mb-2" />
                  <span className="text-sm text-gray-700">30 Gün İade</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="py-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Güvenli ödeme seçenekleri:</p>
                <div className="flex items-center gap-4 flex-wrap">
                  {/* Mastercard */}
                  <div className="bg-gray-100 px-3 py-2 rounded">
                    <svg className="h-6" viewBox="0 0 48 32" fill="none">
                      <rect width="48" height="32" rx="4" fill="#EB001B"/>
                      <rect x="20" width="28" height="32" rx="4" fill="#F79E1B"/>
                      <path d="M24 22C27.866 22 31 18.866 31 15C31 11.134 27.866 8 24 8C20.134 8 17 11.134 17 15C17 18.866 20.134 22 24 22Z" fill="#FF5F00"/>
                    </svg>
                  </div>
                  {/* Visa */}
                  <div className="bg-gray-100 px-3 py-2 rounded">
                    <svg className="h-6" viewBox="0 0 48 32" fill="none">
                      <rect width="48" height="32" rx="4" fill="#1A1F71"/>
                      <path d="M20 11L16 21H13L17 11H20Z" fill="white"/>
                      <path d="M21 11L25 21H28L24 11H21Z" fill="white"/>
                      <path d="M32 11C30 11 29 12 29 13C29 14 30 15 31 15C32 15 33 16 33 17C33 18 32 19 30 19L31 21C34 21 36 19 36 17C36 15 34 14 33 14C32 14 31 13 31 13C31 12 32 11 33 11L32 11Z" fill="white"/>
                      <path d="M35 11L38 21H41L38 11H35Z" fill="white"/>
                    </svg>
                  </div>
                  {/* Troy */}
                  <div className="bg-gray-100 px-3 py-2 rounded">
                    <span className="text-blue-600 font-bold text-sm">TROY</span>
                  </div>
                  {/* SSL */}
                  <div className="bg-gray-100 px-3 py-2 rounded flex items-center gap-1">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-medium text-gray-700">256-bit SSL</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Tabs */}
      <ProductTabs />

      {/* Related Products / CTA */}
      <section className="py-12">
        <div className="container-max section-padding text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Horlama Problemine Son Verin!
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Binlerce kişi Oxiva ile rahat nefes alıyor ve kaliteli uyuyor. 
            Siz de bu mutlu müşterilerimizden biri olun!
          </p>
          <Link
            href="/checkout"
            className="inline-flex items-center bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-full hover:from-primary-600 hover:to-primary-700 transition-all transform hover:scale-105 shadow-lg font-semibold text-lg"
          >
            Şimdi Satın Al - ₺{discountedPrice}
          </Link>
        </div>
      </section>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500 line-through">₺{originalPrice}</p>
            <p className="text-2xl font-bold text-primary-600">₺{discountedPrice}</p>
          </div>
          <button
            onClick={handleBuyNow}
            className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-6 rounded-full font-semibold shadow-md active:scale-95 transition-transform"
          >
            Hemen Satın Al
          </button>
        </div>
      </div>
    </div>
  )
}