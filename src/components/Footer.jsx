function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="footer-main">

        <div className="footer-brand">
          <h2 className="footer-brand-title">
            <img src="/logo/logo.png" alt="Cozy & Cuddles logo" className="footer-logo" />
            Cozy <span>&</span> Cuddles
          </h2>

          <p>
            Comfortable, playful and cozy products
            for your little ones.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>

          <a href="#home">Home</a>
          <a href="#categories">Categories</a>
          <a href="#new-arrivals">New Arrivals</a>
          <a href="#featured">Featured</a>
          <a href="#about">About Us</a>
        </div>

        <div className="footer-links">
          <h3>Contact</h3>

          <p>Email: info@cozycuddles.com</p>
          <p>Phone: +91 00000 00000</p>
        </div>

        <div className="footer-links">
          <h3>Explore</h3>

          <a href="#featured">Shop Essentials</a>
          <a href="#categories">All Categories</a>
          <a href="#new-arrivals">New Arrivals</a>
          <a href="#about">Our Story</a>
          <a href="#contact">Contact Us</a>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 Cozy & Cuddles. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer