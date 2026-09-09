import { useRef } from 'react'

function CircleStrip({ items, onItemClick }) {
  const trackRef = useRef(null)

  const scrollBy = (dir) => {
    const track = trackRef.current
    if (!track) return

    const item = track.querySelector('.circle-item')
    const gap = 20
    const step = item ? item.offsetWidth + gap : 300

    track.scrollBy({
      left: dir * step,
      behavior: 'smooth',
    })
  }

  return (
    <div className="circle-strip-carousel">
      <button
        type="button"
        className="circle-arrow circle-arrow--prev"
        aria-label="Previous"
        onClick={() => scrollBy(-1)}
      >
        <span className="material-symbols-outlined">
          chevron_left
        </span>
      </button>

      <div className="circle-strip-track" ref={trackRef}>
        {items.map((item) => {
          const Tag = onItemClick ? 'button' : 'a'

          return (
            <Tag
              key={item.id}
              href={onItemClick ? undefined : '#categories'}
              type={onItemClick ? 'button' : undefined}
              className="circle-item"
              onClick={
                onItemClick
                  ? () => onItemClick(item)
                  : undefined
              }
            >
              <div className="circle-item-pic">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                />
              </div>

              <span className="circle-item-name">
                {item.name}
              </span>
            </Tag>
          )
        })}
      </div>

      <button
        type="button"
        className="circle-arrow circle-arrow--next"
        aria-label="Next"
        onClick={() => scrollBy(1)}
      >
        <span className="material-symbols-outlined">
          chevron_right
        </span>
      </button>
    </div>
  )
}

export default CircleStrip