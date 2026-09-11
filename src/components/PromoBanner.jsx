import { categoryPath } from '../router'

function PromoBanner() {
  const hotspots = [
    { label: 'Swings', link: categoryPath('Swings') },
    { label: 'Baby Playgyms', link: categoryPath('Baby Playgyms') },
    { label: 'Mosquito Beds', link: categoryPath('Mosquito Beds') },
    { label: 'Sleeping Bags', link: categoryPath('Sleeping Bags') },
    { label: 'Sleeping Swings', link: categoryPath('Sleeping Swings') },
    { label: 'Ride On Toys', link: categoryPath('Ride On Toys') },
    { label: 'Baby Bullets', link: categoryPath('Baby Bullets') },
    { label: 'Baby Tricycle', link: categoryPath('Baby Tricycle') },
    { label: 'Baby Walker', link: categoryPath('Baby Walker') },
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
          href={h.link}
          className="promo-hotspot"
          aria-label={h.label}
          style={{
            left: `${(i * 2 + 1) * 6.25}%`,
          }}
          onClick={() => {
            window.scrollTo(0, 75)
          }}
        />
      ))}
    </section>
  )
}

export default PromoBanner