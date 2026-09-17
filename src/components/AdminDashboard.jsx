import { useEffect, useState } from 'react'
function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [sortBy, setSortBy] = useState('Sort By')

  const [orderSearchTerm, setOrderSearchTerm] = useState('')
const [orderStatusFilter, setOrderStatusFilter] = useState('All Status')
const [paymentFilter, setPaymentFilter] = useState('All Payments')
const [orderSortBy, setOrderSortBy] = useState('Sort By')

const [userSearchTerm, setUserSearchTerm] = useState('')
const [userSortBy, setUserSortBy] = useState('Sort By')

  const [showSuccess, setShowSuccess] = useState(false)
  const [editingProductId, setEditingProductId] = useState(null)
  const [deleteProductId, setDeleteProductId] = useState(null)
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    price: '',
    sale_price: '',
    stock: '',
    sku: '',
    description: '',
    images: '',
    age_range: '',
    features: '',
    is_active: true
  })

  const handleAddProduct = async (e) => {
    e.preventDefault()

    try {
      const url = editingProductId
        ? `http://localhost:5000/api/products/${editingProductId}`
        : 'http://localhost:5000/api/products'

      const method = editingProductId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: productForm.name,
          category: productForm.category,
          price: productForm.price,
          sale_price: productForm.sale_price,
          stock: productForm.stock,
          sku: productForm.sku,
          description: productForm.description,
          images: productForm.images ? [productForm.images] : [],
          age_range: productForm.age_range,
          features: productForm.features
            ? productForm.features.split(',').map((feature) => feature.trim())
            : [],
          is_active: productForm.is_active,
          is_bestseller: false,
          is_new: true,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setShowSuccess(true)

        setTimeout(() => {
          setShowSuccess(false)
        }, 3000)

        const productsResponse = await fetch(
          'http://localhost:5000/api/products'
        )

        const productsData = await productsResponse.json()

        if (productsData.success) {
          setProducts(productsData.products)
        }

        setEditingProductId(null)
        setActiveSection('products')
      } else {
        alert(data.message || 'Failed to save product')
      }

      console.log('Product Save:', data)
    } catch (error) {
      console.error('Product save error:', error)
    }
  }

  const handleDeleteProduct = async (productId) => {
    setDeleteProductId(productId)
  }

  const handleUpdateOrderStatus = async (orderId, orderStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            order_status: orderStatus
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update order status')
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, order_status: data.order.order_status }
            : order
        )
      )
    } catch (error) {
      console.error('Order status update error:', error)
    }
  }

  const confirmDeleteProduct = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${deleteProductId}`,
        {
          method: 'DELETE',
        }
      )

      const data = await response.json()

      if (data.success) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== deleteProductId)
        )

        setDeleteProductId(null)
      } else {
        alert(data.message || 'Failed to delete product')
      }
    } catch (error) {
      console.error('Delete product error:', error)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('adminToken')

    fetch('http://localhost:5000/api/admin/test', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('JWT test:', data)
      })
      .catch((error) => {
        console.error('JWT test error:', error)
      })
  }, [])

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.products)
        console.log('Products:', data.products)
      })
      .catch((error) => {
        console.error('Products fetch error:', error)
      })
  }, [])

  useEffect(() => {
    fetch('http://localhost:5000/api/orders')
      .then((response) => response.json())
      .then((data) => {
        setOrders(data.orders)
        console.log('Orders:', data.orders)
      })
      .catch((error) => {
        console.error('Orders fetch error:', error)
      })
  }, [])

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.users)
        console.log('Users:', data.users)
      })
      .catch((error) => {
        console.error('Users fetch error:', error)
      })
  }, [])

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span>Cozy</span> & Cuddles
        </div>

        <nav className="admin-nav">
          <button className={`admin-nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveSection('dashboard')}
            >
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </button>

          <button className={`admin-nav-item ${activeSection === 'products' ? 'active' : ''}`}
            onClick={() => setActiveSection('products')}
            >
            <span className="material-symbols-outlined">inventory_2</span>
            Products
          </button>

          <button className={`admin-nav-item ${activeSection === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveSection('orders')}
            >
            <span className="material-symbols-outlined">shopping_bag</span>
            Orders
          </button>

          <button className={`admin-nav-item ${activeSection === 'users' ? 'active' : ''}`}
            onClick={() => setActiveSection('users')}
            >
            <span className="material-symbols-outlined">group</span>
            Users
          </button>
        </nav>

        <button className="admin-logout">
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
      </aside>

      <main className="admin-main">
        {activeSection === 'products' && (
          <div className="admin-content-card">
            <div className="admin-content-heading">
              <div>
                <p className="admin-tag">PRODUCT MANAGEMENT</p>
                <h1>Products</h1>
              </div>

              <button className="admin-view-btn" onClick={() => setActiveSection('add-product')}>
                + Add Product
              </button>
            </div>
            <div className="admin-product-cards">
              <div className="admin-stat-card" onClick={() => setActiveSection('products')}
                style={{ cursor: 'pointer' }}
                >
                <span className="material-symbols-outlined">inventory_2</span>
                <p>Total Products</p>
                <h2>{products.length}</h2>
              </div>

              <div className="admin-stat-card">
                <span className="material-symbols-outlined">check_circle</span>
                <p>Active Products</p>
                <h2>{products.filter((product) => product.is_active).length}</h2>
              </div>

              <div className="admin-stat-card">
                <span className="material-symbols-outlined">warning</span>
                <p>Low Stock</p>
                <h2>{products.filter((product) => product.stock > 0 && product.stock <= 5).length}</h2>
              </div>

              <div className="admin-stat-card">
                <span className="material-symbols-outlined">remove_shopping_cart</span>
                <p>Out of Stock</p>
                <h2>{products.filter((product) => product.stock === 0).length}</h2>
              </div>
            </div>
            <div className="admin-product-filters">
              <input type="text" placeholder="Search products by name, category or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} >
                <option>All Categories</option>
                <option>Swings</option>
                <option>Sleeping Swings</option>
                <option>Mosquito Beds</option>
                <option>Sleeping Bags</option>
                <option>Baby Playgyms</option>
                <option>Baby Walkers</option>
                <option>Baby Tricycles</option>
                <option>Ride-on Toys</option>
                <option>Baby Bullets</option>
              </select>

              <select value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                >
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>Out of Stock</option>
              </select>

              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option>Sort By</option>
                <option>Name</option>
                <option>Price</option>
                <option>Stock</option>
              </select>
            </div>
            <div className="admin-product-table">
              <div className="admin-product-table-header">
                <span>Image</span>
                <span>Product</span>
                <span>Category</span>
                <span>Price</span>
                <span>Stock</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              {products
                .filter((product) =>
                  (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.sku.toLowerCase().includes(searchTerm.toLowerCase())) &&
                  (categoryFilter === 'All Categories' ||
                    product.category === categoryFilter) &&
                  (statusFilter === 'All Status' ||
                    (statusFilter === 'Active' && product.is_active) ||
                    (statusFilter === 'Inactive' && !product.is_active) ||
                    (statusFilter === 'Out of Stock' && product.stock === 0))
                )
                .sort((a, b) => {
                  if (sortBy === 'Name') {
                    return a.name.localeCompare(b.name)
                  }

                  if (sortBy === 'Price') {
                    return Number(a.price) - Number(b.price)
                  }

                  if (sortBy === 'Stock') {
                    return a.stock - b.stock
                  }

                  return 0
                })
                .map((product) => (
                <div className="admin-product-row" key={product.id}>
                  <img src={product.images?.[0]} alt={product.name} />
                  <div>
                    <strong>{product.name}</strong>
                    <small>#{product.sku}</small>
                  </div>

                  <span>{product.category}</span>
                  <span>₹{product.sale_price || product.price}</span>
                  <span>{product.stock}</span>
                  <span>{product.is_active ? 'In Stock' : 'Inactive'}</span>

                  <div>
                    <button onClick={() => {
                      setProductForm({
                        name: product.name,
                        category: product.category,
                        price: product.price,
                        sale_price: product.sale_price || '',
                        stock: product.stock,
                        sku: product.sku,
                        description: product.description || '',
                        images: product.images?.[0] || '',
                        age_range: product.age_range || '',
                        features: product.features?.join(', ') || '',
                        is_active: product.is_active
                      })
                      setActiveSection('add-product')
                      setEditingProductId(product.id)
                    }}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteProduct(product.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'orders' && (
          <div className="admin-content-card">
            <div className="admin-content-heading">
              <div>
                <p className="admin-tag">ORDER MANAGEMENT</p>
                <h1>Orders</h1>
              </div>
            </div>

            <div className="admin-order-filters">
              <input
                type="text"
                placeholder="Search orders by ID, name or email..."
                value={orderSearchTerm}
                onChange={(e) => setOrderSearchTerm(e.target.value)}
              />

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
              >
                <option>All Status</option>
                <option>Confirmed</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>

              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <option>All Payments</option>
                <option>Pending</option>
                <option>Paid</option>
              </select>

              <select
                value={orderSortBy}
                onChange={(e) => setOrderSortBy(e.target.value)}
              >
                <option>Sort By</option>
                <option>Newest</option>
                <option>Oldest</option>
                <option>Amount</option>
              </select>
            </div>

            {orders.length === 0 ? (
              <div className="admin-empty-state">
                <span className="material-symbols-outlined">
                  shopping_bag
                </span>
                <h3>No orders yet</h3>
                <p>
                  Customer orders will appear here once they are placed.
                </p>
              </div>
            ) : (
              <div className="admin-orders-list">
                {orders
                  .filter((order) =>
                    (
                      order.id.toString().includes(orderSearchTerm.toLowerCase()) ||
                      order.customer_name.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
                      (order.customer_email || '').toLowerCase().includes(orderSearchTerm.toLowerCase())
                    ) &&
                    (
                      orderStatusFilter === 'All Status' ||
                      order.order_status === orderStatusFilter
                    ) &&
                    (
                      paymentFilter === 'All Payments' ||
                      order.payment_status === paymentFilter
                    )
                  )
                  .sort((a, b) => {
                    if (orderSortBy === 'Newest') {
                      return new Date(b.created_at) - new Date(a.created_at)
                    }

                    if (orderSortBy === 'Oldest') {
                      return new Date(a.created_at) - new Date(b.created_at)
                    }

                    if (orderSortBy === 'Amount') {
                      return Number(b.total_amount) - Number(a.total_amount)
                    }

                    return 0
                  })
                .map((order) => (
                  <div className="admin-order-row" key={order.id}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div>
                      <strong>Order #{order.id}</strong>
                      <small>{order.customer_name}</small>
                    </div>

                    <div>
                      <small>Email</small>
                      <span>{order.customer_email || 'N/A'}</span>
                    </div>

                    <div>
                      <small>Total</small>
                      <span>₹{order.total_amount}</span>
                    </div>

                    <div>
                      <small>Payment</small>
                      <span>{order.payment_status}</span>
                    </div>

                    <div>
                      <small>Status</small>
                      <span>{order.order_status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === 'users' && (
          <div className="admin-content-card">
            <div className="admin-content-heading">
              <div>
                <p className="admin-tag">USER MANAGEMENT</p>
                <h1>Users</h1>
              </div>
            </div>

            <div className="admin-user-filters">
              <input
                type="text"
                placeholder="Search users by name, email or phone..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
              />

              <select
                value={userSortBy}
                onChange={(e) => setUserSortBy(e.target.value)}
              >
                <option>Sort By</option>
                <option>Name</option>
                <option>Newest</option>
                <option>Oldest</option>
              </select>
            </div>

            {users.length === 0 ? (
              <div className="admin-empty-state">
                <span className="material-symbols-outlined">
                  group
                </span>
                <h3>No users yet</h3>
                <p>
                  Registered customers will appear here.
                </p>
              </div>
            ) : (
              <div className="admin-users-list">
                {users
                  .filter((user) =>
                    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                    (user.phone || '').toLowerCase().includes(userSearchTerm.toLowerCase())
                  )
                  .sort((a, b) => {
                    if (userSortBy === 'Name') {
                      return a.name.localeCompare(b.name)
                    }

                    if (userSortBy === 'Newest') {
                      return new Date(b.created_at) - new Date(a.created_at)
                    }

                    if (userSortBy === 'Oldest') {
                      return new Date(a.created_at) - new Date(b.created_at)
                    }

                    return 0
                  })
                .map((user) => (
                  <div className="admin-user-row" key={user.id}>
                    <div>
                      <strong>{user.name}</strong>
                      <small>User #{user.id}</small>
                    </div>

                    <div>
                      <small>Email</small>
                      <span>{user.email}</span>
                    </div>

                    <div>
                      <small>Phone</small>
                      <span>{user.phone || 'N/A'}</span>
                    </div>

                    <div>
                      <small>Address</small>
                      <span>{user.address || 'N/A'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === 'dashboard' && ( <>
          <header className="admin-header">
            <div>
              <p className="admin-tag">ADMIN PANEL</p>
              <h1>Dashboard</h1>
            </div>

            <div className="admin-profile">
              <span className="material-symbols-outlined">account_circle</span>
              <div>
                <strong>Admin</strong>
                <span>Administrator</span>
              </div>
            </div>
          </header>

          <section className="admin-stats">
           <div className="admin-stat-card" onClick={() => setActiveSection('products')}
              style={{ cursor: 'pointer' }}
              >
              <span className="material-symbols-outlined">inventory_2</span>
              <p>Total Products</p>
              <h2>{products.length}</h2>
            </div>

            <div className="admin-stat-card" onClick={() => setActiveSection('users')}
                style={{ cursor: 'pointer' }}
              >
                <span className="material-symbols-outlined">group</span>
                <p>Total Users</p>
                <h2>{users.length}</h2>
            </div>

            <div className="admin-stat-card" onClick={() => setActiveSection('orders')}
              style={{ cursor: 'pointer' }}
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              <p>Total Orders</p>
              <h2>{orders.length}</h2>
            </div>

            <div className="admin-stat-card">
              <span className="material-symbols-outlined">payments</span>
              <p>Total Revenue</p>
              <h2> ₹{orders.reduce(
                  (total, order) => total + Number(order.total_amount),
                  0
                ).toLocaleString('en-IN')}
              </h2>
            </div>
            <div className="admin-stat-card">
              <span className="material-symbols-outlined">pending</span>
              <p>Pending Payment</p>
              <h2>
                ₹{orders
                  .filter((order) => order.payment_status === 'Pending')
                  .reduce(
                    (total, order) => total + Number(order.total_amount),
                    0
                  )
                  .toLocaleString('en-IN')}
              </h2>
            </div>
            <div className="admin-stat-card" onClick={() => setActiveSection('orders')}
                style={{ cursor: 'pointer' }}
              >
              <span className="material-symbols-outlined">pending_actions</span>
              <p>Pending Orders</p>
              <h2>
                {orders.filter(
                  (order) =>
                    order.order_status !== 'Shipped' &&
                    order.order_status !== 'Delivered' &&
                    order.order_status !== 'Cancelled'
                ).length}
              </h2>
            </div>
          </section>
          </>
        )}

        {selectedOrder && (
          <div className="admin-order-modal-overlay">
            <div className="admin-order-modal">
              <div className="admin-order-modal-header">
                <div>
                  <p className="admin-tag">ORDER DETAILS</p>
                  <h2>Order #{selectedOrder.id}</h2>
                </div>

                <button
                  className="admin-order-modal-close"
                  onClick={() => setSelectedOrder(null)}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="admin-order-details">
                <div>
                  <small>Customer Name</small>
                  <strong>{selectedOrder.customer_name}</strong>
                </div>

                <div>
                  <small>Email</small>
                  <strong>{selectedOrder.customer_email || 'N/A'}</strong>
                </div>

                <div>
                  <small>Phone</small>
                  <strong>{selectedOrder.customer_phone || 'N/A'}</strong>
                </div>

                <div>
                  <small>Total Amount</small>
                  <strong>₹{selectedOrder.total_amount}</strong>
                </div>

                <div>
                  <small>Payment Status</small>
                  <strong>{selectedOrder.payment_status}</strong>
                </div>

                <div>
                  <small>Order Status</small>
                  <select
                    value={selectedOrder.order_status}
                    onChange={(e) => {
                      setSelectedOrder({
                        ...selectedOrder,
                        order_status: e.target.value
                      })
                    }}
                    className="admin-order-status-select"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="admin-order-address">
                  <small>Shipping Address</small>
                  <strong>{selectedOrder.shipping_address || 'N/A'}</strong>
                </div>
              </div>

              <div className="admin-order-modal-products">
                <h3>Ordered Products</h3>

                {selectedOrder.items?.map((item) => (
                  <div className="admin-order-modal-item" key={item.id}>
                    <div>
                      <strong>{item.product_name}</strong>
                      <small>Quantity: {item.quantity}</small>
                    </div>

                    <span>
                      ₹{item.price} × {item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="admin-order-modal-footer">
                <strong>Total: ₹{selectedOrder.total_amount}</strong>

                <button className="admin-btn-secondary" onClick={async () => {
                      await handleUpdateOrderStatus(
                        selectedOrder.id,
                        selectedOrder.order_status
                      )

                      setSelectedOrder(null)
                    }}
                  >
                    Save
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'add-product' && (
          <div className="admin-content-card">

            <div className="admin-content-heading">
              <div>
                <p className="admin-tag">PRODUCT MANAGEMENT</p>
                <h1>{editingProductId ? 'Edit Product' : 'Add Product'}</h1>
                <p>Add a new product to your Cozy & Cuddles store</p>
              </div>
            </div>

            <form className="admin-product-form" onSubmit={handleAddProduct} >
              <div className="admin-form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      name: e.target.value
                    })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label>Category</label>
                <select value={productForm.category} onChange={(e) =>
                  setProductForm({
                    ...productForm, category: e.target.value
                    })
                  }
                  >
                  <option value="">Select category</option>
                  <option>Swings</option>
                  <option>Sleeping Swings</option>
                  <option>Mosquito Beds</option>
                  <option>Sleeping Bags</option>
                  <option>Baby Playgyms</option>
                  <option>Baby Walkers</option>
                  <option>Baby Tricycles</option>
                  <option>Ride-on Toys</option>
                  <option>Baby Bullets</option>
                </select>
              </div>

              <div className="admin-form-row">

                <div className="admin-form-group">
                  <label>Price</label>
                  <input type="number" placeholder="Enter price" value={productForm.price}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        price: e.target.value
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <label>Sale Price</label>
                  <input type="number" placeholder="Enter sale price" value={productForm.sale_price}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        sale_price: e.target.value
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <label>Stock</label>
                  <input type="number" placeholder="Enter stock" value={productForm.stock}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        stock: e.target.value
                      })
                    }
                  />
                </div>

              </div>

              <div className="admin-form-group">
                <label>SKU</label>
                <input type="text" placeholder="Enter product SKU" value={productForm.sku}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      sku: e.target.value
                    })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label>Product Status</label>
                <select
                  value={productForm.is_active ? 'true' : 'false'}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      is_active: e.target.value === 'true'
                    })
                  }
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label>Description</label>
                <textarea placeholder="Enter product description" rows="5" value={productForm.description}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      description: e.target.value
                    })
                  }
                ></textarea>
              </div>

              <div className="admin-form-group">
                <label>Product Image</label>
                <input type="text" placeholder="Enter product image path" value={productForm.images}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      images: e.target.value
                    })
                  }
                />
              </div>

              <div className="admin-form-row">

                <div className="admin-form-group">
                  <label>Age Range</label>
                  <input type="text" placeholder="e.g. 0-3 Years" value={productForm.age_range}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        age_range: e.target.value
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <label>Features</label>
                  <input type="text" placeholder="e.g. Soft, Safe, Comfortable" value={productForm.features}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        features: e.target.value
                      })
                    }
                  />
                </div>

              </div>
              <button type="submit" className="admin-view-btn">
                {editingProductId ? 'Update Product' : 'Add Product'}
              </button>
            </form>

          </div>
        )}

        {deleteProductId && (
          <div className="delete-modal-overlay">
            <div className="delete-modal">
              <h3>Delete Product?</h3>
              <p>Are you sure you want to delete this product?</p>

              <div className="delete-modal-actions">
                <button onClick={() => setDeleteProductId(null)}>
                  Cancel
                </button>

                <button onClick={confirmDeleteProduct}>
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {showSuccess && (
          <div className="admin-success-toast">
            Product added successfully!
          </div>
        )}

      </main>
    </div>
  )
}

export default AdminDashboard