"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { ShoppingCart } from "lucide-react"
import { toast } from "sonner"


interface ProductCardProps {
  productId: string
  title: string
  price: number
  imageUrl: string
  inventoryQty: number
  sellerId?: string
}

export function ProductCard({ productId, title, price, imageUrl, inventoryQty, sellerId = "Unknown" }: ProductCardProps) {
  const router = useRouter()
  const { addToCart } = useCart()

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (inventoryQty <= 0) return

    addToCart({
      productId,
      title,
      price,
      qty: 1,
      sellerId,
      image: imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'
    })
toast.success("Item added to cart", {
style: {
    background: "#16a34a",
    color: "#fff",
    border: "1px solid #15803d",
  },
  position: "top-right",
  
})  }

  return (
    <Card className="bg-white border rounded-xl p-3 shadow-none transition-all flex flex-col justify-between h-full group">
      <div className="cursor-pointer" onClick={() => router.push(`/product/${productId}`)}>
        <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-3 flex items-center justify-center p-2 group-hover:scale-[1.01] transition-transform">
          <img 
            src={imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'} 
            alt={title} 
            className="max-h-full object-contain" 
          />
        </div>
        <h4 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
          {title}
        </h4>
      </div>

      <div className="mt-2 pt-2 border-t border-gray-50 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-base font-bold text-gray-950">₹{price}</p>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
            inventoryQty > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}>
            {inventoryQty > 0 ? `${inventoryQty} Left` : 'Out of Stock'}
          </span>
        </div>

        <Button 
          onClick={handleAddToCartClick}
          disabled={inventoryQty <= 0}
          className="w-full h-8 gap-1.5 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer rounded-lg text-xs font-semibold shadow-xs transition"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          {inventoryQty > 0 ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </Card>
  )
}