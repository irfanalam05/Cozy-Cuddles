import { useState } from 'react'
import { products } from '../data/products'

function ProductCard({ product }) {
  const [currentImage, setCurrentImage] = useState(0)
  const [touchStart, setTouchStart] = useState(null)

  const nextImage = () => {
    setCurrentImage((current) =>
      current === product.images.length - 1 ? 0 : current + 1
    )
  }

  const previousImage = () => {
    setCurrentImage((current) =>
      current === 0 ? product.images.length - 1 : current - 1
    )
  }

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e) => {
    if (touchStart === null) return

    const touchEnd = e.changedTouches[0].clientX
    const difference = touchStart - touchEnd

    if (Math.abs(difference) > 50) {
      if (difference > 0) {
        nextImage()
      } else {
        previousImage()
      }
    }

    setTouchStart(null)
  }

  return (
    <div className="product-card">
      <div
        className="product-image"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={product.images[currentImage]}
          alt={product.name}
        />

        {product.images.length > 1 && (
          <>
            <button
              className="slider-btn slider-prev"
              onClick={previousImage}
              aria-label="Previous image"
            >
              ‹
            </button>

            <button
              className="slider-btn slider-next"
              onClick={nextImage}
              aria-label="Next image"
            >
              ›
            </button>

            <div className="image-dots">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${
                    currentImage === index ? 'active' : ''
                  }`}
                  onClick={() => setCurrentImage(index)}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="product-info">
        <small>{product.category}</small>

        <h3>{product.name}</h3>

        <p className="product-price">
          {product.price ?? 'Price on Request'}
        </p>

        <button className="view-product">
          View Product →
        </button>
      </div>
    </div>
  )
}

function Products() {
  return (
    <section id="products" className="products-section">
      <div className="products-heading">
        <p>OUR COLLECTION</p>

        <h2>Made for little moments.</h2>

        <span>
          Comfortable products for happy little ones.
        </span>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  )
}

export default Products