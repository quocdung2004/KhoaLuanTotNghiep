import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { products } from '../data/products'
import { ShoppingCart, Camera } from 'lucide-react'
import TryOn from '../components/TryOn'
import useCartStore from '../store/cartStore'
import PrescriptionModal from '../components/PrescriptionModal'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showTryOn, setShowTryOn] = useState(false)
  const [showPrescription, setShowPrescription] = useState(false)
  const [prescription, setPrescription] = useState(null)
  const product = products.find((p) => p.id === parseInt(id))
  const addItem = useCartStore((state) => state.addItem)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }
  if (!product) {
    return (
      <div className="text-center mt-20 text-red-500 text-xl">
        Không tìm thấy sản phẩm!
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-8 py-10">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline mb-6 inline-block"
      >
        ← Quay lại
      </button>

      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex-1">
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-2xl shadow-md"
          />
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-500">{product.description}</p>
          <p className="text-2xl font-bold text-blue-600">
            {product.price.toLocaleString('vi-VN')} đ
          </p>

          <div>
            <p className="font-semibold mb-2">Màu sắc:</p>
            <div className="flex gap-2 flex-wrap">
              {product.colors.map((color) => (
                <span
                  key={color}
                  className="border border-gray-300 rounded-full px-4 py-1 text-sm cursor-pointer hover:border-blue-500 hover:text-blue-500"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleAddToCart}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition ${added
                ? 'bg-green-500 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
              <ShoppingCart size={20} />
              {added ? 'Đã thêm vào giỏ!' : 'Thêm vào giỏ'}
            </button>
            <button
              onClick={() => setShowPrescription(true)}
              className="flex items-center gap-2 border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-xl hover:bg-blue-50 transition"
            >
              <Camera size={20} />
              Thử kính
            </button>
          </div>
        </div>
      </div>

      {showPrescription && (
        <PrescriptionModal
          onClose={() => setShowPrescription(false)}
          onConfirm={(data) => {
            setPrescription(data)
            setShowPrescription(false)
            setShowTryOn(true)
          }}
        />
      )}

      {showTryOn && (
        <TryOn
          product={product}
          prescription={prescription}
          onClose={() => {
            setShowTryOn(false)
            setPrescription(null)
          }}
        />
      )}
    </div>
  )
}

export default ProductDetail