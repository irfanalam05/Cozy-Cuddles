import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ResponsiveContainer, AreaChart,Area, CartesianGrid, XAxis, YAxis,Tooltip} from 'recharts'
import { categories } from '../data/categories'
function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])

  const [dbCategories, setDbCategories] = useState([])
  const [dbProductTypes, setDbProductTypes] = useState([])

  const [inventory, setInventory] = useState([])
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false)
  const [selectedInventoryItem, setSelectedInventoryItem] = useState(null)
  const [inventoryAction, setInventoryAction] = useState('add')
  const [inventoryQuantity, setInventoryQuantity] = useState('')
  const [inventoryNote, setInventoryNote] = useState('')
  const [inventoryLogs, setInventoryLogs] = useState([])

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

const [revenuePeriod, setRevenuePeriod] = useState('Monthly')
const [revenueYear, setRevenueYear] = useState(new Date().getFullYear())

  const [showSuccess, setShowSuccess] = useState(false)
  const [editingProductId, setEditingProductId] = useState(null)
  const [deleteProductId, setDeleteProductId] = useState(null)

  const [categoryManagementMode, setCategoryManagementMode] = useState('category')
  const [newCategoryForm, setNewCategoryForm] = useState({
    name: '',
    code: '',
    folder_name: ''
  })

  const [newProductTypeForm, setNewProductTypeForm] = useState({
    category_id: '',
    name: '',
    code: '',
    folder_name: ''
  })

  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    product_type: '',
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

  const [existingImages, setExistingImages] = useState([])

  const revenueYears = [
    ...new Set(
      orders.map((order) => new Date(order.created_at).getFullYear())
    )
  ].sort((a, b) => b - a)

  const revenueChartData =
    revenuePeriod === 'Monthly'
      ? Array.from({ length: 12 }, (_, index) => ({
          label: new Date(0, index).toLocaleString('en-US', {
            month: 'short'
          }),
          revenue: orders
            .filter((order) => {
              const date = new Date(order.created_at)

              return (
                date.getFullYear() === Number(revenueYear) &&
                date.getMonth() === index
              )
            })
            .reduce(
              (sum, order) => sum + Number(order.total_amount),
              0
            )
        }))
      : revenuePeriod === 'Quarterly'
      ? [1, 2, 3, 4].map((quarter) => ({
          label: `Q${quarter}`,
          revenue: orders
            .filter((order) => {
              const date = new Date(order.created_at)
              const orderQuarter = Math.floor(date.getMonth() / 3) + 1

              return (
                date.getFullYear() === Number(revenueYear) &&
                orderQuarter === quarter
              )
            })
            .reduce(
              (sum, order) => sum + Number(order.total_amount),
              0
            )
        }))
      : revenueYears.map((year) => ({
          label: year.toString(),
          revenue: orders
            .filter(
              (order) =>
                new Date(order.created_at).getFullYear() === Number(year)
            )
            .reduce(
              (sum, order) => sum + Number(order.total_amount),
              0
            )
      }))

  const handleAddProduct = async (e) => {
    e.preventDefault()
    try {
      const url = editingProductId
        ? `http://localhost:5000/api/products/${editingProductId}?category=${encodeURIComponent(productForm.category)}&product_type=${encodeURIComponent(productForm.product_type)}`
        : `http://localhost:5000/api/products?category=${encodeURIComponent(productForm.category)}&product_type=${encodeURIComponent(productForm.product_type)}`

      const method = editingProductId ? 'PUT' : 'POST'

      const formData = new FormData()
      formData.append('name', productForm.name)
      formData.append('category', productForm.category)
      formData.append('product_type', productForm.product_type)
      formData.append('price', productForm.price)
      formData.append('sale_price', productForm.sale_price)
      formData.append('stock', productForm.stock)
      formData.append('sku', productForm.sku)
      formData.append('description', productForm.description)
      formData.append('age_range', productForm.age_range)
      formData.append(
        'features',
        productForm.features
          ? productForm.features.split(',').map((f) => f.trim()).join(',')
          : ''
      )
      formData.append('is_active', productForm.is_active)
      formData.append('is_bestseller', false)
      formData.append('is_new', true)

      formData.append(
        'existing_images',
        JSON.stringify(existingImages)
      )

      if (productForm.images && productForm.images.length > 0) {
        productForm.images.forEach((image) => {
          formData.append('images', image)
        })
      }

      const response = await fetch(url, {
        method,
        headers: {
          'X-Product-Category': productForm.category,
          'X-Product-Type': productForm.product_type
        },
        body: formData,
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
      alert(error.message || 'Product save failed')
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

  const handleUpdateInventoryStock = async () => {
    if (!selectedInventoryItem) return

    if (inventoryQuantity === '') {
      alert('Please enter a quantity')
      return
    }

    const quantity = Number(inventoryQuantity)

    if (!Number.isInteger(quantity) || quantity < 0) {
      alert('Please enter a valid quantity')
      return
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/inventory/${selectedInventoryItem.id}/stock`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: inventoryAction,
            quantity,
            note: inventoryNote
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update stock')
      }

      setInventory((prevInventory) =>
        prevInventory.map((item) =>
          item.id === selectedInventoryItem.id
            ? { ...item, stock: data.stock }
            : item
        )
      )

      setSelectedInventoryItem((prev) => ({
        ...prev,
        stock: data.stock
      }))

      setInventoryQuantity('')
      setInventoryNote('')
      setInventoryModalOpen(false)

      alert('Stock updated successfully')
    } catch (error) {
      console.error('Inventory update error:', error)
      alert(error.message || 'Failed to update stock')
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
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/api/categories'
        )

        const data = await response.json()

        setDbCategories(data)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    if (!editingProductId || !productForm.category) return

    const fetchProductTypes = async () => {
      const selectedCategory = dbCategories.find(
        (category) => category.name === productForm.category
      )

      if (!selectedCategory) return

      try {
        const response = await fetch(
          `http://localhost:5000/api/categories/${selectedCategory.id}/product-types`
        )

        const data = await response.json()

        setDbProductTypes(data)
      } catch (error) {
        console.error('Failed to fetch product types for edit:', error)
      }
    }

    fetchProductTypes()
  }, [editingProductId, productForm.category, dbCategories])

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

  useEffect(() => {
    fetch('http://localhost:5000/api/inventory')
      .then((response) => response.json())
      .then((data) => {
        setInventory(data.inventory)
        console.log('Inventory:', data.inventory)
      })
      .catch((error) => {
        console.error('Inventory fetch error:', error)
      })
  }, [])

  useEffect(() => {
    fetch('http://localhost:5000/api/inventory/logs')
      .then((response) => response.json())
      .then((data) => {
        setInventoryLogs(data.logs)
        console.log('Inventory Logs:', data.logs)
      })
      .catch((error) => {
        console.error('Inventory logs fetch error:', error)
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

          <button className={`admin-nav-item ${activeSection === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveSection('inventory')}
          >
            <span className="material-symbols-outlined">warehouse</span>
            Inventory
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

        <button className="admin-logout" onClick={() => {
            localStorage.removeItem('adminToken')
            window.location.href = '/admin'
          }}
         >
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

              <button className="admin-view-btn" onClick={() => {
                  setEditingProductId(null)
                  setExistingImages([])

                  setProductForm({
                    name: '',
                    category: '',
                    product_type: '',
                    price: '',
                    sale_price: '',
                    stock: '',
                    sku: '',
                    description: '',
                    images: [],
                    age_range: '',
                    features: '',
                    is_active: true
                  })

                  setActiveSection('add-product')
                }}
              >
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
                  <img src={
                      product.images?.[0]
                        ? `http://localhost:5000${product.images[0]}`
                        : ''
                    }
                    alt={product.name}
                  />
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
                      setExistingImages(product.images || [])
                      setProductForm({
                        name: product.name,
                        category: product.category,
                        product_type: product.product_type || '',
                        price: product.price,
                        sale_price: product.sale_price || '',
                        stock: product.stock,
                        sku: product.sku,
                        description: product.description || '',
                        images: [],
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

        {activeSection === 'inventory' && (
          <div className="admin-content-card">
            <div className="admin-content-heading">
              <div>
                <p className="admin-tag"><h1>INVENTORY MANAGEMENT</h1></p>
                <p>Manage product stock and inventory levels</p>
              </div>
            </div>

            <div className="admin-product-table">
              <div className="admin-product-table-header">
                <span>Product</span>
                <span>SKU</span>
                <span>Current Stock</span>
                <span>Status</span>
                <span>Manage</span>
              </div>

              {inventory.map((item) => (
                <div className="admin-product-row" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                  </div>

                  <span>#{item.sku}</span>

                  <span>{item.stock}</span>

                  <span>
                    {item.stock === 0
                      ? 'Out of Stock'
                      : item.stock <= 5
                      ? 'Low Stock'
                      : 'In Stock'}
                  </span>

                  <div>
                    <button
                      onClick={() => {
                        setSelectedInventoryItem(item)
                        setInventoryAction('add')
                        setInventoryQuantity('')
                        setInventoryNote('')
                        setInventoryModalOpen(true)
                      }}
                    >
                      Manage
                    </button>
                  </div>
                </div>
              ))}
              </div>

              <div className="inventory-history">
                <div className="admin-content-heading">
                  <div>
                    {/* <h1><p className="admin-tag">INVENTORY HISTORY</p></h1> */}
                    <h4><p>Track all stock additions, orders and cancellations</p> </h4>
                  </div>
                </div>

                <div className="admin-product-table">
                  <div className="admin-product-table-header">
                    <span>Product</span>
                    <span>Action</span>
                    <span>Change</span>
                    <span>Previous Stock</span>
                    <span>New Stock</span>
                    <span>Note</span>
                  </div>

                  {inventoryLogs.map((log) => (
                    <div className="admin-product-row" key={log.id}>
                      <div>
                        <strong>{log.product_name}</strong>
                        <small>#{log.sku}</small>
                      </div>

                      <span>{log.change_type}</span>

                      <span>
                        {log.quantity > 0 ? '+' : ''}
                        {log.quantity}
                      </span>

                      <span>{log.previous_stock}</span>

                      <span>{log.new_stock}</span>

                      <span>{log.note || 'N/A'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
        )}

        {inventoryModalOpen && selectedInventoryItem && (
          <div className="inventory-modal-overlay">
            <div className="inventory-modal">
              <div className="inventory-modal-header">
                <div>
                  <p className="admin-tag">INVENTORY MANAGEMENT</p>
                  <h2>{selectedInventoryItem.name}</h2>
                  <p>
                    Current Stock: {selectedInventoryItem.stock}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setInventoryModalOpen(false)}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="inventory-modal-body">
                <div className="inventory-action-buttons">
                  <button
                    type="button"
                    className={inventoryAction === 'add' ? 'active' : ''}
                    onClick={() => setInventoryAction('add')}
                  >
                    Add Stock
                  </button>

                  <button
                    type="button"
                    className={inventoryAction === 'set' ? 'active' : ''}
                    onClick={() => setInventoryAction('set')}
                  >
                    Set Stock
                  </button>
                </div>

                <div className="admin-form-group">
                  <label>
                    {inventoryAction === 'add'
                      ? 'Quantity to Add'
                      : 'New Stock Quantity'}
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={inventoryQuantity}
                    onChange={(e) => setInventoryQuantity(e.target.value)}
                    placeholder={
                      inventoryAction === 'add'
                        ? 'Enter quantity to add'
                        : 'Enter new stock quantity'
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <label>Note</label>

                  <textarea
                    rows="3"
                    value={inventoryNote}
                    onChange={(e) => setInventoryNote(e.target.value)}
                    placeholder="Optional note"
                  />
                </div>
              </div>

              <div className="inventory-modal-footer">
                <button
                  type="button"
                  onClick={() => setInventoryModalOpen(false)}
                >
                  Cancel
                </button>

                <button type="button" onClick={handleUpdateInventoryStock}>
                  Update Stock
                </button>
              </div>
            </div>
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

          <div className="admin-revenue-analytics">
          <div className="admin-revenue-header">
            <div>
              <p className="admin-tag">REVENUE ANALYTICS</p>
              <h2>Revenue Overview</h2>
            </div>

            <div className="admin-revenue-filters">
              <select
                value={revenuePeriod}
                onChange={(e) => setRevenuePeriod(e.target.value)}
              >
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Yearly</option>
              </select>

              <select
                value={revenueYear}
                onChange={(e) => setRevenueYear(e.target.value)}
              >
                {revenueYears.length > 0 ? (
                  revenueYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))
                ) : (
                  <option value={new Date().getFullYear()}>
                    {new Date().getFullYear()}
                  </option>
                )}
              </select>
            </div>
          </div>
            <div className="admin-revenue-chart">
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [
                      `₹${Number(value).toLocaleString('en-IN')}`,
                      'Revenue'
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4A5568"
                    fill="#A3D9C9"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="admin-recent-orders">
            <div className="admin-recent-orders-header">
              <div>
                <p className="admin-tag">ORDER ACTIVITY</p>
                <h2>Recent Orders</h2>
              </div>

              <button
                className="admin-view-btn"
                onClick={() => setActiveSection('orders')}
              >
                View All
              </button>
            </div>

            {orders.filter(
              (order) =>
                order.order_status !== 'Shipped' &&
                order.order_status !== 'Delivered' &&
                order.order_status !== 'Cancelled'
            ).length === 0 ? (
              <div className="admin-recent-empty">
                <span className="material-symbols-outlined">
                  shopping_bag
                </span>
                <p>No active orders</p>
              </div>
            ) : (
              <div className="admin-recent-orders-list">
                {orders
                  .filter(
                    (order) =>
                      order.order_status !== 'Shipped' &&
                      order.order_status !== 'Delivered' &&
                      order.order_status !== 'Cancelled'
                  )
                  .sort(
                    (a, b) =>
                      new Date(b.created_at) - new Date(a.created_at)
                  )
                  .slice(0, 5)
                  .map((order) => (
                    <div
                      className="admin-recent-order-row"
                      key={order.id}
                      onClick={() => {
                        window.scrollTo({
                          top: 0,
                          behavior: 'smooth'
                        })
                        setSelectedOrder(order)
                      }}
                    >
                      <div>
                        <strong>Order #{order.id}</strong>
                        <small>{order.customer_name}</small>
                      </div>

                      <div>
                        <small>Total</small>
                        <span>
                          ₹{Number(order.total_amount).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div>
                        <small>Payment</small>
                        <span
                          className={`admin-status-badge ${
                            order.payment_status === 'Paid' ? 'paid' : 'pending'
                          }`}
                        >
                          {order.payment_status}
                        </span>
                      </div>

                      <div>
                        <small>Status</small>
                        <span
                          className={`admin-status-badge ${
                            order.order_status === 'Shipped'
                              ? 'shipped'
                              : order.order_status === 'Processing'
                              ? 'processing'
                              : 'confirmed'
                          }`}
                        >
                          {order.order_status}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
          </>
        )}

        {selectedOrder && 
        createPortal(
        (
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
          ),
          document.body
        )}

        {activeSection === 'add-product' && (
          <div className="admin-content-card">

            <div className="admin-content-heading">
              <div>
                <p className="admin-tag">PRODUCT MANAGEMENT</p>
                <h1>{editingProductId ? 'Edit Product' : 'Add Product'}</h1>
                <p>Add a new product to your Cozy & Cuddles store</p>
              </div>

              {!editingProductId && (
                <button
                  className="admin-view-btn"
                  type="button"
                  onClick={() => setActiveSection('category-management')}
                >
                  + Add Category / Type
                </button>
              )}
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
                <select value={productForm.category} onChange={async (e) => {
                    const selectedCategory = e.target.value

                      const selectedCategoryData = dbCategories.find(
                        (category) => category.name === selectedCategory
                      )

                      setProductForm({
                        ...productForm,
                        category: selectedCategory,
                        category_code: selectedCategoryData?.code || '',
                        product_type: '',
                        product_type_code: ''
                      })

                      setDbProductTypes([])

                      if (!selectedCategory) return
                    console.log('Selected Category:', selectedCategoryData)

                    if (!selectedCategoryData) return

                    try {
                      const response = await fetch(
                        `http://localhost:5000/api/categories/${selectedCategoryData.id}/product-types`
                      )

                      const data = await response.json()

                      setDbProductTypes(data)
                    } catch (error) {
                      console.error('Failed to fetch product types:', error)
                    }
                  }} >
                  <option value="">Select category</option>

                  {dbCategories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label>Product Type</label>
                <select
                  value={productForm.product_type}
                  onChange={(e) => {
                    const selectedType = dbProductTypes.find(
                      (type) => type.name === e.target.value
                    )

                    const selectedCategory = dbCategories.find(
                      (category) => category.name === productForm.category
                    )

                    const prefix =
                      selectedCategory && selectedType
                        ? `${selectedCategory.code}-${selectedType.code}`
                        : ''

                    const matchingSkus = products
                      .map((product) => product.sku)
                      .filter((sku) => sku?.startsWith(`${prefix}-`))

                    let maxNumber = 0

                    matchingSkus.forEach((sku) => {
                      const match = sku.match(/-(\d+)$/)

                      if (match) {
                        maxNumber = Math.max(maxNumber, Number(match[1]))
                      }
                    })

                    const nextSku = prefix
                      ? `${prefix}-${String(maxNumber + 1).padStart(3, '0')}`
                      : ''

                    setProductForm({
                      ...productForm,
                      product_type: e.target.value,
                      sku: nextSku
                    })
                  }}
                  disabled={!productForm.category || dbProductTypes.length === 0}
                >
                  <option value="">
                    {productForm.category && dbProductTypes.length === 0
                      ? 'Loading product types...'
                      : 'Select product type'}
                  </option>

                  {dbProductTypes.map((productType) => (
                    <option key={productType.id} value={productType.name}>
                      {productType.name}
                    </option>
                  ))}
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
                <input
                  type="text"
                  placeholder="SKU will be generated automatically"
                  value={productForm.sku}
                  readOnly
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
                <label>Product Images</label>

                {existingImages.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <p>Existing Images</p>

                    <div style={{
                      display: 'flex',
                      gap: '10px',
                      flexWrap: 'wrap'
                    }}>
                      {existingImages.map((image, index) => (
                        <div
                          key={`${image}-${index}`}
                          style={{
                            position: 'relative',
                            width: '100px',
                            height: '100px'
                          }}
                        >
                          <img
                            src={`http://localhost:5000${image}`}
                            alt={`Existing product ${index + 1}`}
                            style={{
                              width: '100px',
                              height: '100px',
                              objectFit: 'cover',
                              borderRadius: '8px'
                            }}
                          />

                          <button
                            type="button"
                            onClick={() => {
                              setExistingImages((prevImages) =>
                                prevImages.filter((_, imageIndex) => imageIndex !== index)
                              )
                            }}
                            style={{
                              position: 'absolute',
                              top: '-6px',
                              right: '-6px',
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              border: 'none',
                              background: '#e53e3e',
                              color: '#fff',
                              fontSize: '16px',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              lineHeight: '1'
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  onChange={(e) => {
                    const selectedFiles = Array.from(e.target.files)

                    setProductForm((prev) => ({
                      ...prev,
                      images: [
                        ...(Array.isArray(prev.images) ? prev.images : []),
                        ...selectedFiles
                      ]
                    }))

                    e.target.value = ''
                  }}
                />

                {Array.isArray(productForm.images) && productForm.images.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <p>
                      {productForm.images.length} image
                      {productForm.images.length > 1 ? 's' : ''} selected
                    </p>

                    {productForm.images.map((image, index) => (
                      <div key={`${image.name}-${index}`}>
                        {image.name}
                      </div>
                    ))}
                  </div>
                )}
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

        {activeSection === 'category-management' && (
          <div className="admin-content-card">

            <div className="admin-content-heading">
              <div>
                <p className="admin-tag">CATEGORY MANAGEMENT</p>
                <h1>Add Category</h1>
                <p>Create a new product category</p>
              </div>

              <button className="admin-view-btn" type="button" onClick={() => {
                  setProductForm({
                    name: '',
                    category: '',
                    product_type: '',
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

                  setDbProductTypes([])
                  setActiveSection('add-product')
                }}
                >
                Back to Add Product
              </button>
            </div>

            <div className="admin-product-form">

              <div className="admin-form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. Baby Toys"
                  value={newCategoryForm.name}
                  onChange={(e) =>
                    setNewCategoryForm({
                      ...newCategoryForm,
                      name: e.target.value
                    })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label>Category Code</label>
                <input
                  type="text"
                  placeholder="e.g. BT"
                  value={newCategoryForm.code}
                  onChange={(e) =>
                    setNewCategoryForm({
                      ...newCategoryForm,
                      code: e.target.value.toUpperCase()
                    })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label>Folder Name</label>
                <input
                  type="text"
                  placeholder="e.g. baby-toys"
                  value={newCategoryForm.folder_name}
                  onChange={(e) =>
                    setNewCategoryForm({
                      ...newCategoryForm,
                      folder_name: e.target.value
                    })
                  }
                />
              </div>

              <button
                type="button"
                className="admin-view-btn"
                onClick={async () => {
                  try {
                    const response = await fetch(
                      'http://localhost:5000/api/categories',
                      {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newCategoryForm)
                      }
                    )

                    const data = await response.json()

                    if (!response.ok) {
                      alert(data.message || 'Failed to add category')
                      return
                    }

                    alert('Category added successfully')

                    setNewCategoryForm({
                      name: '',
                      code: '',
                      folder_name: ''
                    })

                    const categoriesResponse = await fetch(
                      'http://localhost:5000/api/categories'
                    )

                    const categoriesData = await categoriesResponse.json()

                    setDbCategories(categoriesData)

                  } catch (error) {
                    console.error('Add category error:', error)
                    alert('Failed to add category')
                  }
                }}
              >
                Add Category
              </button>

            </div>

            <div style={{ marginTop: '50px' }}>
              <div className="admin-content-heading">
                <div>
                  <p className="admin-tag">PRODUCT TYPE MANAGEMENT</p>
                  <h2>Add Product Type</h2>
                  <p>Add a product type under an existing category</p>
                </div>
              </div>

              <div className="admin-product-form">
                <div className="admin-form-group">
                  <label>Select Category</label>

                  <select
                    value={newProductTypeForm.category_id}
                    onChange={(e) =>
                      setNewProductTypeForm({
                        ...newProductTypeForm,
                        category_id: e.target.value
                      })
                    }
                  >
                    <option value="">Select category</option>

                    {dbCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Product Type Name</label>

                  <input
                    type="text"
                    placeholder="e.g. Green Walker"
                    value={newProductTypeForm.name}
                    onChange={(e) =>
                      setNewProductTypeForm({
                        ...newProductTypeForm,
                        name: e.target.value
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <label>Product Type Code</label>

                  <input
                    type="text"
                    placeholder="e.g. GW"
                    value={newProductTypeForm.code}
                    onChange={(e) =>
                      setNewProductTypeForm({
                        ...newProductTypeForm,
                        code: e.target.value.toUpperCase()
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <label>Folder Name</label>

                  <input
                    type="text"
                    placeholder="e.g. green-walker"
                    value={newProductTypeForm.folder_name}
                    onChange={(e) =>
                      setNewProductTypeForm({
                        ...newProductTypeForm,
                        folder_name: e.target.value
                      })
                    }
                  />
                </div>

                <button
                  type="button"
                  className="admin-view-btn"
                  onClick={async () => {
                    try {
                      if (!newProductTypeForm.category_id) {
                        alert('Please select a category')
                        return
                      }

                      const response = await fetch(
                        `http://localhost:5000/api/categories/${newProductTypeForm.category_id}/product-types`,
                        {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({
                            name: newProductTypeForm.name,
                            code: newProductTypeForm.code,
                            folder_name: newProductTypeForm.folder_name
                          })
                        }
                      )

                      const data = await response.json()

                      if (!response.ok) {
                        alert(data.message || 'Failed to add product type')
                        setNewProductTypeForm({
                          category_id: '',
                          name: '',
                          code: '',
                          folder_name: ''
                        })
                        return
                      }

                      alert('Product type added successfully')

                      setNewProductTypeForm({
                        category_id: '',
                        name: '',
                        code: '',
                        folder_name: ''
                      })

                    } catch (error) {
                      console.error('Add product type error:', error)
                      alert('Failed to add product type')
                    }
                  }}
                >
                  Add Product Type
                </button>

              </div>

            </div>
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