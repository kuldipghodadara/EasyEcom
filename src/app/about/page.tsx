"use client"
import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-white p-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
            🏙️ <span className="text-blue-600">Next</span>Market
          </Link>
          <nav className="flex items-center gap-8 text-sm font-medium">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Home</Link>
            <Link href="/about" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">About Us</Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</Link>
          </nav>
          <div className="w-20"></div> {/* Spacer to keep layouts mirrored */}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900">About Our Marketplace</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              Welcome to <strong>NextMarket</strong>. We are a direct, multi-vendor B2C e-commerce connection layer designed to help local verified merchants list, distribute, and manage their logistics without middlemen interference.
            </p>
            <p>
              Every transaction made triggers serverless token configurations, ensuring full order trace capability using localized reference signatures. Our platform ensures clear ledger execution, absolute automated stock safety management, and rapid local logistics onboarding workflows.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}