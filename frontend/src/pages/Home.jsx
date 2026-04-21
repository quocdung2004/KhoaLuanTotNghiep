import { Link } from 'react-router-dom'
import { products } from '../data/products'

function Home() {
  const featured = products.slice(0, 3)

  return (
    <div>
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-20 px-8 text-center">
        <h1 className="text-5xl font-bold mb-4">Kính Mắt Thời Trang</h1>
        <p className="text-xl mb-8 opacity-90">
          Khám phá bộ sưu tập kính mắt cao cấp — Thử kính ảo ngay tại nhà!
        </p>
        <Link
          to="/products"
          className="bg-white text-blue-600 font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition text-lg"
        >
          Mua sắm ngay →
        </Link>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-8 py-16">
        <div className="text-center">
          <div className="text-4xl mb-3">👓</div>
          <h3 className="font-bold text-lg mb-2">Thử Kính Ảo</h3>
          <p className="text-gray-500">Đeo thử kính trực tiếp qua camera mà không cần đến cửa hàng</p>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-3">🚚</div>
          <h3 className="font-bold text-lg mb-2">Giao Hàng Nhanh</h3>
          <p className="text-gray-500">Giao hàng toàn quốc trong 2-3 ngày làm việc</p>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-3">✅</div>
          <h3 className="font-bold text-lg mb-2">Chính Hãng 100%</h3>
          <p className="text-gray-500">Cam kết sản phẩm chính hãng, bảo hành 12 tháng</p>
        </div>
      </div>

      {/* Sản phẩm nổi bật */}
      <div className="max-w-5xl mx-auto px-8 pb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Sản Phẩm Nổi Bật</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {featured.map((product) => (
            <Link to={`/products/${product.id}`} key={product.id}>
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 cursor-pointer">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-blue-600 font-bold mt-2">
                  {product.price.toLocaleString('vi-VN')} đ
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            to="/products"
            className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full hover:bg-blue-50 transition font-semibold"
          >
            Xem tất cả sản phẩm →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home