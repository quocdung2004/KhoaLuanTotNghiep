import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

// 1. Import các trang Khách hàng
import Home from './pages/customer/Home';
import ProductDetail from './pages/customer/ProductDetail';
import Cart from './pages/customer/Cart';
import Prescription from './pages/customer/Prescription';

// 2. Import các trang Admin & Staff
import Dashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/staff/OrderManagement';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <Routes>
          {/* LUỒNG KHÁCH HÀNG */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/my-prescription" element={<Prescription />} />

          {/* LUỒNG NHÂN VIÊN (Staff) */}
          <Route path="/staff/orders" element={<OrderManagement />} />

          {/* LUỒNG ADMIN */}
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/products" element={<ProductManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;