export function CrawlKid({ color = '#B5C9D4', size = 90, flip = false, style }) {
  return (
    <svg
      className="crawl-kid"
      width={size}
      height={size}
      viewBox="0 0 120 120"
      style={{ ...style, transform: flip ? 'scaleX(-1)' : undefined }}
    >
      <g>
        {/* body */}
        <rect x="38" y="62" width="44" height="28" rx="14" fill={color} />
        {/* head */}
        <circle cx="84" cy="56" r="18" fill="#B5C9D4" />
        <circle cx="84" cy="56" r="12" fill="#E8D8B8" />
        {/* eyes */}
        <circle cx="79" cy="53" r="2.5" fill="#5c3d2e" />
        <circle cx="89" cy="53" r="2.5" fill="#5c3d2e" />
        <path d="M80 60 q4 3 8 0" stroke="#5c3d2e" strokeWidth="2" fill="none" />
        {/* arms */}
        <rect x="30" y="64" width="16" height="9" rx="4.5" fill={color} transform="rotate(20 38 68)" />
        <rect x="72" y="64" width="16" height="9" rx="4.5" fill={color} transform="rotate(-20 80 68)" />
        {/* legs */}
        <rect x="42" y="86" width="14" height="14" rx="7" fill={color} transform="rotate(12 49 93)" />
        <rect x="62" y="86" width="14" height="14" rx="7" fill={color} transform="rotate(-12 69 93)" />
        {/* hair bow */}
        <circle cx="96" cy="44" r="5" fill="#C6E0DA" />
      </g>
    </svg>
  )
}

export function DecoCorner({ className = '' }) {
  return (
    <div className={`deco-corner ${className}`}>
      <span className="deco-dot"></span>
      <span className="deco-dot"></span>
      <span className="deco-dot"></span>
      <span className="deco-ring"></span>
      <span className="deco-ring"></span>
    </div>
  )
}
