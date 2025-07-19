'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

const tabs = [
  {
    id: 'description',
    label: 'Ürün Açıklaması',
    content: (
      <div className="prose prose-lg max-w-none text-gray-700">
        <p>
          Oxiva mıknatıslı burun bandı, horlama ve nefes alma problemlerine karşı geliştirilmiş 
          yenilikçi bir çözümdür. Özel mıknatıs teknolojisi sayesinde burun deliklerinizi nazikçe 
          açarak hava akışını artırır ve rahat nefes almanızı sağlar.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Neden Oxiva?</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>FDA onaylı medikal silikon malzeme</li>
          <li>Patentli mıknatıs teknolojisi</li>
          <li>Dermatolojik olarak test edilmiş</li>
          <li>Spor yaparken bile kullanılabilir</li>
          <li>Sessiz ve rahat uyku garantisi</li>
        </ul>
        <h3 className="text-xl font-semibold mt-6 mb-3">Paket İçeriği</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>1 adet Oxiva mıknatıslı burun bandı</li>
          <li>Hijyenik saklama kutusu</li>
          <li>Kullanım kılavuzu</li>
        </ul>
      </div>
    )
  },
  {
    id: 'usage',
    label: 'Kullanım Talimatı',
    content: (
      <div className="space-y-6">
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-blue-800">
            <strong>Önemli:</strong> İlk kullanımdan önce ürünü ılık su ile yıkayın ve kurulayın.
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
              1
            </div>
            <div>
              <h4 className="font-semibold mb-1">Temizlik</h4>
              <p className="text-gray-600">Burun bölgenizi temizleyin ve kurulayın.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
              2
            </div>
            <div>
              <h4 className="font-semibold mb-1">Yerleştirme</h4>
              <p className="text-gray-600">Mıknatısları burun deliklerinizin dış kısmına nazikçe yerleştirin.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
              3
            </div>
            <div>
              <h4 className="font-semibold mb-1">Ayarlama</h4>
              <p className="text-gray-600">Rahat edene kadar pozisyonu ayarlayın. Baskı yapmamalıdır.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
              4
            </div>
            <div>
              <h4 className="font-semibold mb-1">Temizlik ve Saklama</h4>
              <p className="text-gray-600">Kullanım sonrası ılık su ile yıkayın ve kutusunda saklayın.</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'shipping',
    label: 'Kargo Bilgileri',
    content: (
      <div className="space-y-6">
        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <h4 className="font-semibold text-green-800 mb-2">Ücretsiz Kargo</h4>
          <p className="text-green-700">Tüm siparişlerinizde ücretsiz kargo avantajı!</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Teslimat Süreleri</h4>
            <ul className="space-y-2 text-gray-600">
              <li>• İstanbul: 1-2 iş günü</li>
              <li>• Ankara, İzmir: 1-3 iş günü</li>
              <li>• Diğer iller: 2-4 iş günü</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Kargo Firmaları</h4>
            <ul className="space-y-2 text-gray-600">
              <li>• Aras Kargo</li>
              <li>• Yurtiçi Kargo</li>
              <li>• MNG Kargo</li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-6">
          <h4 className="font-semibold mb-3">İade ve Değişim</h4>
          <p className="text-gray-600 mb-3">
            30 gün koşulsuz iade garantisi ile alışveriş yapın. Ürünü beğenmezseniz, 
            kullanılmamış olması koşuluyla iade edebilirsiniz.
          </p>
          <ul className="space-y-2 text-gray-600">
            <li>• İade kargo ücreti tarafımızca karşılanır</li>
            <li>• İade işlemi 7 iş günü içinde tamamlanır</li>
            <li>• Ücret iadesi aynı ödeme yöntemi ile yapılır</li>
          </ul>
        </div>
      </div>
    )
  }
]

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState('description')
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})

  useEffect(() => {
    // Scroll to active tab when it changes
    const activeTabElement = tabRefs.current[activeTab]
    const container = tabsContainerRef.current
    
    if (activeTabElement && container) {
      const containerWidth = container.offsetWidth
      const tabLeft = activeTabElement.offsetLeft
      const tabWidth = activeTabElement.offsetWidth
      const scrollLeft = tabLeft - (containerWidth / 2) + (tabWidth / 2)
      
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      })
    }
  }, [activeTab])

  return (
    <section className="py-12 bg-gray-50">
      <div className="container-max section-padding">
        <div className="max-w-4xl mx-auto">
          {/* Tab Headers */}
          <div className="border-b border-gray-200 mb-8 -mx-4 sm:mx-0">
            <div 
              ref={tabsContainerRef}
              className="flex overflow-x-auto scrollbar-hide px-4 sm:px-0 sm:flex-wrap"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  ref={(el) => (tabRefs.current[tab.id] = el)}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 sm:px-6 py-3 font-medium transition-all relative whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab.id
                      ? 'text-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {tabs.find(tab => tab.id === activeTab)?.content}
          </motion.div>
        </div>
      </div>
    </section>
  )
}