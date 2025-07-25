'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { ChevronLeft, ChevronRight, Lock, CreditCard as CreditCardIcon, Truck, Shield, CheckCircle, AlertCircle, Loader2, Tag, X, Building2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { addressService, type City, type District } from '@/utils/addressService'
import { 
  validateTCKimlikNo, 
  validateEmail, 
  validatePhone, 
  validateCardNumber, 
  validateCVV, 
  validateExpiryDate, 
  validateTaxNumber, 
  validateName, 
  validateAddress,
  validationMessages 
} from '@/utils/validation'
import CreditCard from '@/components/CreditCard'
import PayTRIframe from '@/components/PayTRIframe'

interface FormData {
  // Kişisel Bilgiler
  firstName: string
  lastName: string
  email: string
  phone: string
  
  // Teslimat Adresi
  address: string
  city: string
  district: string
  
  // Fatura Bilgileri
  sameAsDelivery: boolean
  invoiceType?: 'individual' | 'corporate'
  billingTitle?: string
  billingTcNo?: string
  billingTaxNo?: string
  billingTaxOffice?: string
  billingAddress?: string
  billingCity?: string
  billingDistrict?: string
  
  // Ödeme
  cardNumber: string
  cardName: string
  expiryDate: string
  cvv: string
  
  // Sözleşmeler
  termsAccepted: boolean
  marketingAccepted: boolean
  
  // Sipariş Notu
  orderNote?: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { quantity, discountedPrice, price: originalPrice, product } = useCart()
  const [activeStep, setActiveStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isCardFlipped, setIsCardFlipped] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showMobileOrderSummary, setShowMobileOrderSummary] = useState(false)
  const [paytrToken, setPaytrToken] = useState('')
  const [showPaytrIframe, setShowPaytrIframe] = useState(false)
  
  // Payment method states
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('creditCard')
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(true)
  
  // Address data states
  const [cities, setCities] = useState<City[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  
  // Billing address states
  const [billingDistricts, setBillingDistricts] = useState<District[]>([])
  const [loadingBillingDistricts, setLoadingBillingDistricts] = useState(false)
  
  // Discount code states
  const [discountCode, setDiscountCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number } | null>(null)
  const [applyingDiscount, setApplyingDiscount] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    // Dev amaçlı örnek bilgiler
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    email: 'ahmet.yilmaz@example.com',
    phone: '5551234567',
    address: 'Atatürk Mahallesi, Cumhuriyet Caddesi, No: 123, Daire: 4',
    city: '34', // İstanbul
    district: '',
    sameAsDelivery: true,
    invoiceType: 'individual',
    cardNumber: '4242 4242 4242 4242',
    cardName: 'AHMET YILMAZ',
    expiryDate: '12/25',
    cvv: '123',
    termsAccepted: false,
    marketingAccepted: false,
    orderNote: 'Kapıcıya bırakabilirsiniz.'
  })

  const steps = [
    { id: 1, name: 'Teslimat Bilgileri', icon: Truck },
    { id: 2, name: 'Ödeme Bilgileri', icon: CreditCardIcon }
  ]

  // Load cities on component mount
  useEffect(() => {
    const loadCities = async () => {
      const citiesData = await addressService.getCities()
      setCities(citiesData)
    }
    loadCities()
    
    // Load saved form data from localStorage
    const savedData = localStorage.getItem('checkoutFormData')
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setFormData(prev => ({ ...prev, ...parsed, termsAccepted: false, marketingAccepted: false }))
      } catch (e) {
        console.error('Error loading saved data:', e)
      }
    }
    
    // Load payment methods
    fetchPaymentMethods()
  }, [])
  
  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch('/api/payment-methods')
      if (response.ok) {
        const data = await response.json()
        setPaymentMethods(data.methods)
        if (data.defaultMethod) {
          setSelectedPaymentMethod(data.defaultMethod)
        }
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error)
    } finally {
      setLoadingPaymentMethods(false)
    }
  }
  
  // Save form data to localStorage on change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const { cardNumber: _, cvv: __, expiryDate: ___, ...dataToSave } = formData
      localStorage.setItem('checkoutFormData', JSON.stringify(dataToSave))
    }, 1000)
    
    return () => clearTimeout(timeoutId)
  }, [formData])

  // Load districts when city changes
  useEffect(() => {
    const loadDistricts = async () => {
      if (formData.city) {
        setLoadingDistricts(true)
        setDistricts([])
        setFormData(prev => ({ ...prev, district: '' }))
        
        const cityId = parseInt(formData.city)
        const districtsData = await addressService.getDistricts(cityId)
        setDistricts(districtsData)
        setLoadingDistricts(false)
      }
    }
    loadDistricts()
  }, [formData.city])

  // Load billing districts when billing city changes
  useEffect(() => {
    const loadBillingDistricts = async () => {
      if (formData.billingCity && !formData.sameAsDelivery) {
        setLoadingBillingDistricts(true)
        setBillingDistricts([])
        setFormData(prev => ({ ...prev, billingDistrict: '' }))
        
        const cityId = parseInt(formData.billingCity)
        const districtsData = await addressService.getDistricts(cityId)
        setBillingDistricts(districtsData)
        setLoadingBillingDistricts(false)
      }
    }
    loadBillingDistricts()
  }, [formData.billingCity, formData.sameAsDelivery])


  // Fiyatlar KDV dahil geldiği için önce KDV hariç fiyatı hesaplıyoruz
  const kdvRate = 0.20 // %20 KDV
  const priceWithoutKDV = discountedPrice / (1 + kdvRate) // Birim fiyat KDV hariç
  const subtotalWithoutKDV = priceWithoutKDV * quantity // Ara toplam KDV hariç
  
  const shipping = 0 // Ücretsiz kargo
  const discountAmount = appliedDiscount ? appliedDiscount.amount : 0
  
  // İndirim sonrası KDV hariç tutar
  const subtotalAfterDiscountWithoutKDV = subtotalWithoutKDV - (discountAmount / (1 + kdvRate))
  
  // KDV tutarı
  const kdvAmount = Math.round(subtotalAfterDiscountWithoutKDV * kdvRate * 100) / 100
  
  // Toplam (KDV dahil)
  const total = subtotalAfterDiscountWithoutKDV + kdvAmount + shipping

  // Apply discount code function
  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setErrors(prev => ({ ...prev, discountCode: 'Lütfen bir indirim kodu girin' }))
      return
    }

    setApplyingDiscount(true)
    setErrors(prev => ({ ...prev, discountCode: '' }))

    // Simulate API call to validate discount code
    setTimeout(() => {
      // Example discount codes
      const discountCodes: Record<string, number> = {
        'KARGO10': 10, // 10 TL discount
        'YILBASI20': 20, // 20 TL discount
        'OXIVA50': 50, // 50 TL discount
      }

      const discount = discountCodes[discountCode.toUpperCase()]
      
      if (discount) {
        setAppliedDiscount({ code: discountCode.toUpperCase(), amount: discount })
        setDiscountCode('')
        setErrors(prev => ({ ...prev, discountCode: '' }))
      } else {
        setErrors(prev => ({ ...prev, discountCode: 'Geçersiz indirim kodu' }))
      }
      
      setApplyingDiscount(false)
    }, 1000)
  }

  // Remove discount function
  const handleRemoveDiscount = () => {
    setAppliedDiscount(null)
    setDiscountCode('')
    setErrors(prev => ({ ...prev, discountCode: '' }))
  }

  // Validation functions
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        return validateName(value) ? '' : validationMessages.name;
      case 'email':
        return validateEmail(value) ? '' : validationMessages.email;
      case 'phone':
        return validatePhone(value) ? '' : validationMessages.phone;
      case 'billingTcNo':
        return validateTCKimlikNo(value) ? '' : validationMessages.tcNo;
      case 'billingTaxNo':
        return validateTaxNumber(value) ? '' : validationMessages.taxNumber;
      case 'address':
      case 'billingAddress':
        return validateAddress(value) ? '' : validationMessages.address;
      case 'cardNumber':
        return validateCardNumber(value) ? '' : validationMessages.cardNumber;
      case 'cvv':
        return validateCVV(value) ? '' : validationMessages.cvv;
      case 'expiryDate':
        return validateExpiryDate(value) ? '' : validationMessages.expiryDate;
      case 'city':
      case 'billingCity':
        return value ? '' : validationMessages.city;
      case 'district':
      case 'billingDistrict':
        return value ? '' : validationMessages.district;
      default:
        return value ? '' : validationMessages.required;
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Personal info validation
    if (!validateName(formData.firstName)) newErrors.firstName = validationMessages.name;
    if (!validateName(formData.lastName)) newErrors.lastName = validationMessages.name;
    if (!validateEmail(formData.email)) newErrors.email = validationMessages.email;
    if (!validatePhone(formData.phone)) newErrors.phone = validationMessages.phone;
    
    // Address validation
    if (!formData.city) newErrors.city = validationMessages.city;
    if (!formData.district) newErrors.district = validationMessages.district;
    if (!validateAddress(formData.address)) newErrors.address = validationMessages.address;
    
    // Billing validation if not same as delivery
    if (!formData.sameAsDelivery) {
      if (!formData.billingTitle) newErrors.billingTitle = validationMessages.required;
      if (!formData.billingCity) newErrors.billingCity = validationMessages.city;
      if (!formData.billingDistrict) newErrors.billingDistrict = validationMessages.district;
      if (!validateAddress(formData.billingAddress || '')) newErrors.billingAddress = validationMessages.address;
      if (!formData.billingTaxOffice) newErrors.billingTaxOffice = validationMessages.required;
      
      if (formData.invoiceType === 'individual') {
        if (!validateTCKimlikNo(formData.billingTcNo || '')) newErrors.billingTcNo = validationMessages.tcNo;
      } else {
        if (!validateTaxNumber(formData.billingTaxNo || '')) newErrors.billingTaxNo = validationMessages.taxNumber;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const v = value.replace(/[^0-9]/g, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '')
    }
    return v
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      let formattedValue = value
      
      // Format specific fields
      if (name === 'cardNumber') {
        formattedValue = formatCardNumber(value)
      } else if (name === 'expiryDate') {
        formattedValue = formatExpiryDate(value)
      } else if (name === 'cvv') {
        // Only allow digits for CVV
        formattedValue = value.replace(/[^0-9]/g, '')
      }
      
      setFormData(prev => ({ ...prev, [name]: formattedValue }))
      
      // Clear error on change
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }))
      }
      
      // Validate on blur
      const error = validateField(name, formattedValue);
      if (error) {
        setErrors(prev => ({ ...prev, [name]: error }))
      }
    }
  }

  const handleNextStep = () => {
    if (activeStep === 1) {
      if (validateStep1()) {
        setActiveStep(2)
        // Scroll to top when moving to next step
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  const handlePrevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1)
      // Scroll to top when moving to previous step
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate payment fields based on payment method
    const paymentErrors: Record<string, string> = {};
    
    if (selectedPaymentMethod === 'creditCard') {
      if (!validateCardNumber(formData.cardNumber)) paymentErrors.cardNumber = validationMessages.cardNumber;
      if (!validateName(formData.cardName)) paymentErrors.cardName = validationMessages.name;
      if (!validateExpiryDate(formData.expiryDate)) paymentErrors.expiryDate = validationMessages.expiryDate;
      if (!validateCVV(formData.cvv)) paymentErrors.cvv = validationMessages.cvv;
    }
    
    if (!formData.termsAccepted) paymentErrors.termsAccepted = 'Satış sözleşmesini kabul etmelisiniz';
    
    if (Object.keys(paymentErrors).length > 0) {
      setErrors(paymentErrors);
      return;
    }
    
    // Start processing
    setIsProcessing(true)
    
    try {
      if (!product) {
        throw new Error('Ürün bilgisi bulunamadı')
      }
      
      // Save form to localStorage
      localStorage.setItem('lastCheckoutData', JSON.stringify(formData))
      
      // Get city and district names
      const cityName = cities.find(c => c.id === parseInt(formData.city))?.name || ''
      const districtName = districts.find(d => d.id === parseInt(formData.district))?.name || ''
      
      // First create order in database
      const orderResponse = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // User data
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          
          // Delivery address
          address: formData.address,
          city: formData.city,
          district: formData.district,
          
          // Billing info
          sameAsDelivery: formData.sameAsDelivery,
          invoiceType: formData.invoiceType,
          billingTitle: formData.billingTitle,
          billingTcNo: formData.billingTcNo,
          billingTaxNo: formData.billingTaxNo,
          billingTaxOffice: formData.billingTaxOffice,
          billingAddress: formData.billingAddress,
          billingCity: formData.billingCity,
          billingDistrict: formData.billingDistrict,
          
          // Order details
          orderNote: formData.orderNote,
          productId: product.id,
          quantity,
          price: discountedPrice,
          discountCode: appliedDiscount?.code,
          discountAmount: appliedDiscount?.amount || 0,
          subtotal: subtotalAfterDiscountWithoutKDV,
          kdvAmount,
          shipping,
          total,
          paymentMethod: selectedPaymentMethod
        })
      })
      
      if (!orderResponse.ok) {
        const error = await orderResponse.json()
        throw new Error(error.error || 'Sipariş oluşturulamadı')
      }
      
      const orderResult = await orderResponse.json()
      
      // Save order ID for later use
      localStorage.setItem('currentOrderId', orderResult.orderId)
      localStorage.setItem('currentOrderNumber', orderResult.orderNumber)
      
      if (selectedPaymentMethod === 'creditCard') {
        // Prepare order data for PayTR
        const orderData = {
          email: formData.email,
          payment_amount: Math.round(total * 100), // PayTR expects amount in kuruş
          user_name: `${formData.firstName} ${formData.lastName}`,
          user_address: `${formData.address} ${districtName} ${cityName}`,
          user_phone: formData.phone,
          merchant_oid: orderResult.orderNumber, // Use order number from database
          user_basket: JSON.stringify([
            [product.name, `${discountedPrice.toFixed(2)}`, quantity]
          ]),
          debug_on: process.env.NODE_ENV === 'development' ? 1 : 0,
          test_mode: 1, // Set to 0 for production
          no_installment: 0,
          max_installment: 0,
          lang: 'tr'
        }
        
        // Call PayTR API
        const response = await fetch('/api/payment/paytr', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData)
        })
        
        const result = await response.json()
        
        if (result.status === 'success' && result.token) {
          // Show PayTR iframe
          setPaytrToken(result.token)
          setShowPaytrIframe(true)
        } else {
          throw new Error(result.reason || 'Ödeme başlatılamadı')
        }
      } else if (selectedPaymentMethod === 'bankTransfer') {
        // For bank transfer, redirect to order confirmation
        localStorage.removeItem('cart')
        router.push(`/order-confirmation?orderNumber=${orderResult.orderNumber}`)
      }
    } catch (error) {
      console.error('Payment error:', error)
      setErrors({ general: error instanceof Error ? error.message : 'Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.' })
    } finally {
      setIsProcessing(false)
    }
  }

  // Helper function to get field class with error state
  const getFieldClass = (fieldName: string) => {
    return `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
      errors[fieldName] ? 'border-red-500' : 'border-gray-300'
    }`
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Loading Overlay */}
      {isProcessing && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center space-y-4"
          >
            <div className="relative">
              <Loader2 className="w-16 h-16 text-primary-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Siparişiniz İşleniyor</h3>
            <p className="text-gray-600 text-center max-w-xs">
              Güvenli ödeme sistemi üzerinden işleminiz gerçekleştiriliyor. Lütfen bekleyin...
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Lock className="w-4 h-4" />
              <span>256-bit SSL ile korunuyor</span>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      <div className="container-max section-padding">
        {/* Back Button */}
        <Link 
          href="/product"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Ürüne Geri Dön
        </Link>

        {/* Mobile Order Summary Toggle */}
        <div className="lg:hidden mb-4 sticky top-[88px] z-10 bg-gray-50 -mx-4 px-4 py-3">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Toplam Tutar</p>
                <p className="text-xl font-bold text-primary-600">₺{total.toFixed(2)}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowMobileOrderSummary(!showMobileOrderSummary)}
                className="flex items-center gap-1 text-primary-600 hover:text-primary-700"
              >
                <span className="text-sm font-medium">Detaylar</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${showMobileOrderSummary ? 'rotate-90' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            {/* Steps */}
            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-8 mb-6">
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -translate-y-1/2" />
                <div 
                  className="absolute left-0 top-1/2 h-1 bg-primary-500 -translate-y-1/2 transition-all duration-500"
                  style={{ width: activeStep === 1 ? '0%' : '100%' }}
                />
                
                {/* Steps */}
                <div className="relative flex justify-between">
                  {steps.map((step) => {
                    const isActive = activeStep === step.id
                    const isCompleted = activeStep > step.id
                    
                    return (
                      <div key={step.id} className="flex flex-col items-center">
                        <motion.div
                          initial={{ scale: 1 }}
                          animate={{ 
                            scale: isActive ? 1.1 : 1,
                            transition: { duration: 0.3 }
                          }}
                          className={`
                            flex items-center justify-center w-14 h-14 rounded-full border-4
                            transition-all duration-300
                            ${isActive 
                              ? 'border-primary-500 shadow-lg bg-white' 
                              : isCompleted 
                                ? 'border-primary-500 bg-primary-500' 
                                : 'border-gray-300 bg-white'
                            }
                          `}
                        >
                          {isCompleted ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                              <CheckCircle className="w-6 h-6 text-white" />
                            </motion.div>
                          ) : step.id === 1 ? (
                            <Truck className={`w-6 h-6 ${
                              isActive ? 'text-primary-500' : 'text-gray-400'
                            }`} />
                          ) : (
                            <CreditCardIcon className={`w-6 h-6 ${
                              isActive ? 'text-primary-500' : 'text-gray-400'
                            }`} />
                          )}
                        </motion.div>
                        <div className="mt-2 lg:mt-3 text-center">
                          <div className={`text-xs lg:text-sm font-semibold ${
                            isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            <span className="hidden lg:inline">Adım {step.id}</span>
                            <span className="lg:hidden">{step.id}</span>
                          </div>
                          <div className={`text-xs mt-0.5 lg:mt-1 ${
                            isActive || isCompleted ? 'text-gray-700' : 'text-gray-400'
                          } hidden sm:block`}>
                            {step.name}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
              {/* General Error Message */}
              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">{errors.general}</p>
                    <p className="text-xs text-red-600 mt-1">Lütfen bilgilerinizi kontrol edip tekrar deneyin.</p>
                  </div>
                </motion.div>
              )}
              {/* Step 1: Delivery Info */}
              {activeStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  drag="x"
                  dragConstraints={{ left: -100, right: 0 }}
                  onDragEnd={(e, { offset, velocity }) => {
                    if (offset.x < -100 && velocity.x < -500) {
                      handleNextStep()
                    }
                  }}
                  className="lg:drag-none"
                >
                  <h2 className="text-xl font-semibold mb-6">Teslimat Bilgileri</h2>
                  
                  {/* Personal Info Section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Kişisel Bilgiler</h3>
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
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                            errors.firstName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          required
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.firstName}
                          </p>
                        )}
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
                          className={getFieldClass('lastName')}
                          required
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.lastName}
                          </p>
                        )}
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
                          className={getFieldClass('email')}
                          required
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.email}
                          </p>
                        )}
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
                          className={getFieldClass('phone')}
                          required
                        />
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Teslimat Adresi</h3>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            İl *
                          </label>
                          <select
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className={getFieldClass('city')}
                            required
                          >
                            <option value="">İl Seçiniz</option>
                            {cities.map((city) => (
                              <option key={city.id} value={city.id}>
                                {city.name}
                              </option>
                            ))}
                          </select>
                          {errors.city && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.city}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            İlçe *
                          </label>
                          <select
                            name="district"
                            value={formData.district}
                            onChange={handleInputChange}
                            className={getFieldClass('district')}
                            disabled={!formData.city || loadingDistricts}
                            required
                          >
                            <option value="">
                              {loadingDistricts ? 'Yükleniyor...' : 'İlçe Seçiniz'}
                            </option>
                            {districts.map((district) => (
                              <option key={district.id} value={district.id}>
                                {district.name}
                              </option>
                            ))}
                          </select>
                          {errors.district && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.district}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Açık Adres *
                        </label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, address: e.target.value }))
                            if (errors.address) {
                              setErrors(prev => ({ ...prev, address: '' }))
                            }
                            const error = validateField('address', e.target.value);
                            if (error) {
                              setErrors(prev => ({ ...prev, address: error }))
                            }
                          }}
                          rows={3}
                          className={getFieldClass('address')}
                          placeholder="Mahalle, sokak, cadde, bina no, daire no vb."
                          required
                        />
                        {errors.address && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.address}
                          </p>
                        )}
                      </div>
                      
                      {/* Billing Address Checkbox */}
                      <div className="mt-4">
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
                  </div>

                  {/* Billing Information Section */}
                  {!formData.sameAsDelivery && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-8"
                    >
                      <h3 className="text-lg font-medium mb-4">Fatura Bilgileri</h3>
                      <div className="space-y-4">
                        {/* Invoice Type Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fatura Türü *
                          </label>
                          <div className="flex gap-4">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="invoiceType"
                                value="individual"
                                checked={formData.invoiceType === 'individual'}
                                onChange={handleInputChange}
                                className="mr-2 text-primary-500 focus:ring-primary-500"
                              />
                              <span className="text-sm">Bireysel</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="invoiceType"
                                value="corporate"
                                checked={formData.invoiceType === 'corporate'}
                                onChange={handleInputChange}
                                className="mr-2 text-primary-500 focus:ring-primary-500"
                              />
                              <span className="text-sm">Kurumsal</span>
                            </label>
                          </div>
                        </div>

                        {/* Title Field */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ünvan *
                          </label>
                          <input
                            type="text"
                            name="billingTitle"
                            value={formData.billingTitle || ''}
                            onChange={handleInputChange}
                            placeholder={formData.invoiceType === 'corporate' ? 'Şirket Ünvanı' : 'Ad Soyad'}
                            className={getFieldClass('billingTitle')}
                            required={!formData.sameAsDelivery}
                          />
                          {errors.billingTitle && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.billingTitle}
                            </p>
                          )}
                        </div>

                        {/* Individual Fields */}
                        {formData.invoiceType === 'individual' && (
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                TC Kimlik No *
                              </label>
                              <input
                                type="text"
                                name="billingTcNo"
                                value={formData.billingTcNo || ''}
                                onChange={handleInputChange}
                                maxLength={11}
                                placeholder="11 haneli TC Kimlik No"
                                className={getFieldClass('billingTcNo')}
                                required={!formData.sameAsDelivery && formData.invoiceType === 'individual'}
                              />
                              {errors.billingTcNo && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                  <AlertCircle className="w-4 h-4 mr-1" />
                                  {errors.billingTcNo}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Vergi Dairesi *
                              </label>
                              <input
                                type="text"
                                name="billingTaxOffice"
                                value={formData.billingTaxOffice || ''}
                                onChange={handleInputChange}
                                className={getFieldClass('billingTaxOffice')}
                                required={!formData.sameAsDelivery}
                              />
                              {errors.billingTaxOffice && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                  <AlertCircle className="w-4 h-4 mr-1" />
                                  {errors.billingTaxOffice}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Corporate Fields */}
                        {formData.invoiceType === 'corporate' && (
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Vergi No *
                              </label>
                              <input
                                type="text"
                                name="billingTaxNo"
                                value={formData.billingTaxNo || ''}
                                onChange={handleInputChange}
                                className={getFieldClass('billingTaxNo')}
                                required={!formData.sameAsDelivery && formData.invoiceType === 'corporate'}
                              />
                              {errors.billingTaxNo && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                  <AlertCircle className="w-4 h-4 mr-1" />
                                  {errors.billingTaxNo}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Vergi Dairesi *
                              </label>
                              <input
                                type="text"
                                name="billingTaxOffice"
                                value={formData.billingTaxOffice || ''}
                                onChange={handleInputChange}
                                className={getFieldClass('billingTaxOffice')}
                                required={!formData.sameAsDelivery}
                              />
                              {errors.billingTaxOffice && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                  <AlertCircle className="w-4 h-4 mr-1" />
                                  {errors.billingTaxOffice}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Address Fields */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              İl *
                            </label>
                            <select
                              name="billingCity"
                              value={formData.billingCity || ''}
                              onChange={handleInputChange}
                              className={getFieldClass('billingCity')}
                              required={!formData.sameAsDelivery}
                            >
                              <option value="">İl Seçiniz</option>
                              {cities.map((city) => (
                                <option key={city.id} value={city.id}>
                                  {city.name}
                                </option>
                              ))}
                            </select>
                            {errors.billingCity && (
                              <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.billingCity}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              İlçe *
                            </label>
                            <select
                              name="billingDistrict"
                              value={formData.billingDistrict || ''}
                              onChange={handleInputChange}
                              className={getFieldClass('billingDistrict')}
                              disabled={!formData.billingCity || loadingBillingDistricts}
                              required={!formData.sameAsDelivery}
                            >
                              <option value="">
                                {loadingBillingDistricts ? 'Yükleniyor...' : 'İlçe Seçiniz'}
                              </option>
                              {billingDistricts.map((district) => (
                                <option key={district.id} value={district.id}>
                                  {district.name}
                                </option>
                              ))}
                            </select>
                            {errors.billingDistrict && (
                              <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.billingDistrict}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Açık Adres *
                          </label>
                          <textarea
                            name="billingAddress"
                            value={formData.billingAddress || ''}
                            onChange={(e) => {
                              setFormData(prev => ({ ...prev, billingAddress: e.target.value }))
                              if (errors.billingAddress) {
                                setErrors(prev => ({ ...prev, billingAddress: '' }))
                              }
                              const error = validateField('billingAddress', e.target.value);
                              if (error) {
                                setErrors(prev => ({ ...prev, billingAddress: error }))
                              }
                            }}
                            rows={3}
                            className={getFieldClass('billingAddress')}
                            placeholder="Mahalle, sokak, cadde, bina no, daire no vb."
                            required={!formData.sameAsDelivery}
                          />
                          {errors.billingAddress && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.billingAddress}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {activeStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="lg:hidden flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Geri</span>
                    </button>
                    <h2 className="text-xl font-semibold">Ödeme Bilgileri</h2>
                  </div>
                  
                  {/* Payment Method Selection */}
                  {!loadingPaymentMethods && paymentMethods.length > 0 && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Ödeme Yöntemi Seçin
                      </label>
                      <div className="space-y-3">
                        {paymentMethods.map((method) => (
                          <label
                            key={method.id}
                            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                              selectedPaymentMethod === method.id
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method.id}
                              checked={selectedPaymentMethod === method.id}
                              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                              className="mr-3"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{method.name}</h4>
                              <p className="text-sm text-gray-600">{method.description}</p>
                            </div>
                            {method.icon === 'CreditCard' && (
                              <CreditCardIcon className="w-5 h-5 text-gray-400 ml-3" />
                            )}
                            {method.icon === 'Bank' && (
                              <Building2 className="w-5 h-5 text-gray-400 ml-3" />
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {loadingPaymentMethods && (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                    </div>
                  )}
                  
                  {!loadingPaymentMethods && paymentMethods.length === 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                      <p className="text-sm text-yellow-800">
                        Şu anda aktif ödeme yöntemi bulunmamaktadır. Lütfen yönetici ile iletişime geçin.
                      </p>
                    </div>
                  )}
                  
                  {/* Credit Card Payment */}
                  {selectedPaymentMethod === 'creditCard' && (
                    <div className="grid lg:grid-cols-2 gap-8 mb-6">
                      {/* Left Column - Credit Card Animation */}
                      <div className="order-1 lg:order-1">
                        <div className="mb-6 lg:mb-0">
                          <CreditCard
                            cardNumber={formData.cardNumber}
                            cardName={formData.cardName}
                            expiryDate={formData.expiryDate}
                            cvv={formData.cvv}
                            isFlipped={isCardFlipped}
                          />
                        </div>
                      
                      {/* Security Notices */}
                      <div className="space-y-3 mt-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center">
                          <Lock className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                          <p className="text-xs text-green-800">
                            256-bit SSL sertifikası ile güvenli ödeme
                          </p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-start">
                            <Shield className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs text-blue-800 font-medium">3D Secure Güvencesi</p>
                              <p className="text-xs text-blue-700 mt-0.5">
                                SMS onayı ile ekstra güvenlik
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Form Fields */}
                    <div className="order-2 lg:order-2">
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
                            className={getFieldClass('cardNumber')}
                            required
                          />
                          {errors.cardNumber && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.cardNumber}
                            </p>
                          )}
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
                            className={getFieldClass('cardName')}
                            required
                          />
                          {errors.cardName && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.cardName}
                            </p>
                          )}
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
                              className={getFieldClass('expiryDate')}
                              required
                            />
                            {errors.expiryDate && (
                              <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.expiryDate}
                              </p>
                            )}
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
                              onFocus={() => setIsCardFlipped(true)}
                              onBlur={() => setIsCardFlipped(false)}
                              placeholder="123"
                              maxLength={3}
                              className={getFieldClass('cvv')}
                              required
                            />
                            {errors.cvv && (
                              <p className="mt-1 text-sm text-red-600 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.cvv}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                  {/* Accepted Card Logos */}
                  <div className="mt-6 pt-6 border-t">
                    <p className="text-xs text-gray-600 mb-3 text-center">Kabul Edilen Kartlar</p>
                    <div className="flex justify-center items-center gap-3 flex-wrap">
                      {/* Mastercard */}
                      <div className="bg-white px-3 py-2 rounded border border-gray-200 flex items-center h-10">
                        <Image 
                          src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                          alt="Mastercard"
                          width={64}
                          height={16}
                          className="h-4 w-auto"
                        />
                      </div>
                      {/* Visa */}
                      <div className="bg-white px-3 py-2 rounded border border-gray-200 flex items-center h-10">
                        <Image 
                          src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                          alt="Visa"
                          width={64}
                          height={16}
                          className="h-4 w-auto"
                        />
                      </div>
                      {/* Troy */}
                      <div className="bg-white px-3 py-2 rounded border border-gray-200 flex items-center h-10">
                        <Image 
                          src="/images/troy.png"
                          alt="Troy"
                          width={48}
                          height={12}
                          className="h-3 w-auto"
                        />
                      </div>
                      {/* AMEX */}
                      <div className="bg-white px-3 py-2 rounded border border-gray-200 flex items-center h-10">
                        <Image 
                          src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg"
                          alt="American Express"
                          width={64}
                          height={20}
                          className="h-5 w-auto"
                        />
                      </div>
                      {/* Maestro */}
                      <div className="bg-white px-3 py-2 rounded border border-gray-200 flex items-center h-10">
                        <Image 
                          src="https://upload.wikimedia.org/wikipedia/commons/8/80/Maestro_2016.svg"
                          alt="Maestro"
                          width={64}
                          height={20}
                          className="h-5 w-auto"
                        />
                      </div>
                    </div>
                  </div>
                )}
                  
                {/* Bank Transfer Payment */}
                {selectedPaymentMethod === 'bankTransfer' && (
                  <div className="space-y-6">
                    {paymentMethods.find(m => m.id === 'bankTransfer')?.bankAccounts && (
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="font-semibold text-lg mb-4">Banka Hesap Bilgileri</h3>
                        <div className="space-y-4">
                          {paymentMethods.find(m => m.id === 'bankTransfer').bankAccounts.map((account: any, index: number) => (
                            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                              <h4 className="font-medium text-gray-900">{account.bankName}</h4>
                              <div className="mt-2 space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Hesap Adı:</span>
                                  <span className="font-medium">{account.accountHolder}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">IBAN:</span>
                                  <span className="font-mono">{account.iban}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm text-blue-800">
                            <strong>Açıklama:</strong> Havale/EFT yaparken açıklama kısmına sipariş numaranızı yazmayı unutmayın.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                  {/* Terms and Submit Button - Mobile only */}
                  <div className="lg:hidden mt-8 pt-6 border-t space-y-4">
                    {/* Terms */}
                    <div className="space-y-3">
                      <label className="flex items-start">
                        <input
                          type="checkbox"
                          name="termsAccepted"
                          checked={formData.termsAccepted}
                          onChange={handleInputChange}
                          className="mr-2 mt-1 rounded text-primary-500 focus:ring-primary-500"
                          required
                        />
                        <span className="text-xs text-gray-700">
                          <Link href="/terms" className="text-primary-500 hover:underline font-bold">
                            Satış Sözleşmesi
                          </Link>
                          {' '}ve{' '}
                          <Link href="/privacy" className="text-primary-500 hover:underline font-bold">
                            Gizlilik Politikasını
                          </Link>
                          {' '}okudum, kabul ediyorum. *
                        </span>
                      </label>
                      {errors.termsAccepted && (
                        <p className="text-xs text-red-600 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.termsAccepted}
                        </p>
                      )}
                      <label className="flex items-start">
                        <input
                          type="checkbox"
                          name="marketingAccepted"
                          checked={formData.marketingAccepted}
                          onChange={handleInputChange}
                          className="mr-2 mt-1 rounded text-primary-500 focus:ring-primary-500"
                        />
                        <span className="text-xs text-gray-700">
                          Kampanya ve yeniliklerden haberdar olmak istiyorum.
                        </span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isProcessing}
                      onClick={handleSubmit}
                      className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          İşleniyor...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Güvenli Ödeme Yap
                        </>
                      )}
                    </button>
                  </div>

                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className={`hidden lg:flex px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 ${
                    activeStep === 1 ? 'invisible' : ''
                  }`}
                >
                  Geri
                </button>
                {activeStep < 2 && (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full lg:w-auto px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                  >
                    Devam Et
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className={`lg:col-span-1 order-1 lg:order-2 ${showMobileOrderSummary ? 'block lg:block' : 'hidden lg:block'}`}>
                <div id="mobile-order-summary" className="bg-white rounded-xl shadow-sm p-4 lg:p-6 lg:sticky lg:top-32">
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
                  <h4 className="font-medium">{product?.name || 'Oxiva Mıknatıslı Burun Bandı'}</h4>
                  <p className="text-sm text-gray-600">Adet: {quantity}</p>
                </div>
                <p className="font-semibold">₺{(discountedPrice * quantity).toFixed(2)}</p>
              </div>

              {/* Discount Code Section */}
              <div className="py-4 border-b">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İndirim Kodu
                  </label>
                  {!appliedDiscount ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => {
                          setDiscountCode(e.target.value)
                          if (errors.discountCode) {
                            setErrors(prev => ({ ...prev, discountCode: '' }))
                          }
                        }}
                        placeholder="İndirim kodunu girin"
                        className={`flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.discountCode ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={handleApplyDiscount}
                        disabled={applyingDiscount}
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                      >
                        {applyingDiscount ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Uygula'
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-green-50 px-3 py-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">{appliedDiscount.code}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveDiscount}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {errors.discountCode && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.discountCode}
                    </p>
                  )}
                </div>

                {/* Order Note Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sipariş Notu
                  </label>
                  <textarea
                    name="orderNote"
                    value={formData.orderNote || ''}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Siparişinizle ilgili not ekleyebilirsiniz (opsiyonel)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-3 py-4 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ara Toplam (KDV Hariç)</span>
                  <span>₺{subtotalWithoutKDV.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kargo</span>
                  <span className="text-green-600">Ücretsiz</span>
                </div>
                {quantity > 1 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Toplu Alım İndirimi</span>
                    <span className="text-green-600">-₺{((originalPrice - discountedPrice) * quantity).toFixed(2)}</span>
                  </div>
                )}
                {appliedDiscount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">İndirim Kodu ({appliedDiscount.code})</span>
                    <span className="text-green-600">-₺{appliedDiscount.amount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">KDV (%20)</span>
                  <span>₺{kdvAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center py-4">
                <span className="text-lg font-semibold">Toplam</span>
                <span className="text-2xl font-bold text-primary-600">₺{total.toFixed(2)}</span>
              </div>

              {/* Terms and Submit Button - Desktop only */}
              {activeStep === 2 && (
                <div className="hidden lg:block mt-6 pt-6 border-t space-y-4">
                  {/* Terms */}
                  <div className="space-y-3">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleInputChange}
                        className="mr-2 mt-1 rounded text-primary-500 focus:ring-primary-500"
                        required
                      />
                      <span className="text-xs text-gray-700">
                        <Link href="/terms" className="text-primary-500 hover:underline font-bold">
                          Satış Sözleşmesi
                        </Link>
                        {' '}ve{' '}
                        <Link href="/privacy" className="text-primary-500 hover:underline font-bold">
                          Gizlilik Politikasını
                        </Link>
                        {' '}okudum, kabul ediyorum. *
                      </span>
                    </label>
                    {errors.termsAccepted && (
                      <p className="text-xs text-red-600 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.termsAccepted}
                      </p>
                    )}
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="marketingAccepted"
                        checked={formData.marketingAccepted}
                        onChange={handleInputChange}
                        className="mr-2 mt-1 rounded text-primary-500 focus:ring-primary-500"
                      />
                      <span className="text-xs text-gray-700">
                        Kampanya ve yeniliklerden haberdar olmak istiyorum.
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    onClick={handleSubmit}
                    className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        İşleniyor...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Güvenli Ödeme Yap
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* PayTR Iframe */}
      {showPaytrIframe && (
        <PayTRIframe 
          token={paytrToken}
          onClose={() => {
            setShowPaytrIframe(false)
            setPaytrToken('')
            // Check if payment was successful
            const orderId = localStorage.getItem('currentOrderId')
            if (orderId) {
              // User might have completed payment, redirect to appropriate page
              // In a real app, you'd check the payment status from your backend
              router.push('/') // Redirect to home for now
            }
          }}
        />
      )}
    </div>
  )
}