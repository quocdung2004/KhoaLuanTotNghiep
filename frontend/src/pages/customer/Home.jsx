import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { View, ArrowRight, Sparkles, ShoppingBag, ShieldCheck } from 'lucide-react';
import { PRODUCTS } from '../../constants/data';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* ================= HERO BANNER MỚI (CHIA 2 CỘT) ================= */}
      <div className="bg-white border-b border-gray-100 overflow-hidden relative">
        {/* Vòng tròn trang trí mờ ảo ở background */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-50/50 blur-3xl -z-10"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-indigo-50/50 blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12 z-10 relative">
          
          {/* Cột trái: Chữ và Nút bấm */}
          <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full mb-6 border border-blue-100">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="text-xs font-black tracking-widest uppercase">Công nghệ AR 2026</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
              Tìm kiếm chiếc kính hoàn hảo <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                ngay tại nhà của bạn
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-10 max-w-lg leading-relaxed">
              Trải nghiệm công nghệ thử kính thực tế ảo (AR) độc quyền. 
              Mở camera, ướm thử hàng trăm mẫu kính và biết chính xác chiếc nào sinh ra là dành cho khuôn mặt bạn.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* Nút chính: Scroll thẳng xuống khu vực sản phẩm */}
              <button 
                onClick={() => document.getElementById('product-section').scrollIntoView({ behavior: 'smooth' })}
                className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-600 transition flex items-center justify-center gap-2 shadow-xl hover:-translate-y-1"
              >
                <View className="w-6 h-6" /> Thử kính ngay
              </button>
              
              {/* Nút phụ: Dành cho ai đã đo mắt ở bệnh viện muốn nhập độ cận */}
              <Link 
                to="/my-prescription"
                className="bg-white text-gray-900 border-2 border-gray-200 px-8 py-4 rounded-2xl font-bold text-lg hover:border-gray-900 transition flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-6 h-6 text-gray-400" /> Cập nhật độ cận
              </Link>
            </div>
          </div>

          {/* Cột phải: Hình ảnh minh họa (Bạn có thể thay bằng 1 tấm ảnh người mẫu đeo kính thật đẹp) */}
          <div className="md:w-1/2 w-full flex justify-center relative">
            <div className="relative w-full max-w-md aspect-square bg-gradient-to-br from-blue-100 to-indigo-50 rounded-[3rem] p-8 flex items-center justify-center shadow-inner border border-white">
              {/* Gợi ý: Thay link ảnh này bằng 1 tấm ảnh mockup của hệ thống AR bạn đang làm */}
              <img 
                src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=800&auto=format&fit=crop" 
                alt="Người mẫu đeo kính" 
                className="w-full h-full object-cover rounded-[2rem] shadow-2xl transform rotate-3 hover:rotate-0 transition duration-500"
              />
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 animate-bounce">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <View className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Trải nghiệm</p>
                  <p className="font-black text-gray-900">AR Camera</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ================= PRODUCT GRID (DANH SÁCH SẢN PHẨM) ================= */}
      {/* Đặt ID để nút ở Banner scroll xuống đúng vị trí này */}
      <div id="product-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Bộ sưu tập Kính AR</h2>
            <p className="text-gray-500 mt-2 text-lg">Đeo thử trực tiếp trên khuôn mặt qua Camera của bạn</p>
          </div>
          <button className="flex items-center text-blue-600 font-bold hover:text-blue-800 transition bg-blue-50 px-4 py-2 rounded-full">
            Xem tất cả 120+ mẫu <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </div>

        {/* Lưới sản phẩm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {PRODUCTS.map((product) => (
            <div 
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)} // Bấm bất kỳ đâu trên thẻ cũng sang trang chi tiết
              className="group bg-white rounded-3xl p-5 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 border border-gray-100 flex flex-col cursor-pointer relative"
            >
              {/* Nút Xem Chi Tiết ẩn (Hiện lên khi hover) */}
              <div className="absolute inset-0 bg-gray-900/5 z-10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                <button className="bg-white text-gray-900 font-bold px-6 py-3 rounded-xl shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  Thử kính ngay
                </button>
              </div>

              {/* Ảnh sản phẩm & Badge AR */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-5 p-4 flex items-center justify-center">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-auto object-contain group-hover:scale-110 transition-transform duration-500 relative z-0"
                />
                
                {/* Badge Có AR nổi bật */}
                {product.isARAvailable && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full flex items-center shadow-lg uppercase tracking-wider z-0">
                    <span className="w-2 h-2 bg-white rounded-full mr-2 animate-ping absolute"></span>
                    <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                    Hỗ trợ AR
                  </div>
                )}
              </div>

              {/* Thông tin kính */}
              <div className="flex flex-col flex-1 relative z-0">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">
                  {product.brand || "Kính Dũng"} • {product.shape || "Classic"}
                </p>
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                
                {/* Đẩy giá và giỏ hàng xuống đáy card */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-blue-600 font-black text-xl">
                    {product.price.toLocaleString('vi-VN')} đ
                  </span>
                  
                  {/* Icon giỏ hàng nhỏ ở góc */}
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}