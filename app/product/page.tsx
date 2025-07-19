'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, Shield, Truck, RefreshCw, Minus, Plus } from 'lucide-react'
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
      setQuantity(quantity + 1)
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1)
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

                <a
                  href={`https://wa.me/905555555555?text=Merhaba, Oxiva Mıknatıslı Burun Bandı (${quantity} adet) sipariş vermek istiyorum. Toplam tutar: ₺${discountedPrice * quantity}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-green-500 text-white text-center py-4 rounded-full hover:bg-green-600 transition-all transform hover:scale-105 shadow-lg font-semibold text-lg flex items-center justify-center gap-2"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z"/>
                  </svg>
                  WhatsApp ile Sipariş Ver
                </a>
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
                  <div className="bg-white px-4 py-3 rounded border border-gray-200 flex items-center h-12">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                      alt="Mastercard"
                      className="h-5 w-auto"
                    />
                  </div>
                  {/* Visa */}
                  <div className="bg-white px-4 py-3 rounded border border-gray-200 flex items-center h-12">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                      alt="Visa"
                      className="h-5 w-auto"
                    />
                  </div>
                  {/* Troy */}
                  <div className="bg-white px-4 py-3 rounded border border-gray-200 flex items-center h-12">
                    <img 
                      src="/images/troy.png"
                      alt="Troy"
                      className="h-4 w-auto"
                    />
                  </div>
                  {/* SSL */}
                  <div className="bg-white px-4 py-3 rounded border border-gray-200 flex items-center gap-1.5 h-12">
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