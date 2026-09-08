function Reviews() {
  const reviews = [
    {
      id: 1,
      name: 'Priya Sharma',
      rating: 5,
      text: 'The mosquito bed is amazing! My baby sleeps so peacefully now. Great quality and easy to set up.',
      product: 'Mosquito Bed',
    },
    {
      id: 2,
      name: 'Anjali Mehta',
      rating: 5,
      text: 'Bought the baby playgym and my daughter absolutely loves it. The colors and materials are top notch.',
      product: 'Baby Playgym',
    },
    {
      id: 3,
      name: 'Riya Patel',
      rating: 5,
      text: 'The sleeping swing is a lifesaver. Comfortable, safe, and my baby drifts off in minutes every time.',
      product: 'Sleeping Swing',
    },
    {
      id: 4,
      name: 'Neha Gupta',
      rating: 4,
      text: 'Love the tricycle! Sturdy build and my son rides it everywhere. Very happy with the purchase.',
      product: 'Baby Tricycle',
    },
    {
      id: 5,
      name: 'Meera Joshi',
      rating: 5,
      text: 'Soft, cozy sleeping bags that keep my little one warm all night. The quality is worth every penny.',
      product: 'Sleeping Bag',
    },
    {
      id: 6,
      name: 'Kavya Singh',
      rating: 5,
      text: 'The baby walker is so well designed. Safe, stable, and my baby loves cruising around the house in it.',
      product: 'Baby Walker',
    },
  ]

  return (
    <section id="reviews" className="reviews-section">
      <div className="reviews-heading">
        <p className="section-tag">TESTIMONIALS</p>
        <h2>What parents are saying.</h2>
        <span>Real reviews from real families who love Cozy & Cuddles.</span>
      </div>

      <div className="reviews-grid">
        {reviews.map((review) => (
          <article className="review-card" key={review.id}>
            <div className="review-stars">
              {'★'.repeat(review.rating)}
              {'☆'.repeat(5 - review.rating)}
            </div>
            <p className="review-text">&ldquo;{review.text}&rdquo;</p>
            <div className="review-author">
              <div className="review-avatar">
                {review.name.charAt(0)}
              </div>
              <div className="review-info">
                <strong>{review.name}</strong>
                <span>{review.product}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Reviews
