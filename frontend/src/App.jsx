import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

// Import Layouts
import Navbar from './components/Navbar';
import AdminLayout from '../src/pages/admin/AdminLayout'; 
import StaffLayout from './pages/staff/StaffLayout'; // Thêm Layout mới cho Staff

// Import Pages (Khách hàng)
import Home from '../src/pages/customer/Home';
import ProductDetail from '../src/pages/customer/ProductDetail';
import Cart from '../src/pages/customer/Cart';
import Checkout from '../src/pages/customer/Checkout';
import MyPrescription from '../src/pages/customer/Prescription';

// Import Pages (Admin)
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from '../src/pages/admin/AdminProducts';

// Import Pages (Staff)
import OrderManagement from './pages/staff/OrderManagement';

// --- TẠO LAYOUT KHÁCH HÀNG (Có Navbar) ---
const CustomerLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* ================= KHU VỰC 1: KHÁCH HÀNG (Có Navbar) ================= */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-prescription" element={<MyPrescription />} />
        </Route>

        {/* ================= KHU VỰC 2: ADMIN (Quyền cao nhất) ================= */}
        {/* Admin được xem Dashboard, Quản lý sản phẩm, và cả Quản lý đơn hàng */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} /> 
          <Route path="products" element={<AdminProducts />} /> 
          <Route path="orders" element={<OrderManagement />} /> 
        </Route>

        {/* ================= KHU VỰC 3: STAFF (Bị giới hạn quyền) ================= */}
        {/* Staff dùng một Layout riêng, không có link dẫn tới trang Thống kê hay Sản phẩm */}
        <Route path="/staff" element={<StaffLayout />}>
          <Route index element={<OrderManagement />} /> {/* Đường dẫn: /staff */}
        </Route>

      </Routes>
    </BrowserRouter>
  );
}