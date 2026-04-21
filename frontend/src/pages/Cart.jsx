import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import useCartStore from '../store/cartStore'

function Cart() {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-8 py-20 text-center">
        <p className="text-gray-400 text-xl mb-4">Giỏ hàng trống!</p>
        <Link to="/products" className="text-blue-600 hover:underline">
          Tiếp tục mua sắm →
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-8 py-10">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng</h1>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-20 object-cover rounded-xl"
            />
            <div className="flex-1">
              <h2 className="font-semibold text-lg">{item.name}</h2>
              <p className="text-blue-600 font-bold">
                {item.price.toLocaleString('vi-VN')} đ
              </p>
            </div>

            {/* Số lượng */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
              >
                -
              </button>
              <span className="w-6 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
              >
                +
              </button>
            </div>

            {/* Xóa */}
            <button
              onClick={() => removeItem(item.id)}
              className="text-red-400 hover:text-red-600"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Tổng tiền */}
      <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between items-center text-xl font-bold">
          <span>Tổng cộng:</span>
          <span className="text-blue-600">
            {getTotalPrice().toLocaleString('vi-VN')} đ
          </span>
        </div>
        <Link to="/checkout" className="mt-4 block w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold text-lg text-center">
          Đặt hàng
        </Link>
      </div>
    </div>
  )
}

export default Cart