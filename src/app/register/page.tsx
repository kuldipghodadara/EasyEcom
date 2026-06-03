"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    storeName: '',
    mobile: '',
    gstNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const storedSellerId = localStorage.getItem('sellerId');
    if (storedSellerId) {
      router.push('/');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('http://localhost:5000/api/sellers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-2xl text-center font-bold text-slate-900">Create Seller Account</CardTitle>
            <CardDescription className="text-center">
              Start selling your products on NextMarket live storefront
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">Store Name</label>
                <Input name="storeName" value={formData.storeName} onChange={handleChange} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Mobile Number</label>
                  <Input name="mobile" type="tel" value={formData.mobile} onChange={handleChange} required />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">GST Number</label>
                  <Input name="gstNumber" value={formData.gstNumber} onChange={handleChange} required />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Email</label>
                <Input name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <Input name="password" type="password" value={formData.password} onChange={handleChange} required />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
                <Input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}
              {success && <p className="text-green-600 text-sm">{success}</p>}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Creating Account..." : "Register Store"}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                Login here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}