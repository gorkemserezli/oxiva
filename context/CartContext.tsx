'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  stock: number
  images: string[]
}

interface CartContextType {
  quantity: number
  setQuantity: (quantity: number) => void
  price: number
  discountedPrice: number
  product: Product | null
  loading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Fetch product data
    const fetchProduct = async () => {
      try {
        const response = await fetch('/api/products?slug=oxiva-miknatisli-burun-bandi')
        if (response.ok) {
          const data = await response.json()
          if (data) {
            setProduct(data)
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProduct()
  }, [])
  
  // Fiyat hesaplama mantığı
  const basePrice = product?.comparePrice || 599 // Normal fiyat
  const getDiscountedPrice = (qty: number) => {
    if (!product) return 499
    
    // Quantity-based discounts
    if (qty >= 3) return 349 // 3 veya daha fazla alımda
    if (qty >= 2) return 399 // 2 alımda
    return product.price || 449 // 1 alımda
  }
  
  const price = basePrice
  const discountedPrice = getDiscountedPrice(quantity)

  return (
    <CartContext.Provider value={{ quantity, setQuantity, price, discountedPrice, product, loading }}>
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