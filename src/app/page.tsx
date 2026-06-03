import React from 'react'
import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { Footer } from '../components/Footer'
import { ProductCard } from '../components/ProductCard'

async function getProducts() {
  const res = await fetch('https://easyecomserver.vercel.app/api/products', { 
    next: { revalidate: 60 }
  });
  if (!res.ok) throw new Error('Failed to fetch products');
  const data = await res.json();
  return data.success ? data.products : [];
}

export default async function UserStorefront() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-slate-50/40 text-gray-900 flex flex-col justify-between">
      <div>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          <Hero />
          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Explore Marketplace</h2>
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
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}