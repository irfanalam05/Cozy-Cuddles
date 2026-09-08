import ProductCard from './ProductCard'
import { categoryPath, navigate } from '../router'
import { CrawlKid } from './Decor'

function CategoryPage({ category }) {
  if (!category) {
    return (
      <section className="category-page">
        <div className="category-page-heading">
          <h2>Category not found</h2>
          <p>The category you are looking for doesn't exist.</p>
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
        </div>
      </section>
    )
  }

  const related = [...category.products]

  return (
    <section className="category-page">
      <div className="category-hero">
        <div className="category-hero-info">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Back to Categories
          </button>
          <p className="section-tag">EXPLORE</p>
          <h1>{category.name}</h1>
          <p className="category-hero-desc">{category.description}</p>
        </div>
        {/* <div className="category-hero-img">
          <div className="hero-image-pink"></div>
          <img src={category.image} alt={category.name} />
        </div> */}
      </div>

      <CrawlKid style={{ top: '10px', right: '6%' }} size={60} color="#C6E0DA" flip />

      <div className="category-options-grid">
        {related.map((product) => (
          <ProductCard key={product.name} product={product} />
        ))}
      </div>

      <div className="category-cta">
        <h2>Like what you see?</h2>
        <p>Explore all our categories and find the perfect pick for your little one.</p>
        <button className="shop-btn" onClick={() => navigate('/')}>
          Explore All Categories
        </button>
      </div>
    </section>
  )
}

export default CategoryPage
