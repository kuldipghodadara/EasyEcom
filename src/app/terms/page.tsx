import React from 'react'
import { Navbar } from '../../components/Navbar'
import { Footer } from '../../components/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50/40 text-gray-900 flex flex-col justify-between">
      <div>
        <Navbar />
        <main className="max-w-2xl mx-auto px-6 py-12 bg-white border rounded-2xl mt-12 space-y-4 shadow-xs">
          <h1 className="text-2xl font-bold border-b pb-3">Terms & Conditions</h1>
          <div className="text-sm text-gray-600 space-y-3 leading-relaxed">
            <p><strong>1. Compliance:</strong> Users must handle parameters according to strict database constraints.</p>
            <p><strong>2. Transaction Rollbacks:</strong> The platform maintains privileges to reject execution stacks under severe node synchronization drops.</p>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}