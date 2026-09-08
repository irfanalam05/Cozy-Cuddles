import { useEffect, useState } from 'react'

function ArrivalCard({ item }) {
  const [isWishlisted, setIsWishlisted] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('wishlist') || '[]')
    return saved.some((w) => w.name === item.name)
  })
  const [added, setAdded] = useState(false)

  const toggleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const saved = JSON.parse(localStorage.getItem('wishlist') || '[]')
    if (isWishlisted) {
      localStorage.setItem('wishlist', JSON.stringify(saved.filter((w) => w.name !== item.name)))
      setIsWishlisted(false)
    } else {
      localStorage.setItem('wishlist', JSON.stringify([...saved, item]))
      setIsWishlisted(true)
    }
  }

  const addToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    if (!cart.some((c) => c.name === item.name)) {
      localStorage.setItem('cart', JSON.stringify([...cart, item]))
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="newarrivals-box">
      <div className="newarrivals-box-image">
        <img src={item.image} alt={item.name} loading="lazy" />
      </div>
      <div className="newarrivals-box-body">
        <h3 className="newarrivals-box-name">{item.name}</h3>
        <p className="newarrivals-box-desc">{item.description}</p>
        <div className="newarrivals-box-actions">
          <button
            type="button"
            className={`newarrivals-wish-btn${isWishlisted ? ' active' : ''}`}
            onClick={toggleWishlist}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <span className="material-symbols-outlined">{isWishlisted ? 'favorite' : 'favorite_border'}</span>
          </button>
          <button type="button" className="newarrivals-cart-btn" onClick={addToCart}>
            {added ? 'Added ✓' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

function NewArrivals() {
  const arrivals = [
    { id: 1, name: 'Peach Playgym', image: '/products/baby-playgyms/big-baby-playgyms/peach playgym.jpg', description: 'Soft, snuggly playtime fun for curious little ones.' },
    { id: 2, name: 'Blue Sleep Swing', image: '/products/sleeping-swings/01.jpeg', description: 'Gentle rocking lulls your baby into a calm sleep.' },
    { id: 3, name: 'Mint Riding Horse', image: '/products/ride-on-toys/mint horse.jpg', description: 'A bouncy ride-on pal for giggles and happy hours.' },
    { id: 4, name: 'Red Mosquito Bed', image: '/products/mosquito-bed/red msq bed.jpg', description: 'Breathable protection for sweet, itch-free naps.' },
    { id: 5, name: 'Pink Swing', image: '/products/swings/mint swing 2.jpg', description: 'Comfy swinging motion that soothes and entertains.' },
    { id: 6, name: 'Yellow Walker', image: '/products/baby-walkers/yellow walker.jpg', description: 'Steady first steps with cheerful, sturdy support.' },
    { id: 7, name: 'Stars Nest', image: '/products/sleeping-bags/black stars nest.jpg', description: 'Cozy cocoon bedding that keeps little ones warm.' },
    { id: 8, name: 'Orange Tricycle', image: '/products/baby-tricycles/orange-black-tri.jpg', description: 'Colorful wheels for exciting first rides outside.' },
    { id: 9, name: 'Blue Bullet', image: '/products/baby-bullets/blue-and-black-bullet.jpg', description: 'Smooth gliding fun that carries endless smiles.' },
  ]

  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % arrivals.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [arrivals.length])

  return (
    <section id="new-arrivals" className="circle-strip-section bg-olive">
      <div className="newarrivals-rect">
        <div className="newarrivals-heading">
          <div className="newarrivals-ribbon-wrap">
            <img src="/logo/ribbon-banner.png" alt="" className="newarrivals-ribbon" />
            <h2>New Arrivals</h2>
          </div>

          <div className="newarrivals-dots">
            {arrivals.map((item, i) => (
              <button
                key={item.id}
                type="button"
                className={`newarrivals-dot${i === index ? ' active' : ''}`}
                onClick={() => setIndex(i)}
                aria-label={item.name}
              />
            ))}
          </div>
        </div>

        <div className="newarrivals-carousel">
          <div className="newarrivals-track" style={{ transform: `translateX(-${index * 100}%)` }}>
            {arrivals.map((item) => (
              <div className="newarrivals-slide" key={item.id}>
                <ArrivalCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewArrivals