import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Glasses, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Hàm đóng menu (dùng nhiều lần)
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* LOGO */}
            <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
              <Glasses className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Dũng Glasses
              </span>
            </Link>

            {/* MENU CHÍNH (Desktop) */}
            <div className="hidden md:flex space-x-8 items-center">
              <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition">Cửa hàng</Link>
              <Link to="/my-prescription" className="text-gray-600 hover:text-blue-600 font-medium transition">Đo thị lực</Link>
              
              <div className="h-6 w-[1px] bg-gray-300 mx-2"></div>
              <Link to="/staff/orders" className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200">Staff</Link>
              <Link to="/admin" className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200">Admin</Link>
            </div>

            {/* NÚT CHỨC NĂNG */}
            <div className="flex items-center space-x-4">
              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 transition">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  0
                </span>
              </Link>
              
              <button className="hidden md:flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition">
                <User className="w-4 h-4" />
                <span className="text-sm font-bold">Đăng nhập</span>
              </button>

              {/* Nút mở Menu Mobile */}
              <button className="md:hidden p-2 text-gray-700" onClick={() => setIsOpen(true)}>
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ================= MOBILE MENU (Trượt từ phải sang) ================= */}
      
      {/* 1. Lớp nền mờ (Overlay) */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={closeMenu}
      ></div>

      {/* 2. Bảng Menu (Drawer) */}
      <div 
        className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header của Drawer */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <span className="text-lg font-bold text-gray-800">Menu</span>
          <button onClick={closeMenu} className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-red-100 hover:text-red-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Danh sách Link */}
        <div className="flex-1 overflow-y-auto py-4 px-6 space-y-6">
          <div className="space-y-4">
            <Link to="/" onClick={closeMenu} className="flex items-center justify-between text-gray-700 hover:text-blue-600 font-medium text-lg">
              Cửa hàng <ChevronRight className="w-5 h-5 opacity-50" />
            </Link>
            <Link to="/my-prescription" onClick={closeMenu} className="flex items-center justify-between text-gray-700 hover:text-blue-600 font-medium text-lg">
              Đo thị lực <ChevronRight className="w-5 h-5 opacity-50" />
            </Link>
          </div>

          <hr className="border-gray-100" />

          {/* Khu vực phân quyền (chỉ để Demo) */}
          <div className="space-y-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phân quyền nội bộ</p>
            <Link to="/staff/orders" onClick={closeMenu} className="block text-green-600 font-medium bg-green-50 px-4 py-2 rounded-lg">
              Khu vực Nhân viên
            </Link>
            <Link to="/admin" onClick={closeMenu} className="block text-red-600 font-medium bg-red-50 px-4 py-2 rounded-lg">
              Khu vực Quản trị (Admin)
            </Link>
          </div>
        </div>

        {/* Nút Đăng nhập ở đáy Menu */}
        <div className="p-6 border-t border-gray-100">
          <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
            <User className="w-5 h-5" />
            <span>Đăng nhập tài khoản</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;