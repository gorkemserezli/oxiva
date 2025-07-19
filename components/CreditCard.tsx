'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface CreditCardProps {
  cardNumber: string
  cardName: string
  expiryDate: string
  cvv: string
  isFlipped: boolean
}

export default function CreditCard({ cardNumber, cardName, expiryDate, cvv, isFlipped }: CreditCardProps) {
  // Format card number for display
  const formatCardDisplay = (number: string) => {
    const cleaned = number.replace(/\s/g, '')
    const groups = []
    for (let i = 0; i < 16; i += 4) {
      if (i < cleaned.length) {
        groups.push(cleaned.slice(i, Math.min(i + 4, cleaned.length)))
      } else if (i < 16) {
        groups.push('••••')
      }
    }
    return groups.join(' ')
  }

  // Detect card type
  const getCardType = (number: string) => {
    const firstDigit = number.charAt(0)
    const firstTwo = number.slice(0, 2)
    
    if (firstDigit === '4') return 'visa'
    if (['51', '52', '53', '54', '55'].includes(firstTwo)) return 'mastercard'
    if (['34', '37'].includes(firstTwo)) return 'amex'
    if (firstDigit === '9') return 'troy'
    return 'default'
  }

  const cardType = getCardType(cardNumber)

  return (
    <div className="relative w-full max-w-sm mx-auto h-56 perspective-1000">
      <motion.div
        className="relative w-full h-full transition-transform duration-700 preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front of card */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl overflow-hidden">
            {/* Card pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-x-24 translate-y-24" />
            </div>

            {/* Card content */}
            <div className="relative h-full p-6 flex flex-col justify-between">
              {/* Card type logo */}
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                  <div className="w-8 h-6 bg-yellow-500 rounded" />
                </div>
                <div className="text-white text-sm font-medium">
                  {cardType.toUpperCase()}
                </div>
              </div>

              {/* Card number */}
              <div className="mt-8">
                <div className="text-white text-xl tracking-wider font-mono">
                  {formatCardDisplay(cardNumber)}
                </div>
              </div>

              {/* Card holder and expiry */}
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-gray-400 text-xs uppercase">Card Holder</div>
                  <div className="text-white text-sm mt-1 uppercase">
                    {cardName || 'YOUR NAME'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs uppercase">Expires</div>
                  <div className="text-white text-sm mt-1">
                    {expiryDate || 'MM/YY'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div className="absolute inset-0 w-full h-full rotate-y-180 backface-hidden">
          <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl overflow-hidden">
            {/* Magnetic strip */}
            <div className="absolute top-8 left-0 right-0 h-12 bg-gray-800" />

            {/* Signature panel */}
            <div className="absolute top-24 left-6 right-6">
              <div className="bg-gray-100 h-10 rounded flex items-center px-4">
                <div className="flex-1"></div>
                <div className="bg-white px-3 py-1 rounded text-gray-900 font-mono text-sm">
                  {cvv || 'CVV'}
                </div>
              </div>
            </div>

            {/* Card info */}
            <div className="absolute bottom-4 left-6 right-6">
              <p className="text-gray-400 text-[10px] leading-tight">
                This card is property of the issuing bank. If found, please return to any branch.
                Use of this card is subject to the terms and conditions of the cardholder agreement.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}