import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, Truck, XCircle, Search, Eye, Filter } from 'lucide-react';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Tải danh sách đơn hàng từ LocalStorage
  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('glassesOrders')) || [];
    setOrders(savedOrders);
  }, []);

  // 2. Hàm Cập nhật trạng thái đơn hàng (Dành cho Admin)
  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });
    setOrders(updatedOrders);
    localStorage.setItem('glassesOrders', JSON.stringify(updatedOrders));
  };

  // 3. Render Badge Trạng Thái
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock className="w-3 h-3"/> Chờ xác nhận</span>;
      case 'shipping':
        return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Truck className="w-3 h-3"/> Đang giao hàng</span>;
      case 'completed':
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3"/> Hoàn tất</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><XCircle className="w-3 h-3"/> Đã hủy</span>;
      default:
        return status;
    }
  };

  // 4. Tính toán thống kê nhanh
  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter(o => o.status === 'pending').length;

  // 5. Lọc đơn hàng theo ô tìm kiếm
  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    order.customer.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Quản lý Đơn hàng</h1>
            <p className="text-gray-500 mt-1">Hệ thống xử lý đơn hàng nội bộ dành cho Staff/Admin</p>
          </div>
        </div>

        {/* THỐNG KÊ NHANH (KPI CARDS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><Package className="w-7 h-7" /></div>
            <div>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Tổng Đơn Hàng</p>
              <p className="text-3xl font-black text-gray-900">{orders.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center"><Clock className="w-7 h-7" /></div>
            <div>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Cần Xử Lý</p>
              <p className="text-3xl font-black text-gray-900">{pendingCount}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center"><CheckCircle className="w-7 h-7" /></div>
            <div>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Doanh thu tạm tính</p>
              <p className="text-3xl font-black text-green-600">{totalRevenue.toLocaleString('vi-VN')}đ</p>
            </div>
          </div>
        </div>

        {/* BỘ LỌC & TÌM KIẾM */}
        <div className="bg-white p-4 rounded-t-3xl border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Tìm theo Mã đơn hoặc Số điện thoại..." 
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-700 font-bold rounded-2xl hover:bg-gray-100 w-full sm:w-auto justify-center">
            <Filter className="w-5 h-5" /> Lọc trạng thái
          </button>
        </div>

        {/* BẢNG DỮ LIỆU ĐƠN HÀNG */}
        <div className="bg-white rounded-b-3xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-bold">Mã Đơn / Ngày</th>
                <th className="p-4 font-bold">Khách Hàng</th>
                <th className="p-4 font-bold">Sản phẩm</th>
                <th className="p-4 font-bold">Tổng Tiền / PTTT</th>
                <th className="p-4 font-bold">Trạng Thái</th>
                <th className="p-4 font-bold text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-500">Không tìm thấy đơn hàng nào.</td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-blue-50/30 transition-colors">
                    
                    {/* Cột 1: Mã & Ngày */}
                    <td className="p-4">
                      <div className="font-black text-blue-600">{order.id}</div>
                      <div className="text-xs text-gray-500 mt-1">{new Date(order.date).toLocaleString('vi-VN')}</div>
                    </td>

                    {/* Cột 2: Khách hàng */}
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{order.customer.name}</div>
                      <div className="text-sm text-gray-600">{order.customer.phone}</div>
                      <div className="text-xs text-gray-500 mt-1 truncate max-w-[200px]" title={order.customer.address}>{order.customer.address}</div>
                    </td>

                    {/* Cột 3: Sản phẩm */}
                    <td className="p-4">
                      <div className="text-sm text-gray-700">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="line-clamp-1 max-w-[200px]">
                            <span className="font-bold">{item.quantity}x</span> {item.name}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Cột 4: Tiền & PTTT */}
                    <td className="p-4">
                      <div className="font-black text-gray-900">{order.total.toLocaleString('vi-VN')}đ</div>
                      <div className="text-xs font-bold mt-1 text-gray-500 uppercase">
                        {order.paymentMethod === 'cod' ? 'Tiền mặt (COD)' : 'Chuyển khoản QR'}
                      </div>
                    </td>

                    {/* Cột 5: Trạng thái */}
                    <td className="p-4">
                      {renderStatusBadge(order.status)}
                    </td>

                    {/* Cột 6: Hành động (Đổi trạng thái) */}
                    <td className="p-4 text-center">
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none cursor-pointer font-bold"
                      >
                        <option value="pending">Chờ xác nhận</option>
                        <option value="shipping">Đang giao hàng</option>
                        <option value="completed">Hoàn tất</option>
                        <option value="cancelled">Hủy đơn</option>
                      </select>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}