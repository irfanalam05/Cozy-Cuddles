import { useState, useEffect } from 'react'

function Cart({ onClose, isPage }) {
  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem('cart') || '[]')
  })

  const [quantities, setQuantities] = useState({})

  useEffect(() => {
    const qty = {}

    cartItems.forEach((item) => {
      qty[item.name] = 1
    })

    setQuantities(qty)
  }, [cartItems])

  const removeItem = (name) => {
    const updatedCart = cartItems.filter(
      (cartItem) => cartItem.name !== name
    )

    localStorage.setItem('cart', JSON.stringify(updatedCart))
    setCartItems(updatedCart)
  }

  if (isPage) {
    return (
      <>
        <main className="cart-page">

          <div className="cart-page-header"></div>

          <div className="cart-page-content">

            <section className="cart-products">

              <div className="cart-section-title">
                <h2>Your Cart</h2>
                <span>{cartItems.length} items</span>
              </div>

              <div className="cart-table-header">
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Total</span>
                <span></span>
              </div>

              {cartItems.length === 0 ? (
                <div className="cart-empty">
                  <div className="cart-empty-icon">🛒</div>
                  <h4>Your cart is empty</h4>
                  <p>Add some cozy products to your cart!</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div className="cart-page-item" key={item.name}>

                    <div className="cart-product-info">

                      <img
                        src={item.image}
                        alt={item.name}
                      />

                      <div className="cart-page-item-info">
                        <h3>{item.name}</h3>
                      </div>

                    </div>

                    <div className="cart-page-price">
                      —
                    </div>

                    <div className="cart-quantity">

                      <button
                        onClick={() =>
                          setQuantities((prev) => ({
                            ...prev,
                            [item.name]: Math.max(
                              1,
                              (prev[item.name] || 1) - 1
                            ),
                          }))
                        }
                      >
                        −
                      </button>

                      <span>
                        {quantities[item.name] || 1}
                      </span>

                      <button
                        onClick={() =>
                          setQuantities((prev) => ({
                            ...prev,
                            [item.name]:
                              (prev[item.name] || 1) + 1,
                          }))
                        }
                      >
                        +
                      </button>

                    </div>

                    <div className="cart-page-total">
                      —
                    </div>

                    <button
                      className="cart-delete-btn"
                      onClick={() => removeItem(item.name)}
                      aria-label={`Remove ${item.name}`}
                    >
                      🗑
                    </button>

                  </div>
                ))
              )}

              <div className="cart-page-actions">

                <button className="continue-shopping-btn">
                  ← Continue Shopping
                </button>

                <button className="save-cart-btn">
                  ♡ Save cart for later
                </button>

              </div>

            </section>

            {cartItems.length > 0 && (
              <aside className="cart-summary">

                <h2>Order Summary</h2>

                <div className="cart-summary-line">
                  <span>Subtotal</span>
                  <strong>₹0</strong>
                </div>

                <div className="cart-summary-total">
                  <span>Total</span>
                  <strong>₹0</strong>
                </div>

                <button className="cart-checkout-btn">
                  Proceed to Checkout
                </button>

                <div className="cart-summary-features">

                  <div className="cart-feature">
                    <span>🚚</span>
                    <p>Free shipping on orders above ₹999</p>
                  </div>

                  <div className="cart-feature">
                    <span>🛡️</span>
                    <p>Secure and safe payments</p>
                  </div>

                  <div className="cart-feature">
                    <span>♡</span>
                    <p>Easy returns within 7 days</p>
                  </div>

                </div>

                <div className="cart-summary-decoration">
                  <p>
                    Thank you for
                    <br />
                    spreading happiness! ♡
                  </p>

                  <span>♡</span>
                </div>

              </aside>
            )}

          </div>

        </main>

        {/* CART PAGE FOOTER */}

        <footer className="cart-page-footer">

          <div className="cart-footer-inner">

            <div className="cart-footer-brand">

              <img src="/logo/logo.png" alt="Cozy & Cuddles" />

              <h3>Cozy & Cuddles</h3>

              <p>Cozy things, brighter days</p>

            </div>

            <div className="cart-footer-links">

              <a href="#home">Home</a>
              <span>|</span>

              <a href="#categories">Categories</a>
              <span>|</span>

              <a href="#new-arrivals">New Arrivals</a>
              <span>|</span>

              <a href="#about">About</a>
              <span>|</span>

              <a href="#contact">Contact</a>

            </div>

            <div className="cart-footer-social">

              <h4>Follow Us</h4>

              <div className="cart-social-icons">
                <span>◎</span>
                <span>f</span>
                <span>P</span>
                <span>▶</span>
                <span>♡</span>
              </div>

            </div>

            <div className="cart-footer-message">

              <p>
                Small
                <br />
                Moments
                <br />
                Big Smiles <span>♡</span>
              </p>

            </div>

          </div>

          <div className="cart-footer-bottom">
            © 2026 Cozy & Cuddles. All rights reserved.
          </div>

        </footer>
      </>
    )
  }

  return (
    <div className="cart-panel">

      <div className="cart-panel-header">

        <h3>Your Cart</h3>

        <button
          className="cart-close"
          onClick={onClose}
          aria-label="Close cart"
        >
          &times;
        </button>

      </div>

      <div className="cart-content">

        {cartItems.length === 0 ? (
          <div className="cart-empty">

            <div className="cart-empty-icon">
              🛒
            </div>

            <h4>Your cart is empty</h4>

            <p>
              Add some cozy products to your cart!
            </p>

          </div>
        ) : (
          cartItems.map((item) => (
            <div
              className="cart-item"
              key={item.name}
            >

              <img
                src={item.image}
                alt={item.name}
              />

              <div className="cart-item-info">

                <h4>{item.name}</h4>

                <button
                  className="cart-remove-btn"
                  onClick={() => removeItem(item.name)}
                >
                  Remove
                </button>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  )
}

export default Cart