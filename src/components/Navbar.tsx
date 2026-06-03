"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 👈 રાઉટર એડ કર્યું જેથી સજેશન પર ક્લિક કરતાં પ્રોડક્ટ પેજ ખુલે
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, Trash2, Menu, ChevronDown, Search } from "lucide-react";

interface NavbarProps {
  onCategorySelect?: (cat: string) => void;
  onSearch?: (searchQuery: string) => void;
}

export function Navbar({ onCategorySelect, onSearch }: NavbarProps) {
  const { cart, removeFromCart, getCartTotal } = useCart();
  const router = useRouter();
  const totalCartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // 🔍 લાઈવ સર્ચ ડ્રોપડાઉન સ્ટેટ્સ
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories = ["Audio", "Wearables", "Computing", "Gaming", "Gadgets"];

  useEffect(() => {
    async function fetchAllProducts() {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        if (data.success) {
          setAllProducts(data.products);
        }
      } catch (err) {
        console.error("Failed to load products for live suggestions", err);
      }
    }
    fetchAllProducts();
  }, []);

  // ૨. ⏱️ Debounce & Live Suggestion Filtering Engine
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (onSearch) onSearch(searchTerm);

      if (searchTerm.trim().length > 0) {
        const filtered = allProducts.filter((p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
        ).slice(0, 8); 
        
        setSuggestions(filtered);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch, allProducts]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur-md p-4 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* MOBILE MENU & LOGO */}
        <div className="w-full md:w-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:bg-slate-100 md:hidden cursor-pointer transition-colors">
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[260px] p-6">
                <SheetHeader className="text-left border-b pb-4 mb-4">
                  <SheetTitle className="text-xl font-bold text-blue-600">EasyEcom</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 text-base font-medium text-gray-700">
                  <Link href="/">Home</Link>
                  <div className="font-semibold text-gray-400 text-xs uppercase tracking-wider mt-2">Categories</div>
                  {categories.map((cat) => (
                    <button 
                      key={cat} 
                      onClick={() => { if(onCategorySelect) onCategorySelect(cat); }}
                      className="text-left pl-2 hover:text-blue-600 border-l border-gray-100 transition cursor-pointer"
                    >
                      {cat}
                    </button>
                  ))}
                  <div className="border-t my-2"></div>
                  <Link href="/about">About Us</Link>
                  <Link href="/contact">Contact</Link>
                  <Link href="/terms" className="text-sm text-gray-500">Terms & Conditions</Link>
                </nav>
              </SheetContent>
            </Sheet>

            <Link href="/">
              <img src="/logo.jpg" alt="EasyEcom Logo" className="h-12 w-auto object-contain cursor-pointer" />
            </Link>
          </div>

          {/* Mobile Cart Link */}
          <div className="md:hidden">
            <Link href="/checkout" className="relative p-2 inline-block">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {totalCartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full text-[10px] h-4 w-4 flex items-center justify-center p-0">{totalCartCount}</Badge>
              )}
            </Link>
          </div>
        </div>

        {/* 🔍 SEARCH BAR WITH IMAGE SUGGESTIONS DROPDOWN */}
        <div ref={dropdownRef} className="relative w-full md:max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search by product name, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
            className="pl-9 pr-4 h-9 w-full bg-slate-50 border-gray-200 focus-visible:bg-white rounded-lg transition"
          />

          {/* 🏪 LIVE DROPDOWN POPUP BLOCK */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white border border-gray-100 rounded-xl shadow-xl mt-1.5 py-2 z-50 max-h-[380px] overflow-y-auto animate-in fade-in duration-100">
              {suggestions.map((p) => (
                <div
                  key={p.productId}
                  onClick={() => {
                    router.push(`/product/${p.productId}`); // ક્લિક કરતાં જ પ્રોડક્ટ પેજ ખુલશે
                    setShowSuggestions(false);
                    setSearchTerm("");
                  }}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  {/* પ્રોડક્ટ ઈમેજ */}
                  <div className="h-10 w-10 shrink-0 bg-slate-50 rounded-md border border-gray-100 p-1 flex items-center justify-center">
                    <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'} alt="" className="max-h-full max-w-full object-contain" />
                  </div>
                  
                  {/* પ્રોડક્ટ નામ અને કેટેગરી */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{p.title}</p>
                    {p.category && (
                      <p className="text-xs text-blue-500 font-semibold mt-0.5">in {p.category}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition">Home</Link>
            
            {/* CATEGORIES DROPDOWN */}
            <div 
              className="relative"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <button className="flex items-center gap-1 hover:text-blue-600 transition cursor-pointer py-2">
                Categories <ChevronDown className="h-4 w-4" />
              </button>
              {showDropdown && (
                <div className="absolute top-full left-0 w-44 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50 animate-in fade-in duration-100">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { if(onCategorySelect) onCategorySelect(cat); setShowDropdown(false); }}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 hover:text-blue-600 cursor-pointer"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link href="/about" className="hover:text-blue-600 transition">About Us</Link>
            <Link href="/contact" className="hover:text-blue-600 transition">Contact</Link>
          </nav>

          {/* DESKTOP CART SHEET */}
          <Sheet>
            <SheetTrigger className="inline-flex items-center justify-center rounded-lg text-sm font-medium border border-input bg-background shadow-xs hover:bg-slate-50 h-9 px-4 py-2 relative gap-2 cursor-pointer transition-colors">
              <ShoppingCart className="h-4 w-4" /> 
              <span>Cart</span>
              {totalCartCount > 0 && (
                <Badge className="ml-1 bg-blue-600 text-white rounded-full">{totalCartCount}</Badge>
              )}
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md p-6">
              <SheetHeader className="border-b pb-4">
                <SheetTitle className="text-lg font-bold">Your Shopping Cart</SheetTitle>
              </SheetHeader>
              {cart.length === 0 ? (
                <div className="text-center py-24 text-gray-400 font-medium">Your cart is empty</div>
              ) : (
                <div className="flex flex-col h-[calc(100vh-120px)] justify-between">
                  <div className="overflow-y-auto space-y-4 my-4 pr-1">
                    {cart.map((item) => (
                      <div key={item.productId} className="flex justify-between items-center border-b border-gray-100 pb-3 gap-4">
                        <img src={item.image} className="h-12 w-12 object-contain bg-slate-50 rounded-lg p-1" alt="" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate text-gray-900">{item.title}</p>
                          <p className="text-xs text-gray-500">₹{item.price} × {item.qty}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.productId)} className="text-red-500 hover:text-red-600 cursor-pointer p-1 transition">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between font-bold text-base mb-4 text-gray-900">
                      <span>Total Amount:</span>
                      <span>₹{getCartTotal()}</span>
                    </div>
                    <Link href="/checkout" className="w-full block">
                      <button className="w-full bg-blue-600 text-white h-11 rounded-xl text-sm font-semibold hover:bg-blue-700 transition cursor-pointer">
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
