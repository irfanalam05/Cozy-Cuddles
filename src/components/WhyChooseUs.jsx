import { Heart, Sparkles, ShieldCheck, Baby } from 'lucide-react'

function WhyChooseUs() {
  const features = [
    {
      icon: Heart,
      title: 'Comfort First',
      description: 'Thoughtfully designed for your little ones.',
    },
    {
      icon: Sparkles,
      title: 'Quality Products',
      description: 'Made with care for everyday comfort and play.',
    },
    {
      icon: ShieldCheck,
      title: 'Safe & Durable',
      description: 'Trusted by parents, built for little explorers.',
    },
    {
      icon: Baby,
      title: 'Made for Little Ones',
      description: 'Because every little moment matters.',
    },
  ]

  return (
    <section className="why-section bg-olive">

      <div className="why-decoration why-decoration-left">
        <span className="why-cloud">☁</span>
        <span className="why-heart">♡</span>
        <span className="why-doodle">〰</span>
      </div>

      <div className="why-decoration why-decoration-right">
        <span className="why-star">★</span>
        <span className="why-cloud why-cloud-small">☁</span>
        <span className="why-heart why-heart-small">♡</span>
      </div>

      <div className="why-heading">
        <p>WHY COZY & CUDDLES</p>

        <h2>Made with care, made for cuddles.</h2>

        <span>
          Everything we choose is centered around comfort, care and little
          moments.
        </span>
      </div>

      <div className="why-grid">
        {features.map((feature) => {
          const Icon = feature.icon

          return (
            <div className="why-card-wrap">
              {feature.title === 'Comfort First' && (
                <div className="why-teddy">🧸</div>
              )}

              <article className="why-card" key={feature.title}>
                <div className="why-icon">
                  <Icon size={42} strokeWidth={1.8} />
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>
              </article>
            </div>
          )
        })}
      </div>

    </section>
  )
}

export default WhyChooseUs