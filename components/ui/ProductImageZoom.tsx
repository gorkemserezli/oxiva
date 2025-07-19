'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductImageZoomProps {
  className?: string
}

export default function ProductImageZoom({ className = "" }: ProductImageZoomProps) {
  const [imageError, setImageError] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePosition({ x, y })
  }

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
    <div 
      className={`relative overflow-hidden rounded-xl cursor-zoom-in ${className}`}
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      <Image
        src="/images/product.jpg"
        alt="Oxiva Mıknatıslı Burun Bandı"
        width={600}
        height={600}
        className={`w-full h-full object-cover transition-transform duration-300 ${
          isZoomed ? 'scale-150' : 'scale-100'
        }`}
        style={{
          transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
        }}
        onError={() => setImageError(true)}
      />
      
      {/* Zoom indicator */}
      {!isZoomed && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
          Yakınlaştır
        </div>
      )}
    </div>
  )
}