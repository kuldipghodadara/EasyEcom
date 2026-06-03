"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // સેશન ચેક
  useEffect(() => {
    const storedSellerId = localStorage.getItem('sellerId');
    if (storedSellerId) {
      router.push('/');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/sellers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('sellerId', data.sellerId);
        localStorage.setItem('storeName', data.storeName);
        router.push('/');
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-2xl text-center font-bold text-slate-900">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Login to access your NextMarket Seller Center
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">Email</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Logging in..." : "Login to Seller Center"}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm text-slate-500">
              Don't have a store yet?{" "}
              <Link href="/register" className="text-blue-600 hover:underline font-medium">
                Register Store
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}