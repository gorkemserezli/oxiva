'use client'

import { motion } from 'framer-motion'
import { Truck, Package, Clock, MapPin, Shield, CheckCircle } from 'lucide-react'

export default function ShippingPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="container-max section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Kargo Bilgileri
            </h1>
            <p className="text-lg text-gray-600">
              Hızlı, güvenli ve ücretsiz kargo ile siparişleriniz kapınızda!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Shipping Features */}
      <section className="py-16">
        <div className="container-max section-padding">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0 }}
              className="text-center"
            >
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Ücretsiz Kargo</h3>
              <p className="text-gray-600">
                Tüm siparişlerinizde ücretsiz kargo fırsatından yararlanın.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Hızlı Teslimat</h3>
              <p className="text-gray-600">
                1-3 iş günü içinde siparişiniz adresinize teslim edilir.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Güvenli Paketleme</h3>
              <p className="text-gray-600">
                Ürünleriniz özel paketleme ile güvenle teslim edilir.
              </p>
            </motion.div>
          </div>

          {/* Detailed Information */}
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Kargo Süreci Nasıl İşler?
              </h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Sipariş Onayı</h4>
                    <p className="text-gray-600">
                      Siparişiniz alındıktan sonra size onay e-postası gönderilir.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Hazırlık</h4>
                    <p className="text-gray-600">
                      Ürününüz özenle paketlenir ve kargoya hazır hale getirilir.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Kargo Teslimi</h4>
                    <p className="text-gray-600">
                      Siparişiniz anlaşmalı kargo firmasına teslim edilir.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Teslimat</h4>
                    <p className="text-gray-600">
                      1-3 iş günü içinde siparişiniz adresinize teslim edilir.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Teslimat Bilgileri
              </h2>

              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Teslimat Süreleri</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      İstanbul: 1-2 iş günü
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Ankara, İzmir: 1-2 iş günü
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Diğer iller: 2-3 iş günü
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Kargo Firmaları</h4>
                  <p className="text-gray-600">
                    Aras Kargo, MNG Kargo ve PTT Kargo ile çalışmaktayız.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Kargo Takibi</h4>
                  <p className="text-gray-600">
                    Kargoya verilen siparişlerinizin takip numarası 
                    e-posta ile tarafınıza iletilir.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Önemli Notlar</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Hafta içi 16:00'ya kadar verilen siparişler aynı gün kargoya verilir.</li>
                    <li>• Cumartesi günü verilen siparişler pazartesi kargoya verilir.</li>
                    <li>• Resmi tatillerde kargo hizmeti bulunmamaktadır.</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-max section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sıkça Sorulan Sorular
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-lg p-6"
            >
              <h4 className="font-semibold text-gray-900 mb-2">
                Kargo ücreti var mı?
              </h4>
              <p className="text-gray-600">
                Hayır, tüm siparişlerinizde kargo ücretsizdir.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg p-6"
            >
              <h4 className="font-semibold text-gray-900 mb-2">
                Siparişimi nasıl takip edebilirim?
              </h4>
              <p className="text-gray-600">
                Kargoya verilen siparişinizin takip numarası e-posta adresinize 
                gönderilecektir. Bu numara ile kargo firmasının web sitesinden 
                takip yapabilirsiniz.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-lg p-6"
            >
              <h4 className="font-semibold text-gray-900 mb-2">
                Teslimat adresimi değiştirebilir miyim?
              </h4>
              <p className="text-gray-600">
                Siparişiniz kargoya verilmeden önce bizimle iletişime geçerek 
                adres değişikliği yapabilirsiniz.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}