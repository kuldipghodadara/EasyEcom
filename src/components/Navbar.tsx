"use client";
import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";

export function Navbar() {
  const { cart, removeFromCart, getCartTotal } = useCart();
  const totalCartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white p-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/">
          <img src="/logo.jpg" alt="EasyEcom Logo" width={200} height={100} />
        </Link>

        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger className="inline-flex items-center justify-center rounded-lg text-sm font-medium border border-input bg-background shadow-sm hover:bg-accent h-9 px-4 py-2 relative gap-2 cursor-pointer">
              <ShoppingCart className="h-4 w-4" /> Cart
              {totalCartCount > 0 && (
                <Badge className="ml-1 bg-blue-600 text-white">
                  {totalCartCount}
                </Badge>
              )}
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Your Shopping Cart</SheetTitle>
              </SheetHeader>
              {cart.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  Cart is empty
                </div>
              ) : (
                <div className="flex flex-col h-full justify-between pb-6">
                  <div className="overflow-y-auto space-y-4 my-4 max-h-[70vh]">
                    {cart.map((item) => (
                      <div
                        key={item.productId}
                        className="flex justify-between items-center border-b pb-2"
                      >
                        <div>
                          <p className="font-medium text-sm">{item.title}</p>
                          <p className="text-xs text-gray-500">
                            ₹{item.price} × {item.qty}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-red-500 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between font-bold mb-4">
                      <span>Total:</span>
                      <span>₹{getCartTotal()}</span>
                    </div>
                    <Link href="/checkout" className="w-full block">
                      <button className="w-full bg-blue-600 text-white h-10 rounded-lg cursor-pointer hover:bg-blue-700 transition">
                        Checkout
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
