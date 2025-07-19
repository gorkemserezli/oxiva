'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import ProductImage from '@/components/ui/ProductImage'

export default function HeroSection() {
  const benefits = [
    "Horlama problemine anında çözüm",
    "Rahat nefes alma imkanı",
    "Kaliteli ve derin uyku",
    "Medikal silikon malzeme"
  ]

  return (
    <section className="relative bg-white py-20 lg:py-28 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent-300 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container-max section-padding relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Rahat Nefes,
              <span className="text-primary-500 block">Huzurlu Uyku</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Oxiva mıknatıslı burun bandı ile horlama sorununuza doğal ve etkili çözüm. 
              Burun deliklerinizi nazikçe açarak rahat nefes almanızı sağlar.
            </p>

            <ul className="space-y-3 mb-8">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-center text-gray-700"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>{benefit}</span>
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/checkout"
                className="inline-flex items-center justify-center bg-primary-500 text-white px-8 py-3 rounded-full hover:bg-primary-600 transition-all transform hover:scale-105 shadow-lg"
              >
                Hemen Satın Al
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link 
                href="/product"
                className="inline-flex items-center justify-center border-2 border-primary-500 text-primary-500 px-8 py-3 rounded-full hover:bg-primary-50 transition-colors"
              >
                Ürün Detayları
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-8">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i}
                    className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white"
                  />
                ))}
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-gray-900">1000+</span> mutlu müşteri
                </p>
              </div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-primary-100 to-accent-100 rounded-3xl p-8">
              <div className="aspect-square bg-white rounded-2xl shadow-xl overflow-hidden">
                <ProductImage className="w-full h-full" />
              </div>
              
              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg"
              >
                %20 İndirim
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}