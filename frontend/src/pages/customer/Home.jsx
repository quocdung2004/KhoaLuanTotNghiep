import React from 'react';
import { Link } from 'react-router-dom';
import { View, ArrowRight, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../../constants/data';

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* ================= HERO BANNER ================= */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col items-center text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-bold tracking-wide">CÔNG NGHỆ THỬ KÍNH AR 2026</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight max-w-4xl mb-6">
            Tìm kiếm chiếc kính hoàn hảo <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              ngay tại nhà của bạn
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mb-10">
            Trải nghiệm công nghệ mô phỏng thị lực và thử kính thực tế ảo. 
            Biết chính xác chiếc kính nào hợp với khuôn mặt bạn trước khi mua.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center justify-center">
              Thử kính ngay <View className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= PRODUCT GRID ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Bộ sưu tập mới nhất</h2>
            <p className="text-gray-500 mt-2">Đa dạng kiểu dáng, phù hợp mọi khuôn mặt</p>
          </div>
          <button className="hidden md:flex items-center text-blue-600 font-medium hover:text-blue-800 transition">
            Xem tất cả <ArrowRight className="ml-1 w-4 h-4" />
          </button>
        </div>

        {/* Lưới sản phẩm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {PRODUCTS.map((product) => (
            <Link 
              to={`/product/${product.id}`} 
              key={product.id}
              className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
            >
              {/* Ảnh sản phẩm & Badge AR */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-4">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.isARAvailable && (
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-blue-600 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center shadow-sm">
                    <View className="w-3 h-3 mr-1" /> Có AR
                  </div>
                )}
              </div>

              {/* Thông tin */}
              <div className="flex flex-col flex-1">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                  {product.brand} • {product.shape}
                </p>
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                
                {/* Đẩy giá và nút bấm xuống đáy card */}
                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-blue-600 font-black text-lg">
                    {product.price.toLocaleString('vi-VN')}đ
                  </span>
                  <button className="bg-gray-100 text-gray-800 p-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}