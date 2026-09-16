import { useEffect, useState } from 'react'
function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [sortBy, setSortBy] = useState('Sort By')
  const [showSuccess, setShowSuccess] = useState(false)
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
    features: ''
  })

  const handleAddProduct = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
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
          is_active: true,
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

        setActiveSection('products')
      } else {
        alert(data.message || 'Failed to add product')
      }

      console.log('Add Product:', data)
    } catch (error) {
      console.error('Add product error:', error)
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

          <button className="admin-nav-item">
            <span className="material-symbols-outlined">shopping_bag</span>
            Orders
          </button>

          <button className="admin-nav-item">
            <span className="material-symbols-outlined">group</span>
            Users
          </button>

          <button className="admin-nav-item">
            <span className="material-symbols-outlined">favorite</span>
            Wishlist
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
                <p>Add, edit or remove products from your store</p>
              </div>

              <button className="admin-view-btn" onClick={() => setActiveSection('add-product')}>
                + Add Product
              </button>
            </div>
            <div className="admin-stats">
              <div className="admin-stat-card">
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
                    <button>Edit</button>
                    <button>Delete</button>
                  </div>
                </div>
              ))}
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
            <div className="admin-stat-card">
              <span className="material-symbols-outlined">inventory_2</span>
              <p>Total Products</p>
              <h2>{products.length}</h2>
            </div>

            <div className="admin-stat-card">
              <span className="material-symbols-outlined">group</span>
              <p>Total Users</p>
              <h2>126</h2>
            </div>

            <div className="admin-stat-card">
              <span className="material-symbols-outlined">shopping_bag</span>
              <p>Total Orders</p>
              <h2>84</h2>
            </div>

            <div className="admin-stat-card">
              <span className="material-symbols-outlined">payments</span>
              <p>Total Revenue</p>
              <h2>₹42,850</h2>
            </div>
          </section>
          </>
        )}
        {activeSection === 'dashboard' && (
          <>
          <section className="admin-content-card">
            <div className="admin-content-heading">
              <div>
                <p className="admin-tag">STORE OVERVIEW</p>
                <h2>Recent Orders</h2>
              </div>

              <button className="admin-view-btn">
                View All →
              </button>
            </div>

            <div className="admin-empty-state">
              <span className="material-symbols-outlined">
                shopping_bag
              </span>
              <h3>Orders will appear here</h3>
              <p>
                Once customers start placing orders, you'll see
                them here.
              </p>
            </div>
          </section>
          </>
        )}

        {activeSection === 'add-product' && (
          <div className="admin-content-card">

            <div className="admin-content-heading">
              <div>
                <p className="admin-tag">PRODUCT MANAGEMENT</p>
                <h1>Add Product</h1>
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
                Add Product
              </button>
            </form>

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