'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { ChevronLeft, Lock, CreditCard, Truck, Shield, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface FormData {
  // Kişisel Bilgiler
  firstName: string
  lastName: string
  email: string
  phone: string
  tcNo: string
  
  // Teslimat Adresi
  address: string
  city: string
  district: string
  zipCode: string
  
  // Fatura Adresi
  sameAsDelivery: boolean
  billingAddress?: string
  billingCity?: string
  billingDistrict?: string
  billingZipCode?: string
  
  // Ödeme
  cardNumber: string
  cardName: string
  expiryDate: string
  cvv: string
  
  // Sözleşmeler
  termsAccepted: boolean
  marketingAccepted: boolean
}

export default function CheckoutPage() {
  const router = useRouter()
  const { quantity, discountedPrice, price: originalPrice } = useCart()
  const [activeStep, setActiveStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    tcNo: '',
    address: '',
    city: '',
    district: '',
    zipCode: '',
    sameAsDelivery: true,
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    termsAccepted: false,
    marketingAccepted: false
  })

  const steps = [
    { id: 1, name: 'Kişisel Bilgiler', icon: CheckCircle },
    { id: 2, name: 'Teslimat Adresi', icon: Truck },
    { id: 3, name: 'Ödeme Bilgileri', icon: CreditCard }
  ]

  const subtotal = discountedPrice * quantity
  const shipping = 0 // Ücretsiz kargo
  const total = subtotal + shipping

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleNextStep = () => {
    if (activeStep < 3) {
      setActiveStep(activeStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Burada ödeme işlemi yapılacak
    console.log('Form submitted:', formData)
    // Başarılı ödeme sonrası yönlendirme
    router.push('/success')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-max section-padding">
        {/* Back Button */}
        <Link 
          href="/product"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Ürüne Geri Dön
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            {/* Steps */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center ${index !== steps.length - 1 ? 'flex-1' : ''}`}>
                      <div 
                        className={`flex items-center justify-center w-10 h-10 rounded-full ${
                          activeStep >= step.id 
                            ? 'bg-primary-500 text-white' 
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {activeStep > step.id ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <span className="text-sm font-medium">{step.id}</span>
                        )}
                      </div>
                      <span className={`ml-3 text-sm font-medium ${
                        activeStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.name}
                      </span>
                    </div>
                    {index !== steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-4 ${
                        activeStep > step.id ? 'bg-primary-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
              {/* Step 1: Personal Info */}
              {activeStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold mb-6">Kişisel Bilgiler</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ad *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Soyad *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        E-posta *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefon *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="5XX XXX XX XX"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        TC Kimlik No *
                      </label>
                      <input
                        type="text"
                        name="tcNo"
                        value={formData.tcNo}
                        onChange={handleInputChange}
                        maxLength={11}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Delivery Address */}
              {activeStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold mb-6">Teslimat Adresi</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Açık Adres *
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          İl *
                        </label>
                        <select
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        >
                          <option value="">Seçiniz</option>
                          <option value="istanbul">İstanbul</option>
                          <option value="ankara">Ankara</option>
                          <option value="izmir">İzmir</option>
                          {/* Diğer iller eklenecek */}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          İlçe *
                        </label>
                        <input
                          type="text"
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Posta Kodu
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div className="pt-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="sameAsDelivery"
                          checked={formData.sameAsDelivery}
                          onChange={handleInputChange}
                          className="mr-2 rounded text-primary-500 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">
                          Fatura adresim teslimat adresimle aynı
                        </span>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {activeStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold mb-6">Ödeme Bilgileri</h2>
                  
                  {/* Security Notice */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <Lock className="w-5 h-5 text-green-600 mr-2" />
                      <p className="text-sm text-green-800">
                        Ödeme bilgileriniz 256-bit SSL sertifikası ile korunmaktadır.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kart Numarası *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kart Üzerindeki İsim *
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Son Kullanma Tarihi *
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="AA/YY"
                          maxLength={5}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV *
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          maxLength={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="space-y-3 pt-4">
                      <label className="flex items-start">
                        <input
                          type="checkbox"
                          name="termsAccepted"
                          checked={formData.termsAccepted}
                          onChange={handleInputChange}
                          className="mr-2 mt-1 rounded text-primary-500 focus:ring-primary-500"
                          required
                        />
                        <span className="text-sm text-gray-700">
                          <Link href="/terms" className="text-primary-500 hover:underline">
                            Satış sözleşmesi
                          </Link>
                          {' '}ve{' '}
                          <Link href="/privacy" className="text-primary-500 hover:underline">
                            gizlilik politikasını
                          </Link>
                          {' '}okudum, kabul ediyorum. *
                        </span>
                      </label>
                      <label className="flex items-start">
                        <input
                          type="checkbox"
                          name="marketingAccepted"
                          checked={formData.marketingAccepted}
                          onChange={handleInputChange}
                          className="mr-2 mt-1 rounded text-primary-500 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">
                          Kampanya ve yeniliklerden haberdar olmak istiyorum.
                        </span>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className={`px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 ${
                    activeStep === 1 ? 'invisible' : ''
                  }`}
                >
                  Geri
                </button>
                {activeStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                  >
                    Devam Et
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 font-semibold"
                  >
                    Siparişi Tamamla
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-32">
              <h3 className="text-lg font-semibold mb-4">Sipariş Özeti</h3>
              
              {/* Product */}
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src="/images/logo.png"
                    alt="Oxiva"
                    width={80}
                    height={80}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Oxiva Mıknatıslı Burun Bandı</h4>
                  <p className="text-sm text-gray-600">Adet: {quantity}</p>
                </div>
                <p className="font-semibold">₺{subtotal}</p>
              </div>

              {/* Summary */}
              <div className="space-y-3 py-4 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ara Toplam</span>
                  <span>₺{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kargo</span>
                  <span className="text-green-600">Ücretsiz</span>
                </div>
                {quantity > 1 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Toplu Alım İndirimi</span>
                    <span className="text-green-600">-₺{(originalPrice - discountedPrice) * quantity}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center py-4">
                <span className="text-lg font-semibold">Toplam</span>
                <span className="text-2xl font-bold text-primary-600">₺{total}</span>
              </div>

              {/* Security Badges */}
              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-2 gap-4 text-center text-sm">
                  <div className="flex flex-col items-center">
                    <Shield className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-gray-600">Güvenli Ödeme</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Truck className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-gray-600">Hızlı Teslimat</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}