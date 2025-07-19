'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ProductImageProps {
  className?: string
}

export default function ProductImage({ className = "" }: ProductImageProps) {
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    return (
      <div className={`bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
            <svg className="w-16 h-16 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">
            Mıknatıslı Burun Bandı
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src="/images/product.jpg"
        alt="Oxiva Mıknatıslı Burun Bandı"
        width={600}
        height={600}
        className="w-full h-full object-cover rounded-xl"
        onError={() => setImageError(true)}
      />
    </div>
  )
}