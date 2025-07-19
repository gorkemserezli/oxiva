'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { CheckCircle, Target, Eye, Heart } from 'lucide-react'

export default function AboutPage() {
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
              Hakkımızda
            </h1>
            <p className="text-lg text-gray-600">
              Oxiva olarak, horlama sorununuza doğal ve etkili çözümler sunmak için varız. 
              Kaliteli uyku herkesin hakkı!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container-max section-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Hikayemiz
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Oxiva, horlama problemi yaşayan milyonlarca insanın hayat kalitesini 
                  artırmak amacıyla kuruldu. Ekibimiz, uyku kalitesinin genel sağlık 
                  üzerindeki etkisini bilerek, en etkili ve konforlu çözümü sunmak için 
                  çalıştı.
                </p>
                <p>
                  Mıknatıslı burun bandımız, yılların araştırma ve geliştirme sürecinin 
                  sonucunda ortaya çıktı. Medikal silikon malzeme ve patentli mıknatıs 
                  teknolojisi ile üretilen ürünümüz, binlerce kullanıcının onayını aldı.
                </p>
                <p>
                  Bugün, Türkiye'nin dört bir yanındaki müşterilerimize hizmet vermekten 
                  ve onların daha kaliteli uyumalarına yardımcı olmaktan gurur duyuyoruz.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-50 rounded-2xl p-8"
            >
              <Image
                src="/images/logo.png"
                alt="Oxiva"
                width={300}
                height={100}
                className="mx-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="container-max section-padding">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0 }}
              className="text-center"
            >
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Misyonumuz</h3>
              <p className="text-gray-600">
                İnsanların daha sağlıklı ve kaliteli uyumalarını sağlayarak, 
                yaşam kalitelerini artırmak.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Vizyonumuz</h3>
              <p className="text-gray-600">
                Uyku sağlığı alanında Türkiye'nin lider markası olmak ve 
                dünyaya açılmak.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Değerlerimiz</h3>
              <p className="text-gray-600">
                Kalite, güven, müşteri memnuniyeti ve sürekli gelişim 
                ilkelerimizdir.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container-max section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Neden Bizi Tercih Etmelisiniz?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-4 max-w-4xl mx-auto">
            <div className="space-y-4">
              {[
                "FDA onaylı medikal silikon malzeme",
                "30 gün iade garantisi",
                "7/24 müşteri desteği"
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </motion.div>
              ))}
            </div>
            <div className="space-y-4 md:pl-16">
              {[
                "Patentli mıknatıs teknolojisi",
                "Ücretsiz kargo imkanı",
                "Binlerce mutlu müşteri"
              ].map((item, index) => (
                <motion.div
                  key={index + 3}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: (index + 3) * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}