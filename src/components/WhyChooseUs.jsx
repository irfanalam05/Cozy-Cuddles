function WhyChooseUs() {
  const features = [
    {
      icon: '♡',
      title: 'Comfort First',
      description: 'Thoughtfully designed for your little ones.',
    },
    {
      icon: '✦',
      title: 'Quality Products',
      description: 'Made with care for everyday comfort and play.',
    },
    {
      icon: '✓',
      title: 'Made for Little Ones',
      description: 'Products selected for happy little moments.',
    },
    {
      icon: '♧',
      title: 'Care & Trust',
      description: 'Because every little one deserves the best.',
    },
  ]

  return (
    <section className="why-section bg-olive">
      <div className="why-heading">
        <p>WHY COZY & CUDDLES</p>
        <h2>Made with care, made for cuddles.</h2>
        <span>
          Everything we choose is centered around comfort, care and little moments.
        </span>
      </div>

      <div className="why-grid">
        {features.map((feature) => (
          <article className="why-card" key={feature.title}>
            <div className="why-icon">{feature.icon}</div>

            <h3>{feature.title}</h3>

            <p>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default WhyChooseUs