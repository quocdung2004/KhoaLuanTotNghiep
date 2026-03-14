import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShoppingBag, LogOut } from 'lucide-react';

export default function StaffLayout() {
  const location = useLocation();

  // CHÚ Ý: Menu của Staff CHỈ CÓ ĐÚNG 1 NÚT là Quản lý đơn hàng
  const menuItems = [
    { path: '/staff', icon: <ShoppingBag className="w-5 h-5" />, label: 'Quản lý Đơn hàng' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* SIDEBAR BÊN TRÁI DÀNH RIÊNG CHO STAFF */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
            Hệ thống Nội bộ
          </h2>
          <p className="text-xs text-gray-400 mt-1">Khu vực Nhân viên (Staff)</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path 
                  ? 'bg-green-600 text-white font-bold shadow-lg shadow-green-900/50' 
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

      {/* NỘI DUNG CHÍNH */}
      <main className="flex-1 overflow-y-auto">
        <Outlet /> 
      </main>
    </div>
  );
}