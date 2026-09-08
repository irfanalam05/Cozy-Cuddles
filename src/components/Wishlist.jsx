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
          <span className="material-symbols-outlined">favorite_border</span>
          <h2>Your wishlist is empty</h2>
          <p>Add products you love and they'll appear here.</p>
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