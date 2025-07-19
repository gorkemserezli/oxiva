'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function InitialLoader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Her sayfa yüklemesinde göster
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500) // 1.5 saniye

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
        >
          <div className="text-center">
            {/* Logo Animation */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 0, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="mb-8"
            >
              <Image
                src="/images/logo.png"
                alt="Oxiva"
                width={200}
                height={66}
                className="mx-auto"
                priority
              />
            </motion.div>

            {/* Loading Dots */}
            <div className="flex justify-center space-x-2">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: "easeInOut"
                  }}
                  className="w-3 h-3 bg-primary-500 rounded-full"
                />
              ))}
            </div>

            {/* Loading Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-gray-600 text-sm"
            >
              Yükleniyor...
            </motion.p>

            {/* Progress Bar */}
            <motion.div className="mt-8 w-64 mx-auto">
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}