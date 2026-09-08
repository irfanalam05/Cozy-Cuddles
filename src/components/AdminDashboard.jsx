function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span>Cozy</span> & Cuddles
        </div>

        <nav className="admin-nav">
          <button className="admin-nav-item active">
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </button>

          <button className="admin-nav-item">
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
            <h2>48</h2>
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
      </main>
    </div>
  )
}

export default AdminDashboard