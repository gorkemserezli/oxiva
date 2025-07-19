'use client'

import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

const comparisonData = [
  {
    feature: "Horlama Çözümü",
    traditional: "Geçici rahatlama",
    oxiva: "Kalıcı çözüm"
  },
  {
    feature: "Kullanım Kolaylığı",
    traditional: false,
    oxiva: true
  },
  {
    feature: "Uyku Kalitesi",
    traditional: "Düşük",
    oxiva: "Yüksek"
  },
  {
    feature: "Yan Etki",
    traditional: true,
    oxiva: false
  },
  {
    feature: "Hijyenik",
    traditional: false,
    oxiva: true
  },
  {
    feature: "Ekonomik",
    traditional: false,
    oxiva: true
  },
  {
    feature: "Taşınabilir",
    traditional: false,
    oxiva: true
  },
  {
    feature: "Doğal Çözüm",
    traditional: false,
    oxiva: true
  }
]

export default function ComparisonSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container-max section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Neden Oxiva?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Geleneksel yöntemler ile Oxiva'yı karşılaştırın
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-50 text-center">
              <div className="p-6 font-semibold text-gray-700">
                Özellik
              </div>
              <div className="p-6 font-semibold text-gray-700 border-x border-gray-200">
                Geleneksel Yöntemler
              </div>
              <div className="p-6 font-semibold text-primary-600 bg-primary-50">
                Oxiva
              </div>
            </div>

            {comparisonData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="grid grid-cols-3 border-t border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="p-6 font-medium text-gray-900">
                  {item.feature}
                </div>
                <div className="p-6 text-center border-x border-gray-200">
                  {typeof item.traditional === 'boolean' ? (
                    item.traditional ? (
                      <X className="w-6 h-6 text-red-500 mx-auto" />
                    ) : (
                      <X className="w-6 h-6 text-red-500 mx-auto" />
                    )
                  ) : (
                    <span className="text-gray-600">{item.traditional}</span>
                  )}
                </div>
                <div className="p-6 text-center bg-green-50/30">
                  {typeof item.oxiva === 'boolean' ? (
                    item.oxiva ? (
                      <Check className="w-6 h-6 text-green-500 mx-auto" />
                    ) : (
                      <X className="w-6 h-6 text-red-500 mx-auto" />
                    )
                  ) : (
                    <span className="text-green-700 font-medium">{item.oxiva}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600 mb-6">
              Oxiva ile horlama problemine doğal ve kalıcı çözüm
            </p>
            <Link 
              href="/checkout"
              className="inline-flex items-center bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-3 rounded-full hover:from-primary-600 hover:to-primary-700 transition-all transform hover:scale-105 shadow-md font-medium"
            >
              Hemen Deneyin
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

import Link from 'next/link'