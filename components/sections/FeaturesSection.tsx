'use client'

import { Moon, Wind, Heart, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: Wind,
    title: "Doğal Hava Akışı",
    description: "Burun deliklerinizi nazikçe açarak doğal nefes almanızı sağlar."
  },
  {
    icon: Moon,
    title: "Rahat Uyku",
    description: "Horlama problemini çözerek siz ve partneriniz için kaliteli uyku sağlar."
  },
  {
    icon: Heart,
    title: "Sağlıklı Malzeme",
    description: "BPA içermeyen, medikal silikon malzemeden üretilmiştir."
  },
  {
    icon: Shield,
    title: "Güvenli Kullanım",
    description: "Dermatolojik testlerden geçmiş, cilt dostu yapıya sahiptir."
  }
]

export default function FeaturesSection() {
  return (
    <section id="benefits" className="py-20 bg-white">
      <div className="container-max section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Oxiva&apos;nın Avantajları
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Patentli mıknatıs teknolojisi ile üretilen burun bandımız, 
            size en konforlu ve etkili çözümü sunar.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="bg-primary-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <feature.icon className="w-7 h-7 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}