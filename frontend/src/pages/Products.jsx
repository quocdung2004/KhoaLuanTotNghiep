import { useState } from 'react'
import { Link } from 'react-router-dom'
import { products } from '../data/products'

function Products() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory)

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      <h1 className="text-3xl font-bold mb-6">Danh sách sản phẩm</h1>

      {/* Filter */}
      <div className="flex gap-3 mb-8">
        {[
          { key: 'all', label: 'Tất cả' },
          { key: 'can', label: 'Kính Cận' },
          { key: 'mat', label: 'Kính Mát' },
        ].map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-5 py-2 rounded-full font-medium transition border ${
              activeCategory === cat.key
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-500'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid sản phẩm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <Link to={`/products/${product.id}`} key={product.id}>
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 cursor-pointer">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  product.category === 'can'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {product.category === 'can' ? 'Kính Cận' : 'Kính Mát'}
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-1">{product.description}</p>
              <p className="text-blue-600 font-bold mt-3">
                {product.price.toLocaleString('vi-VN')} đ
              </p>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-gray-400 mt-20 text-lg">
          Không có sản phẩm nào!
        </div>
      )}
    </div>
  )
}

export default Products