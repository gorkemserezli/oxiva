'use client'

import { motion } from 'framer-motion'
import { Users, Shield, RefreshCw, Truck } from 'lucide-react'

const trustItems = [
  {
    icon: Users,
    value: "2000+",
    label: "Mutlu Müşteri"
  },
  {
    icon: Shield,
    value: "30 Gün",
    label: "İade Garantisi"
  },
  {
    icon: RefreshCw,
    value: "%100",
    label: "Memnuniyet"
  },
  {
    icon: Truck,
    value: "Ücretsiz",
    label: "Kargo"
  }
]

export default function TrustBar() {
  return (
    <section className="py-8 bg-gray-50 border-b border-gray-100">
      <div className="container-max section-padding">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex items-center justify-center gap-3"
            >
              <item.icon className="w-8 h-8 text-primary-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                <p className="text-sm text-gray-600">{item.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}