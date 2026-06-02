"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from "../components/ui/card"

interface ProductCardProps {
  productId: string
  title: string
  price: number
  imageUrl: string
  inventoryQty: number
  onCardClick?: () => void
}

export function ProductCard({ productId, title, price, imageUrl, inventoryQty, onCardClick }: ProductCardProps) {
  const router = useRouter()

  return (
    <Card 
      onClick={() => onCardClick ? onCardClick() : router.push(`/product/${productId}`)}
      className="bg-white border rounded-xl p-3 cursor-pointer hover:shadow-md transition-all flex flex-col justify-between h-full group"
    >
      <div>
        <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-3 flex items-center justify-center p-2">
          {/* અહીંયા જો અપલોડ કરેલી ઈમેજ ન હોય તો જ Unsplash પ્લેસહોલ્ડર દેખાશે */}
          <img src={imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'} alt={title} className="max-h-full object-contain" />
        </div>
        <h4 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
          {title}
        </h4>
      </div>
      <div className="mt-2 pt-2 border-t flex items-center justify-between">
        <p className="text-base font-bold text-gray-950">₹{price}</p>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
          inventoryQty > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
        }`}>
          {inventoryQty > 0 ? `${inventoryQty} Left` : 'Out of Stock'}
        </span>
      </div>
    </Card>
  )
}