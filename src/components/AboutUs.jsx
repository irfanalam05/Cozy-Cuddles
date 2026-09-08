import { useEffect, useState } from 'react'

function useCountUp(target, duration = 1600) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let raf
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(eased * target))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return value
}

function Stat({ value, suffix, label }) {
  const count = useCountUp(value)
  return (
    <div className="about-stat">
      <span className="about-stat-number">
        {count}
        {suffix}
      </span>
      <span className="about-stat-label">{label}</span>
    </div>
  )
}

function AboutUs() {
  const stats = [
    { value: 500, suffix: '+', label: 'Happy Families' },
    { value: 9, suffix: '', label: 'Product Categories' },
    { value: 100, suffix: '%', label: 'Quality Assured' },
  ]

  return (
    <section id="about" className="about-section bg-blue">
      <div className="about-container">
        <div className="about-image">
          <img src="/logo/baby-products.png" alt="Cozy & Cuddles products" />
          <div className="about-image-accent"></div>
        </div>

        <div className="about-content">
          <div className="about-heading">
            <img src="/logo/blue-label.png" alt="" className="about-heading-bg" />
            <h2>About Us</h2>
          </div>
          <p className="about-text">
            Cozy & Cuddles was born from a simple belief — every little one
            deserves warmth, safety, and joy. We carefully design and curate
            baby products that bring comfort to your home and smiles to your
            family.
          </p>
          <p className="about-text">
            From cozy sleeping bags to playful ride-ons, every product is
            chosen with care, tested for quality, and made to last through
            countless cuddly moments.
          </p>

          <div className="about-stats">
            {stats.map((stat) => (
              <Stat key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutUs