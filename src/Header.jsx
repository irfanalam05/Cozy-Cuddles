import { useState, useEffect } from 'react'
import { products } from './data/products'

function Header() {
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const getScroll = () =>
      window.scrollY ?? document.documentElement.scrollTop
    const handleScroll = () => {
      setScrolled(getScroll() > 100)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'Home', icon: 'home', href: '#home' },
    { label: 'Categories', icon: 'grid_view', href: '#categories' },
    { label: 'New Arrivals', icon: 'new_releases', href: '#new-arrivals' },
    { label: 'About', icon: 'info', href: '#about' },
  ]

  return (
    <>
      <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
        <div className="header-inner">
          <div className="logo">
            <img src="/logo/logo.png" alt="Cozy & Cuddles" />
          </div>

          <nav className="nav">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="nav-item">
                <span className="material-symbols-outlined nav-icon">{item.icon}</span>
                <span className={`nav-label ${scrolled ? 'nav-label--visible' : ''}`}>
                  {item.label}
                </span>
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <button
              className="icon-btn"
              aria-label="Search"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <span className="material-symbols-outlined">search</span>
            </button>
            <button className="icon-btn wishlist-btn" aria-label="Wishlist" onClick={() => {
                window.location.hash = '#wishlist'
                setSearchOpen(false)
                setCartOpen(false)
              }}
              >
              <span className="material-symbols-outlined">favorite</span>
            </button>
            <button
              className="icon-btn"
              aria-label="Cart"
              onClick={() => setCartOpen(!cartOpen)}
            >
              <span className="material-symbols-outlined">shopping_bag</span>
            </button>

            <button className="signin-btn" aria-label="Sign In" onClick={() => {
                  window.location.hash = '#login'
                  setSearchOpen(false)
                  setCartOpen(false)
                  setWishlistOpen(false)
                }}
              >
              <svg viewBox="0 0 24 24" width="22" height="22" className="signin-google-icon" fill="currentColor">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div className="search-panel">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          {searchQuery && (
            <div className="search-results">
              {products
                .filter((product) =>
                  `${product.name} ${product.category}`
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .map((product) => (
                  <a
                    key={product.id}
                    href="#products"
                    onClick={() => {
                      setSearchOpen(false)
                      setSearchQuery('')
                    }}
                  >
                    <strong>{product.name}</strong>
                    <span>{product.category}</span>
                  </a>
                ))}
              {products.filter(
                (product) =>
                  `${product.name} ${product.category}`
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
              ).length === 0 && (
                <p className="no-results">No products found.</p>
              )}
            </div>
          )}
          <button
            className="search-close"
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
          >
            &times;
          </button>
        </div>
      )}

      {cartOpen && (
        <div className="cart-panel">
          <div className="cart-panel-header">
            <h3>Your Cart</h3>
            <button
              className="cart-close"
              onClick={() => setCartOpen(false)}
              aria-label="Close cart"
            >
              &times;
            </button>
          </div>
          <div className="cart-empty">
            <div className="cart-empty-icon">
              <span className="material-symbols-outlined" style={{ fontSize: 56 }}>
                shopping_bag
              </span>
            </div>
            <h4>Your cart is empty</h4>
            <p>Add products to your cart and they will appear here.</p>
            <a
              href="#products"
              className="cart-shop-btn"
              onClick={() => setCartOpen(false)}
            >
              Browse Products &rarr;
            </a>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
