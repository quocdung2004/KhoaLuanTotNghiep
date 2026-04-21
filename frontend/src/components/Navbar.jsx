import { Link } from 'react-router-dom'
import { ShoppingCart, Glasses } from 'lucide-react'
import useCartStore from '../store/cartStore'

function Navbar() {
  const items = useCartStore((state) => state.items)
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <nav className="bg-white shadow-md px-8 py-4 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
        <Glasses size={28} />
        EyeWear Shop
      </Link>

      {/* Menu */}
      <div className="flex items-center gap-8">
        <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium">
          Trang chủ
        </Link>
        <Link to="/products" className="text-gray-600 hover:text-blue-600 font-medium">
          Sản phẩm
        </Link>
        <Link to="/cart" className="relative text-gray-600 hover:text-blue-600">
          <ShoppingCart size={24} />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  )
}

export default Navbar