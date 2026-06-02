"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useCart } from "@/context/CartContext"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ShoppingCart, Trash2, Store, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"

interface Product {
  productId: string
  title: string
  description: string
  price: number
  originalPrice?: number
  category: string
  inventoryQty: number
  images: string[]
  sellerId: string
}

// 🔍 IMAGE MAGNIFIER COMPONENT
function ImageMagnifier({ src, alt }: { src: string; alt: string }) {
  const [[x, y], setXY] = useState([0, 0])
  const [[imgWidth, imgHeight], setSize] = useState([0, 0])
  const [showMagnifier, setShowMagnifier] = useState(false)

  return (
    <div className="relative h-80 md:h-[450px] w-full bg-white rounded-xl overflow-hidden flex items-center justify-center border border-gray-100 shadow-sm">
      <img
        src={src}
        className="max-h-full max-w-full object-contain cursor-zoom-in"
        alt={alt}
        onMouseEnter={(e) => {
          const elem = e.currentTarget
          const { width, height } = elem.getBoundingClientRect()
          setSize([width, height])
          setShowMagnifier(true)
        }}
        onMouseMove={(e) => {
          const elem = e.currentTarget
          const { top, left } = elem.getBoundingClientRect()
          const x = e.pageX - left - window.scrollX
          const y = e.pageY - top - window.scrollY
          setXY([x, y])
        }}
        onMouseLeave={() => setShowMagnifier(false)}
      />
      {showMagnifier && (
        <div style={{
          position: "absolute", pointerEvents: "none", height: "180px", width: "180px",
          top: `${y - 90}px`, left: `${x - 90}px`, border: "2px solid #3b82f6", borderRadius: "50%",
          backgroundColor: "white", backgroundImage: `url('${src}')`, backgroundRepeat: "no-repeat",
          backgroundSize: `${imgWidth * 2.5}px ${imgHeight * 2.5}px`,
          backgroundPosition: `${-x * 2.5 + 90}px ${-y * 2.5 + 90}px`,
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
        }} />
      )}
    </div>
  )
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  
  const { cart, addToCart, removeFromCart, getCartTotal } = useCart()
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [product, setProduct] = useState<Product | null>(null)
  const [activeImgIndex, setActiveImgIndex] = useState<number>(0)

  const totalCartCount = cart.reduce((acc, item) => acc + item.qty, 0)

  // 🔄 ડેટાબેઝ સિન્ક્રોનાઇઝેશન
  useEffect(() => {
    async function loadData() {
      let productList: Product[] = []
      try {
        const res = await fetch('http://localhost:5000/api/products')
        const data = await res.json()
        if (data.success) productList = data.products
      } catch (err) {
        // ફોલબેક મોક સ્ટોરેજ એરે (કેટેગરી મેપિંગ સાથે)
        productList = Array.from({ length: 20 }, (_, index) => {
          const categories = ["Audio", "Wearables", "Computing", "Gaming"]
          const cat = categories[index % categories.length]
          return {
            productId: `PROD-${100 + index}`,
            title: `${cat} Premium Device Model X-${index + 1}`,
            description: "This is a full core descriptive brief setup regarding the listed seller inventory item. High build profiles with deep warranty cards included.",
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
      }
      setAllProducts(productList)
      const found = productList.find(p => p.productId === id)
      setProduct(found || null)
    }
    loadData()
  }, [id])

  // 🔄 AUTO SLIDER ENGINE
  useEffect(() => {
    if (!product || product.images.length <= 1) return
    const interval = setInterval(() => {
      setActiveImgIndex(prev => (prev === product.images.length - 1 ? 0 : prev + 1))
    }, 4000)
    return () => clearInterval(interval)
  }, [product])

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">Loading dynamic product records...</div>
  }

  // 🗂️ 3. RELATED PRODUCTS LOGIC (સેમ કેટેગરીના પ્રોડક્ટ્સ ફિલ્ટર કરવા)
  const relatedProducts = allProducts.filter(
    p => p.category === product.category && p.productId !== product.productId
  ).slice(0, 6) // વધુમાં વધુ 6 પ્રોડક્ટ્સ સજેસ્ટ કરશે

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-white p-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">🏙️ <span className="text-blue-600">Next</span>Market</Link>
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger className="inline-flex items-center justify-center rounded-lg text-sm font-medium border border-input bg-background shadow-sm hover:bg-accent h-9 px-4 py-2 relative gap-2 cursor-pointer">
                <ShoppingCart className="h-4 w-4" /> Cart
                {totalCartCount > 0 && <Badge className="ml-1 bg-blue-600 text-white">{totalCartCount}</Badge>}
              </SheetTrigger>
              <SheetContent>
                <SheetHeader><SheetTitle>Your Shopping Cart</SheetTitle></SheetHeader>
                {cart.length === 0 ? <div className="text-center py-20 text-gray-500">Cart is empty</div> : (
                  <div className="flex flex-col h-full justify-between pb-6">
                    <div className="overflow-y-auto space-y-4 my-4 max-h-[70vh]">
                      {cart.map(item => (
                        <div key={item.productId} className="flex justify-between items-center border-b pb-2">
                          <div><p className="font-medium text-sm">{item.title}</p><p className="text-xs text-gray-500">₹{item.price} × {item.qty}</p></div>
                          <button onClick={() => removeFromCart(item.productId)} className="text-red-500"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 border-t"><div className="flex justify-between font-bold mb-4"><span>Total:</span><span>₹{getCartTotal()}</span></div>
                    <Link href="/checkout" className="w-full block"><button className="w-full bg-blue-600 text-white h-10 rounded-lg">Checkout</button></Link></div>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <button onClick={() => router.push('/')} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 cursor-pointer font-medium">
          <ArrowLeft className="h-4 w-4" /> Back to Storefront
        </button>

        {/* Product core detail showcase row */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row gap-8 shadow-sm">
          {/* Left: Slider with arrows */}
          <div className="w-full md:w-1/2 relative group">
            <ImageMagnifier src={product.images[activeImgIndex]} alt={product.title} />
            {product.images.length > 1 && (
              <>
                <button onClick={() => setActiveImgIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow border cursor-pointer"><ChevronLeft className="h-5 w-5" /></button>
                <button onClick={() => setActiveImgIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow border cursor-pointer"><ChevronRight className="h-5 w-5" /></button>
              </>
            )}
          </div>

          {/* Right: Info Sheets */}
          <div className="w-full md:w-1/2 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="inline-block text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{product.category}</span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.title}</h1>
              <div className="flex items-baseline gap-3"><span className="text-3xl font-extrabold text-gray-950">₹{product.price}</span>{product.originalPrice && <span className="text-gray-400 line-through text-lg">₹{product.originalPrice}</span>}</div>
              <hr className="border-gray-100" />
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded-lg border">📍 Seller Node ID Reference: <span className="font-mono font-bold">{product.sellerId}</span></div>
            </div>
            <button onClick={() => addToCart({ productId: product.productId, title: product.title, price: product.price, qty: 1, sellerId: product.sellerId, image: product.images[0] })} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 rounded-xl mt-6 transition shadow cursor-pointer">Add to Shopping Cart</button>
          </div>
        </div>

        {/* 🗂️ 4. RELATED PRODUCTS SECTION (સમાન કેટેગરીના અન્ય પ્રોડક્ટ્સ) */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-3 border-gray-100">Customers Also Viewed (Same Category)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {relatedProducts.map(p => (
                <Card 
                  key={p.productId} 
                  onClick={() => { router.push(`/product/${p.productId}`); setActiveImgIndex(0); }}
                  className="bg-white border rounded-lg p-3 cursor-pointer hover:shadow-md shadow-none transition-all flex flex-col justify-between"
                >
                  <div className="aspect-square bg-gray-50 rounded overflow-hidden mb-2 flex items-center justify-center">
                    <img src={p.images[0]} alt={p.title} className="max-h-full object-contain p-1" />
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-gray-800 line-clamp-2 h-8 mb-1">{p.title}</h4>
                    <p className="text-sm font-bold text-gray-950">₹{p.price}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}