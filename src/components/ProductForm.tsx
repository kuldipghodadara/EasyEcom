"use client";
import React, { useState } from 'react';
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function ProductForm({ sellerId, onProductAdded }: { sellerId: string; onProductAdded: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Multiple files ને Base64 Array માં ફેરવવાનું લોજિક
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const loadedImages: string[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        loadedImages.push(reader.result as string);
        if (loadedImages.length === files.length) {
          setImages([...images, ...loadedImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !qty || images.length === 0 || !category) return alert("Please fill all fields and upload images!");

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerId, title, description, price, inventoryQty: qty, category, images })
      });
      const data = await res.json();
      if (data.success) {
        setTitle(''); setDescription(''); setPrice(''); setQty(''); setCategory(''); setImages([]);
        onProductAdded();
      }
    } catch (err) { alert("Submission failed"); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="text-sm font-semibold">Title</label><Input value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
      <div><label className="text-sm font-semibold">Description</label><Input value={description} onChange={(e) => setDescription(e.target.value)} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-sm font-semibold">Price (₹)</label><Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required /></div>
        <div><label className="text-sm font-semibold">Stock Qty</label><Input type="number" value={qty} onChange={(e) => setQty(e.target.value)} required /></div>
      </div>
      <div><label className="text-sm font-semibold">Category</label><Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Audio, Wearables..." required /></div>
      <div>
        <label className="text-sm font-semibold">Select Multiple Images</label>
        <input type="file" multiple accept="image/*" onChange={handleFileChange} className="w-full p-1 border rounded-md cursor-pointer" />
        <div className="flex gap-2 mt-2 overflow-x-auto py-1">
          {images.map((img, i) => <img key={i} src={img} className="h-14 w-14 object-contain border rounded bg-white" />)}
        </div>
      </div>
      <Button type="submit" disabled={loading} className="w-full bg-blue-600 text-white">{loading ? "Uploading..." : "Publish Product"}</Button>
    </form>
  );
}