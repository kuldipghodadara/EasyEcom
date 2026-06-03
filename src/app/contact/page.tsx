import React from 'react'
import { Navbar } from '../../components/Navbar'
import { Footer } from '../../components/Footer'
import { Mail, MapPin, Phone } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50/40 text-gray-900 flex flex-col justify-between">
      <div>
        <Navbar />
        <main className="max-w-md mx-auto px-6 py-12 bg-white border border-gray-100 rounded-2xl shadow-xs mt-12 space-y-6">
          <h1 className="text-2xl font-bold text-center text-gray-900">Contact Infrastructure</h1>
          <div className="space-y-4 text-sm text-gray-600">
            <p className="flex items-center gap-3"><MapPin className="h-5 w-5 text-blue-600" /> Surat, Gujarat, India</p>
            <p className="flex items-center gap-3"><Mail className="h-5 w-5 text-blue-600" /> support@easyecom.com</p>
            <p className="flex items-center gap-3"><Phone className="h-5 w-5 text-blue-600" /> +91 98765 43210</p>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}