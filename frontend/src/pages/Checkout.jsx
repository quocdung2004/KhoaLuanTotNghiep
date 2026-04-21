import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useCartStore from '../store/cartStore'

function Checkout() {
  const navigate = useNavigate()
  const items = useCartStore((state) => state.items)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)
  const clearCart = useCartStore((state) => state.clearCart)

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    note: '',
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleOrder = () => {
    if (!form.name || !form.phone || !form.address) {
      alert('Vui lòng điền đầy đủ thông tin!')
      return
    }
    setSubmitted(true)
    clearCart()
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-8 py-20 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2">Đặt hàng thành công!</h2>
        <p className="text-gray-500 mb-6">Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ sớm nhất!</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition font-semibold"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-8 py-20 text-center">
        <p className="text-gray-400 text-xl mb-4">Giỏ hàng trống!</p>
        <button
          onClick={() => navigate('/products')}
          className="text-blue-600 hover:underline"
        >
          Quay lại mua sắm →
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-8 py-10">
      <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Form thông tin */}
        <div className="flex-1 bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4">
          <h2 className="text-xl font-bold mb-2">Thông tin giao hàng</h2>

          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">Họ tên *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">Số điện thoại *</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="0909 123 456"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">Địa chỉ *</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="123 Đường ABC, Quận 1, TP.HCM"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">Ghi chú</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="Ghi chú thêm cho đơn hàng..."
              rows={3}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Tóm tắt đơn hàng */}
        <div className="w-full md:w-80 flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Đơn hàng</h2>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">{item.name} x{item.quantity}</span>
                <span className="font-medium">
                  {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                </span>
              </div>
            ))}
            <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
              <span>Tổng cộng</span>
              <span className="text-blue-600">{getTotalPrice().toLocaleString('vi-VN')} đ</span>
            </div>
          </div>

          <button
            onClick={handleOrder}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold text-lg"
          >
            Đặt hàng
          </button>
        </div>
      </div>
    </div>
  )
}

export default Checkout