import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, ShieldCheck, CheckSquare, Square } from 'lucide-react';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  
  // --- STATE MỚI: Lưu danh sách ID các sản phẩm được tick chọn ---
  const [selectedItems, setSelectedItems] = useState([]);

  // 1. Tải dữ liệu giỏ hàng từ LocalStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('glassesCart')) || [];
    setCartItems(savedCart);
    
    // Mặc định khi mới vào giỏ hàng, tick chọn sẵn tất cả các món (Giống Shopee)
    // Nếu Dũng không muốn chọn sẵn thì bỏ dòng dưới này đi nhé
    setSelectedItems(savedCart.map(item => item.cartId));
  }, []);

  // 2. Hàm lưu giỏ và đồng bộ Navbar
  const saveAndSyncCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem('glassesCart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // 3. Hàm tăng/giảm số lượng
  const updateQuantity = (cartId, delta) => {
    const newCart = cartItems.map(item => {
      if (item.cartId === cartId) {
        const newQuantity = item.quantity + delta;
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
      }
      return item;
    });
    saveAndSyncCart(newCart);
  };

  // 4. Hàm xóa sản phẩm
  const removeItem = (cartId) => {
    const newCart = cartItems.filter(item => item.cartId !== cartId);
    saveAndSyncCart(newCart);
    
    // Nếu xóa sản phẩm, cũng phải gỡ nó ra khỏi danh sách đang chọn
    setSelectedItems(prev => prev.filter(id => id !== cartId));
  };

  // --- LOGIC CHECKBOX MỚI ---

  // Xử lý tick chọn 1 món
  const toggleSelect = (cartId) => {
    setSelectedItems(prev => 
      prev.includes(cartId) 
        ? prev.filter(id => id !== cartId) // Nếu đã tick rồi thì gỡ tick
        : [...prev, cartId]                // Nếu chưa tick thì thêm vào mảng
    );
  };

  // Xử lý tick "Chọn tất cả"
  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]); // Đã chọn hết rồi -> Bỏ chọn tất cả
    } else {
      setSelectedItems(cartItems.map(item => item.cartId)); // Chọn tất cả
    }
  };

  // --- TÍNH TỔNG TIỀN (Chỉ tính những món ĐƯỢC CHỌN) ---
  const calculateTotal = () => {
    return cartItems
      .filter(item => selectedItems.includes(item.cartId)) // Lọc ra món được tick
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Tính tổng số LƯỢNG KÍNH đã chọn để hiển thị trên nút Thanh toán
  const calculateSelectedQuantity = () => {
    return cartItems
      .filter(item => selectedItems.includes(item.cartId))
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  // --- GIAO DIỆN GIỎ TRỐNG ---
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-sm flex flex-col items-center max-w-md w-full text-center">
          <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Giỏ hàng trống</h2>
          <p className="text-gray-500 mb-8">Bạn chưa chọn chiếc kính nào. Hãy quay lại cửa hàng để khám phá nhé!</p>
          <Link to="/" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
            <ArrowLeft className="w-5 h-5" /> Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  // --- GIAO DIỆN GIỎ CÓ HÀNG ---
  const isAllSelected = selectedItems.length === cartItems.length && cartItems.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 font-medium transition">
          <ArrowLeft className="w-5 h-5 mr-2" /> Tiếp tục mua sắm
        </Link>

        <h1 className="text-3xl font-black text-gray-900 mb-8">Giỏ hàng của bạn</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
          <div className="lg:w-2/3 space-y-4">
            
            {/* Thanh công cụ: Chọn tất cả */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <button 
                onClick={toggleSelectAll}
                className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition group font-medium"
              >
                <div className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-colors ${isAllSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                  {isAllSelected && <ShieldCheck className="w-4 h-4 text-white" />}
                </div>
                Chọn tất cả ({cartItems.length} sản phẩm)
              </button>
            </div>

            {/* Danh sách từng món hàng */}
            {cartItems.map((item) => {
              const isSelected = selectedItems.includes(item.cartId);

              return (
                <div 
                  key={item.cartId} 
                  className={`bg-white p-4 sm:p-6 rounded-3xl shadow-sm border-2 transition-all flex flex-col sm:flex-row items-center gap-4 sm:gap-6 ${isSelected ? 'border-blue-400' : 'border-transparent hover:border-gray-200'}`}
                >
                  
                  {/* CHECKBOX RIÊNG CHO TỪNG SẢN PHẨM */}
                  <button 
                    onClick={() => toggleSelect(item.cartId)}
                    className="absolute sm:relative top-6 left-6 sm:top-auto sm:left-auto flex-shrink-0"
                  >
                    <div className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-colors ${isSelected ? 'bg-blue-600 border-blue-600 shadow-md shadow-blue-200' : 'border-gray-300 bg-gray-50 hover:border-blue-400'}`}>
                      {isSelected && <ShieldCheck className="w-4 h-4 text-white" />}
                    </div>
                  </button>

                  {/* Ảnh sản phẩm */}
                  <div 
                    className="w-full sm:w-28 h-28 bg-gray-50 rounded-2xl flex-shrink-0 p-2 cursor-pointer"
                    onClick={() => toggleSelect(item.cartId)} // Bấm vào ảnh cũng tick chọn
                  >
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  </div>

                  {/* Thông tin sản phẩm */}
                  <div className="flex-1 w-full text-center sm:text-left">
                    <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                    
                    {item.hasPrescription ? (
                      <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100" translate="no">
                          Mắt phải (OD): {item.od || '0.00'}
                        </span>
                        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100" translate="no">
                          Mắt trái (OS): {item.os || '0.00'}
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mt-1">Kính không độ (Mắt thường)</p>
                    )}
                    
                    <div className="mt-4 font-black text-blue-600 text-lg">
                      {item.price.toLocaleString('vi-VN')} đ
                    </div>
                  </div>

                  {/* Cụm Nút Tăng/Giảm & Xóa */}
                  <div className="flex sm:flex-col items-center gap-4 w-full sm:w-auto justify-between sm:justify-center border-t sm:border-t-0 pt-4 sm:pt-0">
                    <div className="flex items-center bg-gray-100 rounded-full p-1">
                      <button 
                        onClick={() => updateQuantity(item.cartId, -1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-gray-600 shadow-sm disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-bold text-gray-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.cartId, 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-gray-600 shadow-sm hover:text-blue-600"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeItem(item.cartId)}
                      className="flex items-center justify-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-10 px-3 py-2 rounded-xl transition"
                    >
                      <Trash2 className="w-5 h-5" />
                      <span className="text-sm font-bold sm:hidden">Xóa</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {/* CỘT PHẢI: TỔNG KẾT ĐƠN HÀNG (BILL) */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Tổng tiền ({calculateSelectedQuantity()} sản phẩm)</span>
                  <span className="font-bold text-gray-900">{calculateTotal().toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-bold text-green-600">Miễn phí</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold text-gray-900">Tổng thanh toán</span>
                  <span className="text-3xl font-black text-blue-600">{calculateTotal().toLocaleString('vi-VN')} đ</span>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-right">(Đã bao gồm VAT)</p>
              </div>

              {/* KHÓA NÚT THANH TOÁN NẾU KHÔNG CHỌN GÌ */}
              <button 
                disabled={selectedItems.length === 0}
                className={`w-full py-5 rounded-2xl font-bold text-xl transition flex items-center justify-center gap-2 shadow-lg transform active:scale-95
                  ${selectedItems.length === 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-900 text-white hover:bg-blue-600'
                  }
                `}
              >
                <ShieldCheck className="w-6 h-6" /> 
                {selectedItems.length === 0 ? 'Vui lòng chọn sản phẩm' : `Thanh toán (${calculateSelectedQuantity()})`}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Thanh toán an toàn & bảo mật 100%
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}