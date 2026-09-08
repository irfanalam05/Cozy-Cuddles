import { categoryPath } from '../router'
import { useState } from 'react'

function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(() => {
  const saved = JSON.parse(localStorage.getItem('wishlist') || '[]')
  return saved.some((item) => item.name === product.name)
  })
  return (
    <a
      className="product-card"
      href={categoryPath(product.category)}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        window.location.hash = categoryPath(product.category)
        window.scrollTo({ top: 0 })
      }}
    >
      <div className="product-card-image">
        <img src={product.image} alt={product.name} loading="lazy" />
        <button className="product-wishlist-btn"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              const saved = JSON.parse(localStorage.getItem('wishlist') || '[]')

              if (isWishlisted) {
                const updated = saved.filter((item) => item.name !== product.name)
                localStorage.setItem('wishlist', JSON.stringify(updated))
                setIsWishlisted(false)
              } else {
                localStorage.setItem('wishlist',JSON.stringify([...saved, product]))
                setIsWishlisted(true)
              }
            }}
          >
          <span className="material-symbols-outlined">
            <span className="material-symbols-outlined">
              {isWishlisted ? '♥' : '♡'}
            </span>
          </span>
        </button>
      </div>

      <div className="product-card-hover">
        <h3>{product.name}</h3>
        <p className="product-card-cat">{product.category}</p>
        <p className="product-card-desc">{product.description}</p>
        <span className="product-card-arrow">
          <span className="product-card-arrow-btn">→</span>
        </span>
      </div>
    </a>
  )
}

export default ProductCard
