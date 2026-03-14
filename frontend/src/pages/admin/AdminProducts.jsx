import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, View, X, Image as ImageIcon, Search } from 'lucide-react';
// Import dữ liệu cứng ban đầu để làm data mẫu
import { PRODUCTS } from '../../constants/data';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Quản lý trạng thái hộp thoại (Modal) Thêm sản phẩm
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', brand: '', shape: '', price: '', image: '', isARAvailable: false, description: ''
  });

  // 1. Tải danh sách sản phẩm
  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem('glassesProducts'));
    if (savedProducts && savedProducts.length > 0) {
      setProducts(savedProducts);
    } else {
      // Nếu bộ nhớ máy trống, lấy dữ liệu từ file data.js làm mẫu
      setProducts(PRODUCTS);
      localStorage.setItem('glassesProducts', JSON.stringify(PRODUCTS));
    }
  }, []);

  // 2. Hàm lưu dữ liệu vào LocalStorage
  const saveProducts = (newProducts) => {
    setProducts(newProducts);
    localStorage.setItem('glassesProducts', JSON.stringify(newProducts));
    // Bắn tín hiệu để trang Chủ cập nhật (nếu cần)
    window.dispatchEvent(new Event('productsUpdated'));
  };

  // 3. Xử lý Xóa sản phẩm
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa chiếc kính này khỏi cửa hàng?")) {
      const newProducts = products.filter(p => p.id !== id);
      saveProducts(newProducts);
    }
  };

  // 4. Xử lý Thêm sản phẩm mới
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Tạo ID mới ngẫu nhiên (hoặc tự tăng)
    const newId = Math.floor(Math.random() * 100000);
    
    const newProduct = {
      ...formData,
      id: newId,
      price: parseInt(formData.price) || 0
    };

    const newProducts = [newProduct, ...products]; // Đẩy sản phẩm mới lên đầu danh sách
    saveProducts(newProducts);
    
    // Reset form và đóng Modal
    setIsModalOpen(false);
    setFormData({ name: '', brand: '', shape: '', price: '', image: '', isARAvailable: false, description: '' });
  };

  // Lọc sản phẩm theo ô tìm kiếm
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER QUẢN TRỊ */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Quản lý Sản phẩm</h1>
            <p className="text-gray-500 mt-1">Kiểm soát kho hàng và các mẫu kính hỗ trợ AR</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            <Plus className="w-5 h-5" /> Thêm kính mới
          </button>
        </div>

        {/* BỘ LỌC & TÌM KIẾM */}
        <div className="bg-white p-4 rounded-t-3xl border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Tìm tên kính hoặc thương hiệu..." 
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-gray-500 font-medium bg-gray-50 px-4 py-3 rounded-2xl">
            Tổng cộng: <span className="font-bold text-gray-900">{products.length}</span> sản phẩm
          </div>
        </div>

        {/* BẢNG DỮ LIỆU SẢN PHẨM */}
        <div className="bg-white rounded-b-3xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-bold">Hình ảnh</th>
                <th className="p-4 font-bold">Thông tin kính</th>
                <th className="p-4 font-bold">Giá bán</th>
                <th className="p-4 font-bold text-center">AR Support</th>
                <th className="p-4 font-bold text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-blue-50/30 transition-colors group">
                  
                  {/* Cột Ảnh */}
                  <td className="p-4 w-24">
                    <div className="w-16 h-16 bg-gray-50 rounded-xl p-1 border border-gray-100 flex items-center justify-center">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-gray-300" />
                      )}
                    </div>
                  </td>

                  {/* Cột Thông tin */}
                  <td className="p-4">
                    <div className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">{product.name}</div>
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                      {product.brand || 'No Brand'} • {product.shape || 'Unknown'}
                    </div>
                  </td>

                  {/* Cột Giá */}
                  <td className="p-4">
                    <div className="font-black text-blue-600 text-lg">
                      {product.price.toLocaleString('vi-VN')} đ
                    </div>
                  </td>

                  {/* Cột Tính năng AR */}
                  <td className="p-4 text-center">
                    {product.isARAvailable ? (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold border border-green-200">
                        <View className="w-3 h-3" /> Hỗ trợ AR
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full text-xs font-bold">
                        Không có
                      </span>
                    )}
                  </td>

                  {/* Cột Nút thao tác */}
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL THÊM SẢN PHẨM MỚI ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            
            <div className="sticky top-0 bg-white/90 backdrop-blur-md px-8 py-6 border-b border-gray-100 flex justify-between items-center z-10">
              <h2 className="text-2xl font-black text-gray-900">Thêm Kính Mới</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              
              {/* Tên & Giá */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Tên sản phẩm *</label>
                  <input required type="text" placeholder="VD: Gọng kính Titanium Mắt Mèo" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Giá bán (VNĐ) *</label>
                  <input required type="number" placeholder="VD: 550000" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                  />
                </div>
              </div>

              {/* Thương hiệu & Kiểu dáng */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Thương hiệu</label>
                  <input type="text" placeholder="VD: RayBan, Dũng Glasses..." 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Kiểu dáng</label>
                  <input type="text" placeholder="VD: Vuông, Tròn, Mắt mèo..." 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.shape} onChange={e => setFormData({...formData, shape: e.target.value})}
                  />
                </div>
              </div>

              {/* Link Ảnh */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Đường dẫn ảnh (URL) *</label>
                <input required type="text" placeholder="https://domain.com/anh-kinh.png" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-blue-600"
                  value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})}
                />
              </div>

              {/* Nút gạt (Toggle) Công nghệ AR */}
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-blue-900 flex items-center gap-2"><View className="w-5 h-5"/> Hỗ trợ Thử kính ảo (AR)</h4>
                  <p className="text-sm text-blue-600/80 mt-1">Bật tính năng này nếu sản phẩm đã được AI MediaPipe hỗ trợ nhận diện khuôn mặt.</p>
                </div>
                {/* Nút Toggle Switch CSS thuần */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" 
                    checked={formData.isARAvailable} 
                    onChange={e => setFormData({...formData, isARAvailable: e.target.checked})} 
                  />
                  <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
                </label>
              </div>

              {/* Nút Lưu */}
              <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition shadow-lg">
                Lưu Sản Phẩm Vào Kho
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}