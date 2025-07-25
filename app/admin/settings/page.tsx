'use client'

import { useState, useEffect } from 'react'
import { 
  Store, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard,
  Save,
  AlertCircle,
  Upload,
  MessageCircle,
  Image as ImageIcon,
  X,
  Loader2,
  Settings
} from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

// Settings key for localStorage
const SETTINGS_KEY = 'oxiva-admin-settings'

// Default settings
const defaultSettings = {
  // Genel Ayarlar
  storeName: 'Oxiva Store',
  siteTitle: 'Oxiva Store - Online Alışveriş',
  storeEmail: 'info@oxiva.com',
  storePhone: '0850 123 45 67',
  storeAddress: 'İstanbul, Türkiye',
  whatsappNumber: '',
  logo: '/images/logo.png',
  favicon: '/favicon.ico',
  
  // Ödeme Ayarları
  paymentMethods: {
    creditCard: true,
    bankTransfer: false
  }
}

// IBAN formatting function
function formatIBAN(value: string): string {
  // Remove all non-alphanumeric characters
  const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '')
  
  // Add TR prefix if not present
  let iban = cleaned
  if (!iban.startsWith('TR')) {
    iban = 'TR' + iban.replace(/^[A-Z]{2}/, '')
  }
  
  // Limit to max IBAN length (26 for Turkey)
  iban = iban.slice(0, 26)
  
  // Format with spaces every 4 characters
  const parts = []
  for (let i = 0; i < iban.length; i += 4) {
    parts.push(iban.slice(i, i + 4))
  }
  
  return parts.join(' ')
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState(defaultSettings)
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPayTRModal, setShowPayTRModal] = useState(false)
  const [showBankModal, setShowBankModal] = useState(false)
  const [paytrSettings, setPaytrSettings] = useState({
    merchantId: '',
    merchantKey: '',
    merchantSalt: '',
    successUrl: '',
    failUrl: ''
  })
  const [paytrErrors, setPaytrErrors] = useState<Record<string, string>>({})
  const [bankAccounts, setBankAccounts] = useState<Array<{
    id: string
    bankName: string
    accountHolder: string
    iban: string
    branch?: string
  }>>([])
  const [bankErrors, setBankErrors] = useState<Record<string, string>>({})
  const { showToast, ToastComponent } = useToast()

  // Load settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const auth = localStorage.getItem('adminAuth')
        if (!auth) return
        
        const { token } = JSON.parse(auth)
        const response = await fetch('/api/admin/settings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setFormData(prev => ({ ...prev, ...data }))
          // Load PayTR settings if available
          if (data.paytrMerchantId) {
            setPaytrSettings({
              merchantId: data.paytrMerchantId || '',
              merchantKey: data.paytrMerchantKey || '',
              merchantSalt: data.paytrMerchantSalt || '',
              successUrl: data.paytrSuccessUrl || '',
              failUrl: data.paytrFailUrl || ''
            })
          }
          // Load bank accounts if available
          if (data.bankAccounts) {
            try {
              const accounts = JSON.parse(data.bankAccounts)
              setBankAccounts(Array.isArray(accounts) ? accounts : [])
            } catch (e) {
              console.error('Error parsing bank accounts:', e)
            }
          }
        }
      } catch (error) {
        console.error('Error loading settings:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchSettings()
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    // Validation for general settings
    if (activeTab === 'general') {
      if (!formData.storeName.trim()) {
        newErrors.storeName = 'Mağaza adı zorunludur'
      }
      if (!formData.siteTitle.trim()) {
        newErrors.siteTitle = 'Site başlığı zorunludur'
      }
      if (!formData.storeEmail.trim()) {
        newErrors.storeEmail = 'E-posta adresi zorunludur'
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.storeEmail)) {
          newErrors.storeEmail = 'Geçerli bir e-posta adresi girin'
        }
      }
      if (!formData.storePhone.trim()) {
        newErrors.storePhone = 'Telefon numarası zorunludur'
      }
      if (!formData.storeAddress.trim()) {
        newErrors.storeAddress = 'Adres zorunludur'
      }
      if (!formData.logo) {
        newErrors.logo = 'Logo zorunludur'
      }
      if (!formData.favicon) {
        newErrors.favicon = 'Favicon zorunludur'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }
    
    try {
      const auth = localStorage.getItem('adminAuth')
      if (!auth) return
      
      const { token } = JSON.parse(auth)
      // Remove fields that have their own submit handlers
      const { bankAccounts, paytrFailUrl, paytrMerchantId, paytrMerchantKey, paytrMerchantSalt, paytrSuccessUrl, ...dataToSave } = formData as any
      
      // Remove cashOnDelivery from paymentMethods
      if (dataToSave.paymentMethods && 'cashOnDelivery' in dataToSave.paymentMethods) {
        delete dataToSave.paymentMethods.cashOnDelivery
      }
      
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSave)
      })
      
      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        throw new Error('Ayarlar kaydedilemedi')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
    }
  }

  const tabs = [
    { id: 'general', label: 'Genel', icon: Store },
    { id: 'payment', label: 'Ödeme', icon: CreditCard }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      {ToastComponent}
      {/* Header */}
      <header className="bg-white shadow">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ayarlar</h1>
            <p className="text-sm text-gray-600 mt-1">Mağaza ayarlarını yönetin</p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Save className="w-5 h-5" />
            Kaydet
          </button>
        </div>
      </header>

      <div className="p-6">
        {/* Success Message */}
        {saved && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800">Ayarlar başarıyla kaydedildi!</span>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="flex border-b">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          <div className="p-6">
            {/* Genel Ayarlar */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Genel Ayarlar</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mağaza Adı <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.storeName}
                      onChange={(e) => {
                        setFormData({ ...formData, storeName: e.target.value })
                        if (errors.storeName) setErrors({ ...errors, storeName: '' })
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.storeName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.storeName && (
                      <p className="text-xs text-red-500 mt-1">{errors.storeName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Başlığı <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.siteTitle}
                      onChange={(e) => {
                        setFormData({ ...formData, siteTitle: e.target.value })
                        if (errors.siteTitle) setErrors({ ...errors, siteTitle: '' })
                      }}
                      placeholder="Tarayıcı sekmesinde görünecek başlık"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.siteTitle ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.siteTitle && (
                      <p className="text-xs text-red-500 mt-1">{errors.siteTitle}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">SEO için önemli - tarayıcı sekmesinde görünür</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        value={formData.storeEmail}
                        onChange={(e) => {
                          setFormData({ ...formData, storeEmail: e.target.value })
                          if (errors.storeEmail) setErrors({ ...errors, storeEmail: '' })
                        }}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.storeEmail ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.storeEmail && (
                      <p className="text-xs text-red-500 mt-1">{errors.storeEmail}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        value={formData.storePhone}
                        onChange={(e) => {
                          setFormData({ ...formData, storePhone: e.target.value })
                          if (errors.storePhone) setErrors({ ...errors, storePhone: '' })
                        }}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.storePhone ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.storePhone && (
                      <p className="text-xs text-red-500 mt-1">{errors.storePhone}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adres <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={formData.storeAddress}
                        onChange={(e) => {
                          setFormData({ ...formData, storeAddress: e.target.value })
                          if (errors.storeAddress) setErrors({ ...errors, storeAddress: '' })
                        }}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.storeAddress ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.storeAddress && (
                      <p className="text-xs text-red-500 mt-1">{errors.storeAddress}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp Numarası
                    </label>
                    <div className="relative">
                      <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        value={formData.whatsappNumber}
                        onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                        placeholder="90 5XX XXX XX XX"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Ülke koduyla birlikte girin (örn: 90 5XX XXX XX XX)</p>
                  </div>
                </div>
                
                <div className="mt-6 border-t pt-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Görsel Ayarları</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo <span className="text-red-500">*</span>
                      </label>
                      <div className={`border-2 border-dashed rounded-lg p-4 ${
                        errors.logo ? 'border-red-500' : 'border-gray-300'
                      }`}>
                        {formData.logo ? (
                          <div className="relative">
                            <img src={formData.logo} alt="Logo" className="h-20 mx-auto" />
                            <button
                              type="button"
                              onClick={async () => {
                                // Delete from server if it's an uploaded file
                                if (formData.logo && formData.logo.startsWith('/uploads/')) {
                                  try {
                                    const auth = localStorage.getItem('adminAuth')
                                    if (auth) {
                                      const { token } = JSON.parse(auth)
                                      await fetch('/api/admin/upload/delete', {
                                        method: 'POST',
                                        headers: {
                                          'Content-Type': 'application/json',
                                          'Authorization': `Bearer ${token}`
                                        },
                                        body: JSON.stringify({ filename: formData.logo })
                                      })
                                    }
                                  } catch (error) {
                                    console.error('Error deleting logo:', error)
                                  }
                                }
                                setFormData({ ...formData, logo: '' })
                                
                                // Update database immediately
                                const auth = localStorage.getItem('adminAuth')
                                if (auth) {
                                  const { token } = JSON.parse(auth)
                                  await fetch('/api/admin/settings', {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      'Authorization': `Bearer ${token}`
                                    },
                                    body: JSON.stringify({ logo: '' })
                                  })
                                }
                              }}
                              className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center cursor-pointer">
                            {uploading ? (
                              <Loader2 className="w-8 h-8 text-gray-400 mb-2 animate-spin" />
                            ) : (
                              <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            )}
                            <span className="text-sm text-gray-600">{uploading ? 'Yükleniyor...' : 'Logo Yükle'}</span>
                            <span className="text-xs text-gray-500 mt-1">PNG, JPG, SVG (Max: 2MB)</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  setUploading(true)
                                  try {
                                    const formData = new FormData()
                                    formData.append('file', file)
                                    formData.append('type', 'logo')
                                    
                                    const response = await fetch('/api/admin/upload', {
                                      method: 'POST',
                                      body: formData
                                    })
                                    
                                    if (response.ok) {
                                      const { url } = await response.json()
                                      setFormData(prev => ({ ...prev, logo: url }))
                                      if (errors.logo) setErrors({ ...errors, logo: '' })
                                      
                                      // Save to database immediately
                                      const auth = localStorage.getItem('adminAuth')
                                      if (auth) {
                                        const { token } = JSON.parse(auth)
                                        await fetch('/api/admin/settings', {
                                          method: 'POST',
                                          headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${token}`
                                          },
                                          body: JSON.stringify({ logo: url })
                                        })
                                      }
                                      showToast('Logo başarıyla yüklendi', 'success')
                                    } else {
                                      const errorData = await response.json()
                                      showToast(errorData.error || 'Logo yüklenirken hata oluştu', 'error')
                                    }
                                  } catch (error) {
                                    console.error('Upload error:', error)
                                    showToast('Logo yüklenirken hata oluştu', 'error')
                                  } finally {
                                    setUploading(false)
                                  }
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                      {errors.logo && (
                        <p className="text-xs text-red-500 mt-1">{errors.logo}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Favicon <span className="text-red-500">*</span>
                      </label>
                      <div className={`border-2 border-dashed rounded-lg p-4 ${
                        errors.favicon ? 'border-red-500' : 'border-gray-300'
                      }`}>
                        {formData.favicon ? (
                          <div className="relative">
                            <img src={formData.favicon} alt="Favicon" className="h-16 w-16 mx-auto" />
                            <button
                              type="button"
                              onClick={async () => {
                                // Delete from server if it's an uploaded file
                                if (formData.favicon && formData.favicon.startsWith('/uploads/')) {
                                  try {
                                    const auth = localStorage.getItem('adminAuth')
                                    if (auth) {
                                      const { token } = JSON.parse(auth)
                                      await fetch('/api/admin/upload/delete', {
                                        method: 'POST',
                                        headers: {
                                          'Content-Type': 'application/json',
                                          'Authorization': `Bearer ${token}`
                                        },
                                        body: JSON.stringify({ filename: formData.favicon })
                                      })
                                    }
                                  } catch (error) {
                                    console.error('Error deleting favicon:', error)
                                  }
                                }
                                setFormData({ ...formData, favicon: '' })
                                
                                // Update database immediately
                                const auth = localStorage.getItem('adminAuth')
                                if (auth) {
                                  const { token } = JSON.parse(auth)
                                  await fetch('/api/admin/settings', {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      'Authorization': `Bearer ${token}`
                                    },
                                    body: JSON.stringify({ favicon: '' })
                                  })
                                }
                              }}
                              className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center cursor-pointer">
                            {uploading ? (
                              <Loader2 className="w-8 h-8 text-gray-400 mb-2 animate-spin" />
                            ) : (
                              <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                            )}
                            <span className="text-sm text-gray-600">{uploading ? 'Yükleniyor...' : 'Favicon Yükle'}</span>
                            <span className="text-xs text-gray-500 mt-1">Sadece ICO dosyaları</span>
                            <input
                              type="file"
                              accept=".ico"
                              onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  setUploading(true)
                                  try {
                                    const formData = new FormData()
                                    formData.append('file', file)
                                    formData.append('type', 'favicon')
                                    
                                    const response = await fetch('/api/admin/upload', {
                                      method: 'POST',
                                      body: formData
                                    })
                                    
                                    if (response.ok) {
                                      const { url } = await response.json()
                                      setFormData(prev => ({ ...prev, favicon: url }))
                                      if (errors.favicon) setErrors({ ...errors, favicon: '' })
                                      
                                      // Save to database immediately
                                      const auth = localStorage.getItem('adminAuth')
                                      if (auth) {
                                        const { token } = JSON.parse(auth)
                                        await fetch('/api/admin/settings', {
                                          method: 'POST',
                                          headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${token}`
                                          },
                                          body: JSON.stringify({ favicon: url })
                                        })
                                      }
                                      showToast('Favicon başarıyla yüklendi', 'success')
                                    } else {
                                      const errorData = await response.json()
                                      showToast(errorData.error || 'Favicon yüklenirken hata oluştu', 'error')
                                    }
                                  } catch (error) {
                                    console.error('Upload error:', error)
                                    showToast('Favicon yüklenirken hata oluştu', 'error')
                                  } finally {
                                    setUploading(false)
                                  }
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                      {errors.favicon && (
                        <p className="text-xs text-red-500 mt-1">{errors.favicon}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}


            {/* Ödeme Ayarları */}
            {activeTab === 'payment' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ödeme Yöntemleri</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Kredi/Banka Kartı</p>
                        <p className="text-sm text-gray-500">PayTR ile güvenli ödeme</p>
                      </div>
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowPayTRModal(true)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="PayTR Ayarları"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                      <input
                        type="checkbox"
                        checked={formData.paymentMethods.creditCard}
                        onChange={(e) => {
                          if (e.target.checked) {
                            // Check if PayTR settings are configured
                            if (!paytrSettings.merchantId || !paytrSettings.merchantKey || !paytrSettings.merchantSalt) {
                              showToast('Önce PayTR ayarlarını yapılandırmalısınız', 'error')
                              return
                            }
                          }
                          setFormData({
                            ...formData,
                            paymentMethods: { ...formData.paymentMethods, creditCard: e.target.checked }
                          })
                        }}
                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="w-5 h-5 text-gray-600">₺</div>
                      <div>
                        <p className="font-medium text-gray-900">Havale/EFT</p>
                        <p className="text-sm text-gray-500">Banka hesabına transfer</p>
                      </div>
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowBankModal(true)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Banka Hesapları"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                      <input
                        type="checkbox"
                        checked={formData.paymentMethods.bankTransfer}
                        onChange={(e) => {
                          if (e.target.checked) {
                            // Check if bank accounts are configured
                            if (bankAccounts.length === 0) {
                              showToast('Önce banka hesaplarını eklemelisiniz', 'error')
                              return
                            }
                          }
                          setFormData({
                            ...formData,
                            paymentMethods: { ...formData.paymentMethods, bankTransfer: e.target.checked }
                          })
                        }}
                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
      
      {/* PayTR Settings Modal */}
      {showPayTRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">PayTR Ayarları</h3>
              <button
                type="button"
                onClick={() => {
                  setShowPayTRModal(false)
                  setPaytrErrors({})
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Merchant ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={paytrSettings.merchantId}
                  onChange={(e) => {
                    setPaytrSettings({ ...paytrSettings, merchantId: e.target.value })
                    if (paytrErrors.merchantId) setPaytrErrors({ ...paytrErrors, merchantId: '' })
                  }}
                  placeholder="PayTR Merchant ID"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    paytrErrors.merchantId ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {paytrErrors.merchantId && (
                  <p className="text-xs text-red-500 mt-1">{paytrErrors.merchantId}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Merchant Key <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={paytrSettings.merchantKey}
                  onChange={(e) => {
                    setPaytrSettings({ ...paytrSettings, merchantKey: e.target.value })
                    if (paytrErrors.merchantKey) setPaytrErrors({ ...paytrErrors, merchantKey: '' })
                  }}
                  placeholder="PayTR Merchant Key"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    paytrErrors.merchantKey ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {paytrErrors.merchantKey && (
                  <p className="text-xs text-red-500 mt-1">{paytrErrors.merchantKey}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Merchant Salt <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={paytrSettings.merchantSalt}
                  onChange={(e) => {
                    setPaytrSettings({ ...paytrSettings, merchantSalt: e.target.value })
                    if (paytrErrors.merchantSalt) setPaytrErrors({ ...paytrErrors, merchantSalt: '' })
                  }}
                  placeholder="PayTR Merchant Salt"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    paytrErrors.merchantSalt ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {paytrErrors.merchantSalt && (
                  <p className="text-xs text-red-500 mt-1">{paytrErrors.merchantSalt}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Başarılı Ödeme URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={paytrSettings.successUrl}
                  onChange={(e) => {
                    setPaytrSettings({ ...paytrSettings, successUrl: e.target.value })
                    if (paytrErrors.successUrl) setPaytrErrors({ ...paytrErrors, successUrl: '' })
                  }}
                  placeholder="https://example.com/payment/success"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    paytrErrors.successUrl ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {paytrErrors.successUrl && (
                  <p className="text-xs text-red-500 mt-1">{paytrErrors.successUrl}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Ödeme başarılı olduğunda yönlendirilecek sayfa</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Başarısız Ödeme URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={paytrSettings.failUrl}
                  onChange={(e) => {
                    setPaytrSettings({ ...paytrSettings, failUrl: e.target.value })
                    if (paytrErrors.failUrl) setPaytrErrors({ ...paytrErrors, failUrl: '' })
                  }}
                  placeholder="https://example.com/payment/fail"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    paytrErrors.failUrl ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {paytrErrors.failUrl && (
                  <p className="text-xs text-red-500 mt-1">{paytrErrors.failUrl}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Ödeme başarısız olduğunda yönlendirilecek sayfa</p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowPayTRModal(false)
                  setPaytrErrors({})
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={async () => {
                  // Validation
                  const newErrors: Record<string, string> = {}
                  
                  if (!paytrSettings.merchantId.trim()) {
                    newErrors.merchantId = 'Merchant ID zorunludur'
                  }
                  if (!paytrSettings.merchantKey.trim()) {
                    newErrors.merchantKey = 'Merchant Key zorunludur'
                  }
                  if (!paytrSettings.merchantSalt.trim()) {
                    newErrors.merchantSalt = 'Merchant Salt zorunludur'
                  }
                  
                  if (!paytrSettings.successUrl.trim()) {
                    newErrors.successUrl = 'Başarılı ödeme URL zorunludur'
                  }
                  if (!paytrSettings.failUrl.trim()) {
                    newErrors.failUrl = 'Başarısız ödeme URL zorunludur'
                  }
                  
                  // URL validation
                  const urlRegex = /^https?:\/\/.+/
                  if (paytrSettings.successUrl && !urlRegex.test(paytrSettings.successUrl)) {
                    newErrors.successUrl = 'Geçerli bir URL girin (http:// veya https:// ile başlamalı)'
                  }
                  if (paytrSettings.failUrl && !urlRegex.test(paytrSettings.failUrl)) {
                    newErrors.failUrl = 'Geçerli bir URL girin (http:// veya https:// ile başlamalı)'
                  }
                  
                  setPaytrErrors(newErrors)
                  
                  if (Object.keys(newErrors).length > 0) {
                    return
                  }
                  
                  try {
                    const auth = localStorage.getItem('adminAuth')
                    if (!auth) return
                    
                    const { token } = JSON.parse(auth)
                    const paytrData = {
                      paytrMerchantId: paytrSettings.merchantId,
                      paytrMerchantKey: paytrSettings.merchantKey,
                      paytrMerchantSalt: paytrSettings.merchantSalt,
                      paytrSuccessUrl: paytrSettings.successUrl,
                      paytrFailUrl: paytrSettings.failUrl
                    }
                    
                    const response = await fetch('/api/admin/settings', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify(paytrData)
                    })
                    
                    if (response.ok) {
                      showToast('PayTR ayarları kaydedildi', 'success')
                      setShowPayTRModal(false)
                      setPaytrErrors({})
                      
                      // Automatically enable credit card payment method
                      if (!formData.paymentMethods.creditCard) {
                        const updatedFormData = {
                          ...formData,
                          paymentMethods: { ...formData.paymentMethods, creditCard: true }
                        }
                        setFormData(updatedFormData)
                        
                        // Save the updated payment method
                        const auth = localStorage.getItem('adminAuth')
                        if (auth) {
                          const { token } = JSON.parse(auth)
                          await fetch('/api/admin/settings', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ paymentMethods: updatedFormData.paymentMethods })
                          })
                        }
                      }
                    } else {
                      throw new Error('PayTR ayarları kaydedilemedi')
                    }
                  } catch (error) {
                    console.error('Error saving PayTR settings:', error)
                    showToast('PayTR ayarları kaydedilirken hata oluştu', 'error')
                  }
                }}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Bank Account Settings Modal */}
      {showBankModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Banka Hesapları</h3>
              <button
                type="button"
                onClick={() => {
                  setShowBankModal(false)
                  setBankErrors({})
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              {bankAccounts.map((account, index) => (
                <div key={account.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Banka Adı <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={account.bankName}
                        onChange={(e) => {
                          const newAccounts = [...bankAccounts]
                          newAccounts[index].bankName = e.target.value
                          setBankAccounts(newAccounts)
                          if (bankErrors[`${account.id}_bankName`]) {
                            const newErrors = { ...bankErrors }
                            delete newErrors[`${account.id}_bankName`]
                            setBankErrors(newErrors)
                          }
                        }}
                        placeholder="Örn: Ziraat Bankası"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm ${
                          bankErrors[`${account.id}_bankName`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {bankErrors[`${account.id}_bankName`] && (
                        <p className="text-xs text-red-500 mt-1">{bankErrors[`${account.id}_bankName`]}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Hesap Sahibi <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={account.accountHolder}
                        onChange={(e) => {
                          const newAccounts = [...bankAccounts]
                          newAccounts[index].accountHolder = e.target.value
                          setBankAccounts(newAccounts)
                          if (bankErrors[`${account.id}_accountHolder`]) {
                            const newErrors = { ...bankErrors }
                            delete newErrors[`${account.id}_accountHolder`]
                            setBankErrors(newErrors)
                          }
                        }}
                        placeholder="Ad Soyad / Firma Adı"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm ${
                          bankErrors[`${account.id}_accountHolder`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {bankErrors[`${account.id}_accountHolder`] && (
                        <p className="text-xs text-red-500 mt-1">{bankErrors[`${account.id}_accountHolder`]}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        IBAN <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={account.iban}
                        onChange={(e) => {
                          const newAccounts = [...bankAccounts]
                          const formattedIBAN = formatIBAN(e.target.value)
                          newAccounts[index].iban = formattedIBAN
                          setBankAccounts(newAccounts)
                          if (bankErrors[`${account.id}_iban`]) {
                            const newErrors = { ...bankErrors }
                            delete newErrors[`${account.id}_iban`]
                            setBankErrors(newErrors)
                          }
                        }}
                        placeholder="0000 0000 0000 0000 0000 00"
                        maxLength={32}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm font-mono ${
                          bankErrors[`${account.id}_iban`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {bankErrors[`${account.id}_iban`] && (
                        <p className="text-xs text-red-500 mt-1">{bankErrors[`${account.id}_iban`]}</p>
                      )}
                      {!bankErrors[`${account.id}_iban`] && (
                        <p className="text-xs text-gray-500 mt-1">TR otomatik eklenir</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Şube (Opsiyonel)
                      </label>
                      <input
                        type="text"
                        value={account.branch || ''}
                        onChange={(e) => {
                          const newAccounts = [...bankAccounts]
                          newAccounts[index].branch = e.target.value
                          setBankAccounts(newAccounts)
                        }}
                        placeholder="Şube adı veya kodu"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setBankAccounts(bankAccounts.filter((_, i) => i !== index))
                    }}
                    className="mt-3 text-sm text-red-600 hover:text-red-700"
                  >
                    Bu hesabı kaldır
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => {
                  setBankAccounts([
                    ...bankAccounts,
                    {
                      id: Date.now().toString(),
                      bankName: '',
                      accountHolder: '',
                      iban: '',
                      branch: ''
                    }
                  ])
                }}
                className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 hover:text-gray-700 transition-colors"
              >
                + Yeni Banka Hesabı Ekle
              </button>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowBankModal(false)
                  setBankErrors({})
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={async () => {
                  // Validation
                  const newErrors: Record<string, string> = {}
                  
                  if (bankAccounts.length === 0) {
                    showToast('En az bir banka hesabı eklemelisiniz', 'error')
                    return
                  }
                  
                  bankAccounts.forEach((account) => {
                    if (!account.bankName.trim()) {
                      newErrors[`${account.id}_bankName`] = 'Banka adı zorunludur'
                    }
                    
                    if (!account.accountHolder.trim()) {
                      newErrors[`${account.id}_accountHolder`] = 'Hesap sahibi zorunludur'
                    }
                    
                    if (!account.iban.trim()) {
                      newErrors[`${account.id}_iban`] = 'IBAN zorunludur'
                    } else {
                      // IBAN format validation (basic Turkish IBAN check)
                      const ibanRegex = /^TR\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{2}$/
                      const cleanIban = account.iban.replace(/\s/g, '')
                      if (!ibanRegex.test(cleanIban)) {
                        newErrors[`${account.id}_iban`] = 'Geçerli bir IBAN girin (TR ile başlamalı)'
                      }
                    }
                  })
                  
                  setBankErrors(newErrors)
                  
                  if (Object.keys(newErrors).length > 0) {
                    return
                  }
                  
                  try {
                    const auth = localStorage.getItem('adminAuth')
                    if (!auth) return
                    
                    const { token } = JSON.parse(auth)
                    const response = await fetch('/api/admin/settings', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify({
                        bankAccounts: JSON.stringify(bankAccounts)
                      })
                    })
                    
                    if (response.ok) {
                      showToast('Banka hesapları kaydedildi', 'success')
                      setShowBankModal(false)
                      setBankErrors({})
                      
                      // Automatically enable bank transfer payment method
                      if (!formData.paymentMethods.bankTransfer) {
                        const updatedFormData = {
                          ...formData,
                          paymentMethods: { ...formData.paymentMethods, bankTransfer: true }
                        }
                        setFormData(updatedFormData)
                        
                        // Save the updated payment method
                        const auth = localStorage.getItem('adminAuth')
                        if (auth) {
                          const { token } = JSON.parse(auth)
                          await fetch('/api/admin/settings', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ paymentMethods: updatedFormData.paymentMethods })
                          })
                        }
                      }
                    } else {
                      throw new Error('Banka hesapları kaydedilemedi')
                    }
                  } catch (error) {
                    console.error('Error saving bank accounts:', error)
                    showToast('Banka hesapları kaydedilirken hata oluştu', 'error')
                  }
                }}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}