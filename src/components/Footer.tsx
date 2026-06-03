import React from "react";
import Link from "next/link";
import { Mail, MapPin, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white">🏙️ EasyEcom</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your premium high-speed marketplace engine connecting verified production pipelines to directly deployable UI nodes.
          </p>
        </div>
        <div className="space-y-2 text-xs">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Navigation</h4>
          <ul className="space-y-1.5 font-medium">
            <li><Link href="/" className="hover:text-white transition">Shop Home</Link></li>
            <li><Link href="/about" className="hover:text-white transition">About Corporate</Link></li>
            <li><Link href="/contact" className="hover:text-white transition">Contact Gateway</Link></li>
          </ul>
        </div>
        <div className="space-y-2 text-xs">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Compliance</h4>
          <ul className="space-y-1.5 font-medium">
            <li><Link href="/terms" className="hover:text-white transition">Terms & Conditions</Link></li>
            <li><Link href="#" className="hover:text-white transition">Privacy Policy</Link></li>
          </ul>
        </div>
        <div className="space-y-2 text-xs font-medium">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Headquarters</h4>
          <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-500" /> Surat, Gujarat, India</p>
          <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-blue-500" /> support@easyecom.com</p>
          <p className="flex items-center gap-1 text-[10px] text-green-500 bg-green-950/40 p-1 px-2 border border-green-900/30 rounded max-w-fit"><ShieldCheck className="h-3 w-3" /> SECURITY GATEWAY LIVE</p>
        </div>
      </div>
      <div className="border-t border-slate-900 p-4 text-center text-xs text-slate-600 font-medium">
        © {new Date().getFullYear()} EasyEcom Marketplace Engine. All rights reserved.
      </div>
    </footer>
  );
}