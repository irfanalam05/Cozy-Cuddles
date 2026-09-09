import { useState } from 'react'
import ProductCard from './ProductCard'

function Wishlist() {
  const [wishlist, setWishlist] = useState(() => {
    return JSON.parse(localStorage.getItem('wishlist') || '[]')
  })

  const removeFromWishlist = (productId) => {
    const updated = wishlist.filter((item) => item.id !== productId)
    localStorage.setItem('wishlist', JSON.stringify(updated))
    setWishlist(updated)
  }

  return (
    <section className="wishlist-page">
      <div className="wishlist-heading">
        <button className="back-btn" onClick={() => {
                    window.location.hash = '#/' 
                    setTimeout(() => {
                        document.getElementById('categories')?.scrollIntoView({
                            behavior: 'smooth'
                        })
                    }, 300)
            }}
            >
            ← Back to Categories
        </button>
        <p className="section-tag">YOUR FAVORITES</p>
        <h1>My Wishlist ❤️</h1>
        <p>Products you've saved for your little one.</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <span className="wishlist-circle wishlist-circle-1"></span>
          <span className="wishlist-circle wishlist-circle-2"></span>
          <span className="wishlist-ring"></span>
          <span className="wishlist-deco wishlist-deco-left">♥</span>
          <span className="wishlist-deco wishlist-deco-right">♥</span>
          <h2>A little more cozy is waiting for your little one❤️</h2>
          <p>Save your favorite products here and find them easily whenever you need them.</p>
          <a href="#categories" className="shop-btn">
            Explore Categories →
          </a>
        </div>
        
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((product) => (
            <div className="wishlist-item" key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Wishlist