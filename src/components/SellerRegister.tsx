"use client";
import React, { useState } from 'react';
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface SellerRegisterProps {
  onRegisterSuccess: () => void;
}

export default function SellerRegister({ onRegisterSuccess }: SellerRegisterProps) {
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
        setSuccess("Registration successful! Please login.");
        setTimeout(() => onRegisterSuccess(), 2000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
}