import React from 'react'
import { Navbar } from '../../components/Navbar'
import { Footer } from '../../components/Footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50/40 text-gray-900 flex flex-col justify-between">
      <div>
        <Navbar />
        <main className="max-w-4xl mx-auto px-6 py-16 text-center space-y-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">About Our Platform</h1>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
            EasyEcom connects premium verified merchants directly to global consumers. Our modern network dashboard offers multi-vendor sync frameworks, secure stock isolation, and extreme-speed storefront renders.
          </p>
        </main>
      </div>
      <Footer />
    </div>
  )
}