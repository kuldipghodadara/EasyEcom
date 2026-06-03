"use client";
import React, { useState } from 'react';
import { Button } from "./ui/button";

interface Product {
  productId: string; title: string; price: number; inventoryQty: number; images: string[]; status: string;
}

export function ProductTable({ products, onRefresh }: { products: Product[]; onRefresh: () => void }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newStock, setNewStock] = useState<number>(0);

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const targetStatus = currentStatus === 'active' ? 'inactive' : 'active';
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: targetStatus })
    });
    onRefresh();
  };

  const handleStockUpdate = async (id: string) => {
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inventoryQty: newStock })
    });
    setEditingId(null);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product permanently?")) return;
    await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
    onRefresh();
  };

  return (
    <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 text-xs font-semibold border-b">
            <th className="p-4">Images</th>
            <th className="p-4">Name/Price</th>
            <th className="p-4">Stock Inventory</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y text-sm">
          {products.map((p) => (
            <tr key={p.productId} className="hover:bg-slate-50/50">
              <td className="p-4">
                <div className="flex gap-1 max-w-[120px] overflow-x-auto">
                  {p.images.map((img, idx) => <img key={idx} src={img} className="h-9 w-9 object-contain bg-slate-50 border rounded" />)}
                </div>
              </td>
              <td className="p-4">
                <div className="font-medium">{p.title}</div>
                <div className="text-xs text-slate-500">₹{p.price}</div>
              </td>
              <td className="p-4">
                {editingId === p.productId ? (
                  <div className="flex items-center gap-1">
                    <input type="number" defaultValue={p.inventoryQty} onChange={(e) => setNewStock(Number(e.target.value))} className="w-16 border rounded p-1 text-sm" />
                    <Button size="xs" onClick={() => handleStockUpdate(p.productId)} className="bg-green-600 text-white">Save</Button>
                  </div>
                ) : (
                  <span onClick={() => { setEditingId(p.productId); setNewStock(p.inventoryQty); }} className="cursor-pointer underline font-medium text-blue-600">
                    {p.inventoryQty} Units
                  </span>
                )}
              </td>
              <td className="p-4 flex justify-center gap-2 mt-1">
                <Button size="xs" variant={p.status === 'active' ? 'outline' : 'secondary'} onClick={() => handleStatusToggle(p.productId, p.status)}>
                  {p.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
                <Button size="xs" variant="destructive" onClick={() => handleDelete(p.productId)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}