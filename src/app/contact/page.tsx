"use client"
import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function ContactPage() {
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
            <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About Us</Link>
            <Link href="/contact" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">Contact</Link>
          </nav>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-lg mx-auto px-4 py-12">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Get In Touch</CardTitle>
            <CardDescription>Have queries regarding merchant onboarding or order status tracking tokens?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2 text-sm text-gray-600">
              <p>📍 <strong>Headquarters:</strong> Surat, Gujarat, India</p>
              <p>✉️ <strong>Support Email:</strong> support@nextmarket.com</p>
              <p>📞 <strong>Merchant Hotline:</strong> +91 98765 43210</p>
            </div>
            
            <hr className="border-gray-100" />
            
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Your Email</label>
                <Input type="email" placeholder="name@example.com" required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Message / Issue Details</label>
                <textarea 
                  className="w-full min-h-[100px] border border-input rounded-md p-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                  placeholder="Describe your query..."
                  required
                />
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg h-9 text-sm transition-colors cursor-pointer">
                Send Message
              </button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}