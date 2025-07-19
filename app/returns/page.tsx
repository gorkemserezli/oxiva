'use client'

import { motion } from 'framer-motion'
import { RotateCcw, Shield, Clock, Package, CheckCircle, XCircle } from 'lucide-react'

export default function ReturnsPage() {
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
              İade ve Değişim
            </h1>
            <p className="text-lg text-gray-600">
              30 gün içinde koşulsuz iade garantisi ile güvenle alışveriş yapın.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Return Features */}
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
                <RotateCcw className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">30 Gün İade Hakkı</h3>
              <p className="text-gray-600">
                Ürününüzü 30 gün içinde iade edebilirsiniz.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Güvenli İade</h3>
              <p className="text-gray-600">
                İade süreciniz güvence altındadır.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Hızlı İşlem</h3>
              <p className="text-gray-600">
                İade talebiniz hızlıca işleme alınır.
              </p>
            </motion.div>
          </div>

          {/* Return Policy */}
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                İade Koşulları
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-600">
                    Ürünler orijinal ambalajında ve kullanılmamış olmalıdır.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-600">
                    Fatura ve tüm aksesuarlar eksiksiz olmalıdır.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-600">
                    İade formu doldurulmuş olmalıdır.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-600">
                    Ürün teslim alındıktan sonra 30 gün içinde iade edilmelidir.
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mt-8 mb-4">
                İade Edilemeyen Durumlar
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-600">
                    Kullanılmış veya hasar görmüş ürünler.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-600">
                    Orijinal ambalajı olmayan ürünler.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-600">
                    30 günlük süreyi aşan iadeler.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                İade Süreci
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">İade Talebi</h4>
                    <p className="text-gray-600">
                      info@oxiva.com adresine iade talebinizi iletin veya 
                      müşteri hizmetlerini arayın.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Onay</h4>
                    <p className="text-gray-600">
                      İade talebiniz incelenir ve size onay e-postası gönderilir.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Kargo</h4>
                    <p className="text-gray-600">
                      Ürünü iade formu ile birlikte bize gönderin. 
                      Kargo ücreti tarafımızdan karşılanır.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">İnceleme</h4>
                    <p className="text-gray-600">
                      Ürün tarafımıza ulaştığında kontrol edilir.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                    5
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Ödeme İadesi</h4>
                    <p className="text-gray-600">
                      Onaylanan iadeler için ödemeniz 3-5 iş günü içinde 
                      iade edilir.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-primary-50 rounded-xl p-6 mt-8">
                <h3 className="font-semibold text-gray-900 mb-3">
                  <Package className="w-5 h-5 inline-block mr-2 text-primary-600" />
                  Değişim İşlemleri
                </h3>
                <p className="text-gray-600">
                  Ürün değişimi için de aynı süreç geçerlidir. 
                  Değişim talebinizde yeni ürün tercihinizi belirtmeniz yeterlidir.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-max section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              İade ve Değişim İçin İletişim
            </h2>
            <p className="text-gray-600 mb-8">
              İade ve değişim işlemleriniz için bizimle iletişime geçebilirsiniz.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:info@oxiva.com"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                E-posta Gönder
              </a>
              <a
                href="tel:0850XXXXXXX"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 transition-colors"
              >
                Bizi Arayın
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}