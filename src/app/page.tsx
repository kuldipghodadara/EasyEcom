"use client"
import React, { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { ProductCard } from '../components/ProductCard'
import { Skeleton } from "@/components/ui/skeleton"

export default function UserStorefront() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getMarketplaceProducts() {
      try {
        const res = await fetch('http://localhost:5000/api/products')
        const data = await res.json()
        if (data.success) setProducts(data.products)
      } catch (err) {
        console.error("Failed to load live data from central backend system", err)
      } finally {
        setLoading(false)
      }
    }
    getMarketplaceProducts()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Explore Products</h1>
          <p className="text-sm text-gray-500 mt-1">Live stock updates fetched directly via Node.js cluster framework.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div key={idx} className="border rounded-xl p-4 bg-white space-y-3">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-5 w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.map((p: any) => (
              <ProductCard 
                key={p.productId}
                productId={p.productId}
                title={p.title}
                price={p.price}
                imageUrl={p.images?.[0]}
                inventoryQty={p.inventoryQty}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}