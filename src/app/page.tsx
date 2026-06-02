"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from "@/context/CartContext"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Card, CardContent, CardFooter } from "@/components/ui/card" 
import { ShoppingCart, Trash2, Store, Loader2 } from "lucide-react"

interface Product {
  productId: string
  title: string
  description: string
  price: number
  originalPrice?: number
  category: string // 💡 નવી ફિલ્ડ એડ કરી
  inventoryQty: number
  images: string[]
  sellerId: string
}

const ITEMS_PER_PAGE = 70

export default function CatalogPage() {
  const { cart, addToCart, removeFromCart, getCartTotal } = useCart()
  const router = useRouter()
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [currentPage, setCurrentPage] = useState<number>(1)

  const totalCartCount = cart.reduce((acc, item) => acc + item.qty, 0)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('http://localhost:5000/api/products')
        if (!res.ok) throw new Error("Offline")
        const data = await res.json()
        if (data.success) setProducts(data.products || [])
      } catch (err) {
        // ટેસ્ટિંગ માટે કેટેગરી વાઈઝ મોક ડેટાબેઝ એરે
        const mockArray = Array.from({ length: 20 }, (_, index) => {
          const categories = ["Audio", "Wearables", "Computing", "Gaming"]
          const cat = categories[index % categories.length]
          return {
            productId: `PROD-${100 + index}`,
            title: `${cat} Premium Device Model X-${index + 1}`,
            description: "Full professional enterprise breakdown data of this merchant stock unit.",
            price: 499 + (index * 120),
            originalPrice: 799 + (index * 120),
            category: cat,
            inventoryQty: 30,
            images: [
              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80'
            ],
            sellerId: `SEL-${800 + index}`
          }
        })
        setProducts(mockArray)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // 🗂️ સેલર્સના ડેટામાંથી ઓટોમેટિક યુનિક કેટેગરી લિસ્ટ કાઢવું
  const uniqueCategories = ["All", ...Array.from(new Set(products.map(p => p.category)))]

  // 🔍 કેટેગરી વાઇઝ ફિલ્ટરિંગ લોજિક
  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(p => p.category === selectedCategory)

  // Pagination ગણતરી
  const indexOfLastProduct = currentPage * ITEMS_PER_PAGE
  const indexOfFirstProduct = indexOfLastProduct - ITEMS_PER_PAGE
  const displayedProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Main Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-white p-4 shadow-sm pb-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
            🏙️ <span className="text-blue-600">Next</span>Market
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/" className="text-blue-600 font-semibold">Home</Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">About Us</Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 relative gap-2 cursor-pointer">
                <ShoppingCart className="h-4 w-4" />
                Cart
                {totalCartCount > 0 && <Badge className="ml-1 bg-blue-600 rounded-full px-2 text-white">{totalCartCount}</Badge>}
              </SheetTrigger>
              <SheetContent>
                <SheetHeader><SheetTitle>Your Shopping Cart</SheetTitle></SheetHeader>
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500"><p>Your cart is empty.</p></div>
                ) : (
                  <div className="flex flex-col h-full justify-between pb-6">
                    <div className="overflow-y-auto space-y-4 my-4 max-h-[70vh]">
                      {cart.map((item) => (
                        <div key={item.productId} className="flex items-center justify-between border-b pb-2">
                          <div>
                            <p className="font-medium text-sm line-clamp-1">{item.title}</p>
                            <p className="text-xs text-gray-500">₹{item.price} × {item.qty}</p>
                          </div>
                          <button className="text-red-500 p-1" onClick={() => removeFromCart(item.productId)}><Trash2 className="h-4 w-4" /></button>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4 border-t pt-4">
                      <div className="flex justify-between font-bold text-lg"><span>Total:</span><span>₹{getCartTotal()}</span></div>
                      <Link href="/checkout" className="w-full block">
                        <button className="w-full bg-blue-600 text-white font-medium rounded-lg h-10 cursor-pointer">Proceed to Checkout</button>
                      </Link>
                    </div>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* 🗂️ 1. UNDER HEADER CATEGORY RIBBON BAR */}
        <div className="max-w-7xl mx-auto flex items-center gap-2 mt-4 overflow-x-auto no-scrollbar border-t pt-3">
          {uniqueCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat 
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Main Catalog Showcase */}
      <section className='py-12'>
        <div className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'>
          <h2 className='mb-8 text-2xl font-bold md:text-3xl'>Today's Best Deals For You!</h2>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
          ) : (
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:gap-6 xl:grid-cols-6'>
              {displayedProducts.map(product => (
                <Card
                  key={product.productId}
                  // 💡 2. ક્લિક કરતાની સાથે આઈડી બેઝ્ડ પેજ ઓપન થશે
                  onClick={() => router.push(`/product/${product.productId}`)}
                  className='flex flex-col gap-4 overflow-hidden rounded-lg py-4 shadow-none border border-gray-100 transition-all duration-300 hover:shadow-md cursor-pointer bg-white'
                >
                  <CardContent className='flex flex-1 flex-col gap-4 px-4'>
                    <div className='aspect-square overflow-hidden rounded-md bg-gray-50 flex items-center justify-center'>
                      <img src={product.images[0]} alt={product.title} className='size-full rounded-md object-contain p-2' />
                    </div>
                    <div className='flex flex-1 flex-col'>
                      <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded self-start mb-1">{product.category}</span>
                      <h2 className='mb-1 font-medium text-sm text-gray-800 line-clamp-2 h-10'>{product.title}</h2>
                      <div className='mt-auto flex items-baseline gap-2'>
                        <p className='font-bold text-gray-950'>₹{product.price}</p>
                        {product.originalPrice && <p className='text-muted-foreground text-xs line-through'>₹{product.originalPrice}</p>}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className='px-3 md:px-4 pt-0 bg-transparent' onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="inline-flex items-center justify-center rounded-lg font-medium transition-colors border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 h-8 px-3 text-xs w-full cursor-pointer"
                      onClick={() => addToCart({ productId: product.productId, title: product.title, price: product.price, qty: 1, sellerId: product.sellerId, image: product.images[0] })}
                    >
                      Add to Cart
                    </button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}