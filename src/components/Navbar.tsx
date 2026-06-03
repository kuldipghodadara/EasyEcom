import React from 'react';
import { Store, LogOut } from 'lucide-react';

export function Navbar({ 
  sellerId, 
  storeName, 
  onLogout 
}: { 
  sellerId?: string | null; 
  storeName?: string; 
  onLogout?: () => void;
}) {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 p-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
          <Store className="h-6 w-6 text-blue-600" />
          <span>NextMarket <span className="text-blue-600 font-medium text-sm bg-blue-50 px-2 py-0.5 rounded-md">Seller Center</span></span>
        </div>

        {sellerId && (
          <div className="flex items-center gap-4">
            <div className="text-xs text-slate-500 font-mono bg-slate-100 px-3 py-1.5 rounded-md border">
              UID: {sellerId}
            </div>
            {storeName && <div className="text-sm font-medium">{storeName}</div>}
            
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}