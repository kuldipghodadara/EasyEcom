"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../components/Navbar';
import { ProductForm } from '../components/ProductForm';
import { ProductTable } from '../components/ProductTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";

export default function SellerDashboard() {
  const router = useRouter();
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [storeName, setStoreName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  // ઇન્વેન્ટરી ફેચ કરવાનું લોજિક
  const fetchInventory = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/seller/${id}`);
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (err) {
      console.error("Failed to fetch inventory");
    }
  };

  useEffect(() => {
    const storedSellerId = localStorage.getItem('sellerId');
    const storedName = localStorage.getItem('storeName');
    
    if (!storedSellerId) {
      // 🛡️ જો ડેટા લોકલ-સ્ટોરેજમાં ન હોય, તો યુઝરને સીધો લોગિન રૂટ પર મોકલો
      router.push('/login');
    } else {
      setSellerId(storedSellerId);
      setStoreName(storedName || "");
      fetchInventory(storedSellerId);
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('sellerId');
    localStorage.removeItem('storeName');
    setSellerId(null);
    setStoreName("");
    router.push('/login'); // લોગઆઉટ પછી લોગિન પેજ પર મોકલો
  };

  // લોડિંગ સ્ટેટ ચેક
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <p className="text-slate-500 font-medium">Verifying session center...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900">
      {/* નેવબાર */}
      <Navbar sellerId={sellerId} storeName={storeName} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ડાબી બાજુ: નવું પ્રોડક્ટ એડ કરવાનું ફોર્મ */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle>Add New Product</CardTitle>
                <CardDescription>Sync live with marketplace</CardDescription>
              </CardHeader>
              <CardContent>
                <ProductForm sellerId={sellerId!} onProductAdded={() => fetchInventory(sellerId!)} />
              </CardContent>
            </Card>
          </div>

          {/* જમણી બાજુ: ઇન્વેન્ટરી ટ્રેકિંગ ટેબલ */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Live Stock Tracking - {storeName}</h2>
            <ProductTable products={products} />
          </div>
        </div>
      </main>
    </div>
  );
}