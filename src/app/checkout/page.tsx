"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useCart } from "@/context/CartContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2 } from "lucide-react"

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart()
  const [mobileNumber, setMobileNumber] = useState("")
  const [orderToken, setOrderToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!mobileNumber || mobileNumber.length < 10) {
      alert("Please enter a valid 10-digit mobile number.")
      return
    }
    if (cart.length === 0) {
      alert("Your cart is empty.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/orders/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({
            productId: item.productId,
            title: item.title,
            qty: item.qty,
            price: item.price,
            sellerId: item.sellerId
          })),
          totalAmount: getCartTotal(),
          mobileNumber: mobileNumber
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setOrderToken(result.orderToken)
        clearCart()
      } else {
        alert(`Transaction failure: ${result.error}`)
      }
    } catch (error) {
      console.error("Connectivity exception:", error)
      alert("Unable to reach the ordering server. Ensure your Node.js backend is running on port 5000.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Catalog
        </Link>

        {!orderToken ? (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Finalize Purchase</CardTitle>
              <CardDescription>Confirm your items and provide your mobile number to generate your order token.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md divide-y mb-6 bg-gray-50/50">
                {cart.map((item) => (
                  <div key={item.productId} className="p-3 flex justify-between text-sm">
                    <span className="text-gray-700 font-medium">{item.title} (x{item.qty})</span>
                    <span className="text-gray-900 font-mono">₹{item.price * item.qty}</span>
                  </div>
                ))}
                <div className="p-3 flex justify-between text-base font-bold bg-white">
                  <span>Grand Total:</span>
                  <span className="text-blue-600">₹{getCartTotal()}</span>
                </div>
              </div>

              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="mobile" className="text-sm font-semibold text-gray-700">Mobile Number</label>
                  <Input 
                    id="mobile"
                    type="tel" 
                    placeholder="Enter 10-digit mobile number" 
                    maxLength={15}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading || cart.length === 0}>
                  {loading ? "Placing Order..." : "Confirm & Place Order"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-green-200 bg-green-50/30 text-center shadow-md">
            <CardHeader className="flex items-center justify-center pb-2">
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
              <CardTitle className="text-green-800 text-2xl">Order Placed!</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-600 text-sm">
                Your order token has been securely generated. Use this code to track your delivery status:
              </p>
              <div className="bg-white border-2 border-dashed border-green-300 rounded-lg p-4 font-mono text-2xl font-bold tracking-widest text-green-700 shadow-inner select-all">
                {orderToken}
              </div>
              <div className="pt-4">
                <Link href="/">
                  <Button variant="outline" className="w-full">Return to Storefront</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}