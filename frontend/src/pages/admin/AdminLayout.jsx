import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Package, ShoppingBag, Settings, LogOut, LayoutDashboard } from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Tổng quan Đơn hàng' },
    { path: '/admin/products', icon: <Package className="w-5 h-5" />, label: 'Quản lý Kính (Kho)' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* SIDEBAR BÊN TRÁI DÀNH CHO ADMIN */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            Dũng System
          </h2>
          <p className="text-xs text-gray-400 mt-1">Admin Workspace</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path 
                  ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-900/50' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl transition-all">
            <LogOut className="w-5 h-5" /> Về trang Khách hàng
          </Link>
        </div>
      </aside>

      {/* NỘI DUNG CHÍNH BÊN PHẢI (Outlet sẽ render AdminDashboard hoặc AdminProducts vào đây) */}
      <main className="flex-1 overflow-y-auto">
        <Outlet /> 
      </main>
    </div>
  );
}