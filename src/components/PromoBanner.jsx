import { categoryPath } from '../router'

function PromoBanner() {
  const hotspots = [
    { label: 'Sleeping Bags' },
    { label: 'Baby Tricycle' },
    { label: 'Baby Bullets' },
    { label: 'Baby Walker' },
    { label: 'Mosquito Beds' },
    { label: 'Sleeping Swings' },
    { label: 'Ride On Toys' },
    { label: 'Swings' },
  ]

  return (
    <section className="promo-banner">
      <img
        className="promo-banner-img"
        src="/banners/banner.png"
        alt="Cozy & Cuddles products banner"
      />
      {hotspots.map((h, i) => (
        <a
          key={h.label}
          href={categoryPath(h.label)}
          className="promo-hotspot"
          aria-label={h.label}
          onClick={(e) => {
            e.preventDefault()
            window.location.hash = categoryPath(h.label)
            window.scrollTo({ top: 0 })
          }}
          style={{ left: `${(i * 100) / (hotspots.length - 1)}%` }}
        ></a>
      ))}
    </section>
  )
}

export default PromoBanner
