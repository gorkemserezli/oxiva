'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Minus, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Truck,
  Save,
  X,
  Building2,
  FileText,
  Loader2
} from 'lucide-react'
import Image from 'next/image'
import { addressService, type City, type District } from '@/utils/addressService'
import { 
  validateTCKimlikNo, 
  validateEmail, 
  validatePhone, 
  validateTaxNumber, 
  validateName, 
  validateAddress,
  validationMessages 
} from '@/utils/validation'

interface Product {
  id: string
  name: string
  price: number
  image: string
  stock: number
}

interface CartItem {
  product: Product
  quantity: number
}

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
  invoiceType: 'individual' | 'corporate'
  billingTitle?: string
  billingTcNo?: string
  billingTaxNo?: string
  billingTaxOffice?: string
  billingAddress?: string
  billingCity?: string
  billingDistrict?: string
  
  // Sipariş Notu
  orderNote?: string
}

interface ShippingCompany {
  id: string
  name: string
  logo?: string
  deliveryTime: string
  price: number
}

const shippingCompanies: ShippingCompany[] = [
  { id: 'yurtici', name: 'Yurtiçi Kargo', deliveryTime: '2-3 iş günü', price: 0 },
  { id: 'aras', name: 'Aras Kargo', deliveryTime: '2-3 iş günü', price: 0 },
  { id: 'mng', name: 'MNG Kargo', deliveryTime: '2-3 iş günü', price: 0 },
  { id: 'ptt', name: 'PTT Kargo', deliveryTime: '3-4 iş günü', price: 0 },
  { id: 'ups', name: 'UPS', deliveryTime: '1-2 iş günü', price: 30 },
  { id: 'fedex', name: 'FedEx', deliveryTime: '1-2 iş günü', price: 35 }
]

export default function NewOrderPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    sameAsDelivery: true,
    invoiceType: 'individual',
    orderNote: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('credit_card')
  const [shippingCompany, setShippingCompany] = useState('yurtici')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Address data states
  const [cities, setCities] = useState<City[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  
  // Billing address states
  const [billingDistricts, setBillingDistricts] = useState<District[]>([])
  const [loadingBillingDistricts, setLoadingBillingDistricts] = useState(false)

  // Load cities on component mount
  useEffect(() => {
    const loadCities = async () => {
      const citiesData = await addressService.getCities()
      setCities(citiesData)
    }
    loadCities()
    
    // Mock products - gerçek veritabanından gelecek
    setProducts([
      {
        id: '1',
        name: 'Oxiva Mıknatıslı Burun Bandı',
        price: 449,
        image: '/images/product-1.jpg',
        stock: 50
      },
      {
        id: '2',
        name: 'Oxiva Pro Burun Bandı',
        price: 549,
        image: '/images/product-2.jpg',
        stock: 30
      }
    ])
  }, [])

  // Load districts when city changes
  useEffect(() => {
    const loadDistricts = async () => {
      if (formData.city) {
        setLoadingDistricts(true)
        setDistricts([])
        setFormData(prev => ({ ...prev, district: '' }))
        
        const districtsData = await addressService.getDistricts(parseInt(formData.city))
        setDistricts(districtsData)
        setLoadingDistricts(false)
      } else {
        setDistricts([])
      }
    }
    loadDistricts()
  }, [formData.city])

  // Load billing districts when billing city changes
  useEffect(() => {
    const loadBillingDistricts = async () => {
      if (!formData.sameAsDelivery && formData.billingCity) {
        setLoadingBillingDistricts(true)
        setBillingDistricts([])
        setFormData(prev => ({ ...prev, billingDistrict: '' }))
        
        const districtsData = await addressService.getDistricts(parseInt(formData.billingCity))
        setBillingDistricts(districtsData)
        setLoadingBillingDistricts(false)
      } else {
        setBillingDistricts([])
      }
    }
    loadBillingDistricts()
  }, [formData.billingCity, formData.sameAsDelivery])

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id)
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1)
    } else {
      setCart([...cart, { product, quantity: 1 }])
    }
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.product.id !== productId))
    } else {
      setCart(cart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      ))
    }
  }

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const getShippingCost = () => {
    const selectedCompany = shippingCompanies.find(c => c.id === shippingCompany)
    return selectedCompany?.price || 0
  }

  const getTax = () => {
    return (getSubtotal() + getShippingCost()) * 0.20
  }

  const getTotal = () => {
    return getSubtotal() + getShippingCost() + getTax()
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    // Validate first name
    if (!validateName(formData.firstName)) {
      newErrors.firstName = validationMessages.name
    }
    
    // Validate last name
    if (!validateName(formData.lastName)) {
      newErrors.lastName = validationMessages.name
    }
    
    // Validate email
    if (!validateEmail(formData.email)) {
      newErrors.email = validationMessages.email
    }
    
    // Validate phone
    if (!validatePhone(formData.phone)) {
      newErrors.phone = validationMessages.phone
    }
    
    // Validate address
    if (!validateAddress(formData.address)) {
      newErrors.address = validationMessages.address
    }
    
    // Validate city and district
    if (!formData.city) {
      newErrors.city = 'İl seçiniz'
    }
    
    if (!formData.district) {
      newErrors.district = 'İlçe seçiniz'
    }
    
    // Validate billing info if different
    if (!formData.sameAsDelivery) {
      if (formData.invoiceType === 'individual') {
        if (!formData.billingTitle || !validateName(formData.billingTitle)) {
          newErrors.billingTitle = 'Geçerli bir ad soyad giriniz'
        }
        if (!formData.billingTcNo || !validateTCKimlikNo(formData.billingTcNo)) {
          newErrors.billingTcNo = validationMessages.tcNo
        }
      } else {
        if (!formData.billingTitle || formData.billingTitle.length < 3) {
          newErrors.billingTitle = 'Firma unvanı giriniz'
        }
        if (!formData.billingTaxNo || !validateTaxNumber(formData.billingTaxNo)) {
          newErrors.billingTaxNo = validationMessages.taxNumber
        }
        if (!formData.billingTaxOffice) {
          newErrors.billingTaxOffice = 'Vergi dairesi giriniz'
        }
      }
      
      if (!formData.billingAddress || !validateAddress(formData.billingAddress)) {
        newErrors.billingAddress = validationMessages.address
      }
      
      if (!formData.billingCity) {
        newErrors.billingCity = 'İl seçiniz'
      }
      
      if (!formData.billingDistrict) {
        newErrors.billingDistrict = 'İlçe seçiniz'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (cart.length === 0) {
      alert('Sepet boş!')
      return
    }

    if (!validateForm()) {
      alert('Lütfen tüm zorunlu alanları doğru şekilde doldurun!')
      return
    }

    setLoading(true)
    
    const selectedCity = cities.find(c => c.id.toString() === formData.city)
    const selectedDistrict = districts.find(d => d.id.toString() === formData.district)
    const selectedShippingCompany = shippingCompanies.find(c => c.id === shippingCompany)
    
    const orderData = {
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone
      },
      deliveryAddress: {
        address: formData.address,
        city: selectedCity?.name || '',
        district: selectedDistrict?.name || ''
      },
      billingInfo: formData.sameAsDelivery ? null : {
        type: formData.invoiceType,
        title: formData.billingTitle,
        tcNo: formData.billingTcNo,
        taxNo: formData.billingTaxNo,
        taxOffice: formData.billingTaxOffice,
        address: formData.billingAddress,
        city: cities.find(c => c.id.toString() === formData.billingCity)?.name || '',
        district: billingDistricts.find(d => d.id.toString() === formData.billingDistrict)?.name || ''
      },
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        total: item.product.price * item.quantity
      })),
      payment: {
        method: paymentMethod,
        status: 'pending'
      },
      shipping: {
        company: selectedShippingCompany?.name || '',
        companyId: shippingCompany,
        deliveryTime: selectedShippingCompany?.deliveryTime || '',
        cost: getShippingCost()
      },
      totals: {
        subtotal: getSubtotal(),
        shipping: getShippingCost(),
        tax: getTax(),
        total: getTotal()
      },
      orderNote: formData.orderNote,
      status: 'NEW',
      createdAt: new Date().toISOString()
    }

    console.log('Order data:', orderData)
    
    // API çağrısı yapılacak
    setTimeout(() => {
      setLoading(false)
      alert('Sipariş oluşturuldu!')
      router.push('/admin/orders')
    }, 1500)
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      {/* Header */}
      <header className="bg-white shadow">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/orders"
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Yeni Sipariş Oluştur</h1>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sol Kolon - Ürün Seçimi ve Müşteri Bilgileri */}
          <div className="space-y-6">
            {/* Ürün Arama ve Seçimi */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Ürün Ekle</h2>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ürün ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredProducts.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <div className="flex items-center gap-3">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-sm text-gray-600">₺{product.price} • Stok: {product.stock}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Teslimat Bilgileri */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Teslimat Bilgileri</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ad <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Soyad <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-posta <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <span className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-600">+90</span>
                    <input
                      type="tel"
                      required
                      placeholder="5XX XXX XX XX"
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                        if (value.length <= 10) {
                          setFormData({...formData, phone: value})
                        }
                      }}
                      className={`w-full pl-20 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adres <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      required
                      rows={3}
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Mahalle, sokak, bina no, daire no..."
                    />
                  </div>
                  {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İl <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">İl Seçiniz</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id.toString()}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İlçe <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({...formData, district: e.target.value})}
                    disabled={!formData.city || loadingDistricts}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.district ? 'border-red-500' : 'border-gray-300'
                    } ${(!formData.city || loadingDistricts) ? 'bg-gray-100' : ''}`}
                  >
                    <option value="">
                      {loadingDistricts ? 'Yükleniyor...' : 'İlçe Seçiniz'}
                    </option>
                    {districts.map(district => (
                      <option key={district.id} value={district.id.toString()}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                  {errors.district && <p className="mt-1 text-xs text-red-500">{errors.district}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sipariş Notu</label>
                  <textarea
                    rows={2}
                    value={formData.orderNote}
                    onChange={(e) => setFormData({...formData, orderNote: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Teslimat ile ilgili özel notlar..."
                  />
                </div>
              </div>
            </div>

            {/* Fatura Bilgileri */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Fatura Bilgileri</h2>
              
              <div className="mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.sameAsDelivery}
                    onChange={(e) => setFormData({...formData, sameAsDelivery: e.target.checked})}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Fatura bilgileri teslimat bilgileri ile aynı
                  </span>
                </label>
              </div>

              {!formData.sameAsDelivery && (
                <div className="space-y-4">
                  <div className="flex gap-4 mb-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="invoiceType"
                        value="individual"
                        checked={formData.invoiceType === 'individual'}
                        onChange={(e) => setFormData({...formData, invoiceType: 'individual'})}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium">Bireysel</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="invoiceType"
                        value="corporate"
                        checked={formData.invoiceType === 'corporate'}
                        onChange={(e) => setFormData({...formData, invoiceType: 'corporate'})}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium">Kurumsal</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {formData.invoiceType === 'individual' ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ad Soyad <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.billingTitle || ''}
                            onChange={(e) => setFormData({...formData, billingTitle: e.target.value})}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                              errors.billingTitle ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors.billingTitle && <p className="mt-1 text-xs text-red-500">{errors.billingTitle}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            TC Kimlik No <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            maxLength={11}
                            value={formData.billingTcNo || ''}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '')
                              if (value.length <= 11) {
                                setFormData({...formData, billingTcNo: value})
                              }
                            }}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                              errors.billingTcNo ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors.billingTcNo && <p className="mt-1 text-xs text-red-500">{errors.billingTcNo}</p>}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Firma Unvanı <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.billingTitle || ''}
                            onChange={(e) => setFormData({...formData, billingTitle: e.target.value})}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                              errors.billingTitle ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors.billingTitle && <p className="mt-1 text-xs text-red-500">{errors.billingTitle}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Vergi No <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            maxLength={10}
                            value={formData.billingTaxNo || ''}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '')
                              if (value.length <= 10) {
                                setFormData({...formData, billingTaxNo: value})
                              }
                            }}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                              errors.billingTaxNo ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors.billingTaxNo && <p className="mt-1 text-xs text-red-500">{errors.billingTaxNo}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Vergi Dairesi <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.billingTaxOffice || ''}
                            onChange={(e) => setFormData({...formData, billingTaxOffice: e.target.value})}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                              errors.billingTaxOffice ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors.billingTaxOffice && <p className="mt-1 text-xs text-red-500">{errors.billingTaxOffice}</p>}
                        </div>
                      </>
                    )}

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fatura Adresi <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={formData.billingAddress || ''}
                        onChange={(e) => setFormData({...formData, billingAddress: e.target.value})}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                          errors.billingAddress ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.billingAddress && <p className="mt-1 text-xs text-red-500">{errors.billingAddress}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        İl <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.billingCity || ''}
                        onChange={(e) => setFormData({...formData, billingCity: e.target.value})}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                          errors.billingCity ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">İl Seçiniz</option>
                        {cities.map(city => (
                          <option key={city.id} value={city.id.toString()}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                      {errors.billingCity && <p className="mt-1 text-xs text-red-500">{errors.billingCity}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        İlçe <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.billingDistrict || ''}
                        onChange={(e) => setFormData({...formData, billingDistrict: e.target.value})}
                        disabled={!formData.billingCity || loadingBillingDistricts}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                          errors.billingDistrict ? 'border-red-500' : 'border-gray-300'
                        } ${(!formData.billingCity || loadingBillingDistricts) ? 'bg-gray-100' : ''}`}
                      >
                        <option value="">
                          {loadingBillingDistricts ? 'Yükleniyor...' : 'İlçe Seçiniz'}
                        </option>
                        {billingDistricts.map(district => (
                          <option key={district.id} value={district.id.toString()}>
                            {district.name}
                          </option>
                        ))}
                      </select>
                      {errors.billingDistrict && <p className="mt-1 text-xs text-red-500">{errors.billingDistrict}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sağ Kolon - Sepet ve Ödeme */}
          <div className="space-y-6">
            {/* Sepet */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Sipariş Özeti</h2>
              
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Henüz ürün eklenmedi</p>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product.name}</p>
                        <p className="text-sm text-gray-600">₺{item.product.price} x {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, 0)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded ml-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Fiyat Özeti */}
              {cart.length > 0 && (
                <div className="mt-6 space-y-2 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ara Toplam</span>
                    <span>₺{getSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Kargo</span>
                    <span>{getShippingCost() === 0 ? 'Ücretsiz' : `₺${getShippingCost().toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">KDV (%20)</span>
                    <span>₺{getTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                    <span>Toplam</span>
                    <span className="text-primary-600">₺{getTotal().toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Ödeme ve Kargo */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Ödeme ve Kargo</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ödeme Yöntemi</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value="credit_card"
                        checked={paymentMethod === 'credit_card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <span>Kredi Kartı</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value="transfer"
                        checked={paymentMethod === 'transfer'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span>Havale/EFT</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kargo Firması</label>
                  <div className="space-y-2">
                    {shippingCompanies.map((company) => (
                      <label key={company.id} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="shipping"
                          value={company.id}
                          checked={shippingCompany === company.id}
                          onChange={(e) => setShippingCompany(e.target.value)}
                          className="text-primary-600 focus:ring-primary-500"
                        />
                        <Truck className="w-5 h-5 text-gray-600" />
                        <div className="flex-1">
                          <span className="block font-medium">{company.name}</span>
                          <span className="text-sm text-gray-500">
                            {company.deliveryTime} 
                            {company.price > 0 ? ` (₺${company.price})` : ' (Ücretsiz)'}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3">
              <Link
                href="/admin/orders"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <X className="w-5 h-5" />
                İptal
              </Link>
              <button
                type="submit"
                disabled={loading || cart.length === 0}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {loading ? 'Oluşturuluyor...' : 'Sipariş Oluştur'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}