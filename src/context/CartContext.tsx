"use client"
import React, { createContext, useContext, useState } from 'react'

export interface CartItem {
  productId: string
  title: string
  price: number
  qty: number
  sellerId: string
  image: string
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  getCartTotal: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.productId === item.productId)
      if (existing) {
        return prevCart.map((i) =>
          i.productId === item.productId ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...prevCart, { ...item, qty: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId))
  }

  const clearCart = () => setCart([])

  const getCartTotal = () => cart.reduce((total, item) => total + item.price * item.qty, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within a CartProvider")
  return context
}