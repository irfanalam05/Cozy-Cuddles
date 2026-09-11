import { useState } from 'react'

function Cart({ onClose }) {
  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem('cart') || '[]')
  })

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

            <p>Add some cozy products to your cart!</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div className="cart-item" key={item.name}>
              <img src={item.image} alt={item.name} />

              <div className="cart-item-info">
                <h4>{item.name}</h4>

                <button
                  className="cart-remove-btn"
                  onClick={() => {
                    const updatedCart = cartItems.filter(
                      (cartItem) => cartItem.name !== item.name
                    )

                    localStorage.setItem(
                      'cart',
                      JSON.stringify(updatedCart)
                    )

                    setCartItems(updatedCart)
                  }}
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