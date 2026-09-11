import PromoBanner from './components/PromoBanner'
import WhyChooseUs from './components/WhyChooseUs'
import './App.css'
import Header from './Header'
import Cart from './Cart'
import Categories from './components/Categories'
import AboutUs from './components/AboutUs'
import NewArrivals from './components/NewArrivals'
import FeaturedProducts from './components/FeaturedProducts'
import CategoryPage from './components/CategoryPage'
import Wishlist from './components/Wishlist'
import Footer from './components/Footer'
import { CrawlKid } from './components/Decor'
import Login from './components/Login'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import Reviews from './components/Reviews'
import { useHashRoute } from './router'

const heroBeltItems = [
  'Cozy & Cuddles',
  'Comfort for little ones',
  'Safe & gentle fabrics',
  'Sleep swings',
  'Ride-on toys',
  'Baby walkers',
  'Nursery cuddles',
  'Quality assured',
]

function Home() {
  return (
    <main>
      <section id="home" className="hero-section">
        <div className="hero-deco hero-deco--brown" style={{ top: '18%', left: '6%', width: 26, height: 26 }}></div>
        <div className="hero-deco hero-deco--brown" style={{ top: '30%', left: '42%', width: 16, height: 16 }}></div>
        <div className="hero-deco hero-deco--ring" style={{ top: '15%', right: '8%', width: 60, height: 60 }}></div>
        <div className="hero-deco hero-deco--pink" style={{ bottom: '12%', left: '8%', width: 30, height: 30 }}></div>

        <img src="/logo/hero-bg.png" alt="" className="hero-bg-el" style={{ top: '6%', left: '2%', width: 190, opacity: 0.5 }} />
        <img src="/logo/hero-bg.png" alt="" className="hero-bg-el" style={{ top: '52%', left: '36%', width: 130, opacity: 0.38 }} />
        <img src="/logo/hero-bg.png" alt="" className="hero-bg-el" style={{ top: '8%', right: '4%', width: 150, opacity: 0.42 }} />
        <img src="/logo/hero-bg.png" alt="" className="hero-bg-el" style={{ bottom: '6%', right: '30%', width: 110, opacity: 0.4 }} />

        <CrawlKid style={{ bottom: '12%', left: '12%' }} />
        <CrawlKid style={{ bottom: '8%', right: '10%' }} color="#5F778E" flip size={70} />

        <div className="hero-content">
          <p className="hero-tag">COMFORT &bull; CARE &bull; CUDDLES</p>
          <h1 className="hero-title">
            Cozy sleep, <span>happy moments.</span>
          </h1>
          <p className="hero-text">
            Discover cozy and comfortable products made for your little ones.
          </p>

          <div className="hero-belt" aria-hidden="true">
            <div className="hero-belt-track">
              {[...heroBeltItems, ...heroBeltItems].map((item, i) => (
                <span className="hero-belt-item" key={i}>
                  <span className="hero-belt-star">✦</span>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-image">
          <div className="hero-image-pink"></div>
          <div className="hero-deco hero-deco--brown" style={{ top: '-10px', right: '30px', width: 20, height: 20 }}></div>
          <div className="hero-deco hero-deco--ring" style={{ bottom: '40px', left: '0', width: 48, height: 48 }}></div>
          <img src="/logo/toy-img.png" alt="Cozy & Cuddles baby products" />
          
        </div>
      </section>

      <FeaturedProducts />
      <PromoBanner />

<div className="crawl-zone">
        <CrawlKid style={{ top: '8px', left: '8%' }} size={70} color="#C6E0DA" />
        <CrawlKid style={{ top: '12px', right: '10%' }} size={60} color="#B6C48A" flip />
      </div>

      <Categories />
      <NewArrivals />
      <AboutUs />
      <WhyChooseUs />
      <Reviews />
    </main>
  )
}

function App() {
  const route = useHashRoute()

  return (
    <div className="app">
      {window.location.hash !== '#/YWRtaW5sb2dpbg==' && window.location.hash !== '#/YWRtaW5kYXNoYm9hcmQ=' && <Header />}
      {route.page === 'category' ? (
        <CategoryPage category={route.category} />
      ) : window.location.hash === '#wishlist' ? (
        <Wishlist />
      ) : window.location.hash === '#cart' ? (
        <Cart isPage />
      ) : window.location.hash === '#login' ? (
        <Login />
      ) : window.location.hash === '#/YWRtaW5sb2dpbg==' ? (
        <AdminLogin />
      ) : window.location.hash === '#/YWRtaW5kYXNoYm9hcmQ=' ? (
        <AdminDashboard />
      ) : (
        <Home />
      )}
      {window.location.hash !== '#wishlist' && window.location.hash !== '#cart' && <Footer />}
    </div>
  )
}

export default App
