"use client"
import React, { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { Footer } from '../components/Footer'
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
        if (data.success) {
          setProducts(data.products)
        }
      } catch (err) {
        console.error("Failed to load live data from backend cluster", err)
      } finally {
        setLoading(false)
      }
    }
    getMarketplaceProducts()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50/40 text-gray-900 flex flex-col justify-between">
      <div>
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          <Hero />

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Explore Marketplace
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Live active catalog synchronization records.
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {Array.from({ length: 10 }).map((_, idx) => (
                  <div key={idx} className="border rounded-xl p-4 bg-white space-y-3">
                    <Skeleton className="aspect-square w-full rounded-lg" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-5 w-1/3" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white border border-dashed rounded-2xl text-gray-400 font-medium">
                No products available in the marketplace right now.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {products.map((p: any) => (
                  <ProductCard 
                    key={p.productId}
                    productId={p.productId}
                    title={p.title}
                    price={p.price}
                    imageUrl={p.images?.[0]}
                    inventoryQty={p.inventoryQty}
                    sellerId={p.sellerId}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}