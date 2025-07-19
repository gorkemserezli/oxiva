'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface CartContextType {
  quantity: number
  setQuantity: (quantity: number) => void
  price: number
  discountedPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [quantity, setQuantity] = useState(1)
  const price = 199
  const discountedPrice = 159

  return (
    <CartContext.Provider value={{ quantity, setQuantity, price, discountedPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}