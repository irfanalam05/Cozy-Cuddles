import { useState } from 'react'
import { ChevronLeft, ChevronRight,Quote } from 'lucide-react'

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

  const [currentPage, setCurrentPage] = useState(0)
  const reviewsPerPage = window.innerWidth <= 600 ? 1 : 3
  const totalPages = Math.ceil(reviews.length / reviewsPerPage)

  const startIndex = currentPage * reviewsPerPage
  const visibleReviews = reviews.slice(
    startIndex,
    startIndex + reviewsPerPage
  )

  const nextReviews = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const previousReviews = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  return (
    <section id="reviews" className="reviews-section">
      <div className="reviews-heading">
        <p className="section-tag">TESTIMONIALS</p>
        <h2>What parents are saying.</h2>
        <span>Real reviews from real families who love Cozy & Cuddles.</span>
      </div>

      <div className="reviews-slider">

        <button
          className="reviews-arrow reviews-arrow-left"
          onClick={previousReviews}
          aria-label="Previous reviews"
        >
          <ChevronLeft size={22} strokeWidth={2} />
        </button>

        <div className="reviews-grid">
          {visibleReviews.map((review) => (
            <article className="review-card" key={review.id}>
              <div className="review-stars">
                {'★'.repeat(review.rating)}
                {'☆'.repeat(5 - review.rating)}
              </div>
              
              <div className="review-quote-icon">
                <Quote size={24} strokeWidth={1.8} />
              </div>
              <p className="review-text">
                &ldquo;{review.text}&rdquo;
              </p>

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

        <button
          className="reviews-arrow reviews-arrow-right"
          onClick={nextReviews}
          aria-label="Next reviews"
        >
          <ChevronRight size={22} strokeWidth={2} />
        </button>

      </div>

      <div className="reviews-dots">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            className={`reviews-dot ${
              currentPage === index ? 'active' : ''
            }`}
            onClick={() => setCurrentPage(index)}
            aria-label={`Go to review page ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default Reviews