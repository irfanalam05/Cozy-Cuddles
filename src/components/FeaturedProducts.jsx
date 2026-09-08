import CircleStrip from './CircleStrip'

function FeaturedProducts() {
  const featured = [
    { id: 1, name: 'Baby Playgym', image: '/products/baby-playgyms/big-baby-playgyms/01.jpeg' },
    { id: 2, name: 'Baby Tricycle', image: '/products/baby-tricycles/pink-black-tri.jpg' },
    { id: 3, name: 'Sleeping Bag', image: '/products/sleeping-bags/mint baby nest.jpg' },
    { id: 4, name: 'Baby Walker', image: '/products/baby-walkers/pink and grey walker.jpg' },
    { id: 5, name: 'Ride On Toy', image: '/products/ride-on-toys/pink horse.jpg' },
    { id: 6, name: 'Swing', image: '/products/swings/mint swing.jpg' },
  ]

  return (
    <section id="featured" className="circle-strip-section bg-olive-light">
      <div className="featured-rect">
        <div className="featured-title-box">
          <p className="section-tag">OUR FAVORITES</p>
          <h2>Shop our best essentials</h2>
        </div>

        <div className="featured-products">
          <CircleStrip items={featured} />
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts