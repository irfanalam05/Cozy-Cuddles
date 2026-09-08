import { useRef } from 'react'

function CircleStrip({ items, onItemClick }) {
  const scrollRef = useRef(null)

  const scrollBy = (dir) => {
    const el = scrollRef.current
    if (!el) return
    const item = el.querySelector('.circle-item')
    const step = item ? item.offsetWidth + 20 : 240
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  return (
    <div className="circle-strip-carousel">
      <button
        type="button"
        className="circle-arrow circle-arrow--prev"
        aria-label="Previous"
        onClick={() => scrollBy(-1)}
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>

      <div className="circle-strip-track" ref={scrollRef}>
        {items.map((item) => {
          const Tag = onItemClick ? 'button' : 'a'
          return (
            <Tag
              key={item.id}
              href={onItemClick ? undefined : '#categories'}
              type={onItemClick ? 'button' : undefined}
              className="circle-item"
              onClick={onItemClick ? () => onItemClick(item) : undefined}
            >
              <div className="circle-item-pic">
                <img src={item.image} alt={item.name} />
              </div>
              <span className="circle-item-name">{item.name}</span>
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
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </div>
  )
}

export default CircleStrip
