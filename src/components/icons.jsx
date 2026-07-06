export function StepIcon({ name, className = 'step-icon' }) {
  switch (name) {
    case 'camera':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="2.5" y="6" width="19" height="13" rx="3" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="12" cy="12.5" r="3.2" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="12" cy="12.5" r="1" fill="currentColor" />
          <path d="M7 6V5.2A1.2 1.2 0 0 1 8.2 4h1.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      )
    case 'shield':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 3l7 2.5v5.5c0 4.6-3 8-7 9.5-4-1.5-7-4.9-7-9.5V5.5L12 3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        </svg>
      )
    case 'sensor':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="6" y="11" width="12" height="8" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="12" cy="15" r="1.4" fill="currentColor" />
          <path d="M8 8c2.2-2.2 5.8-2.2 8 0M5.5 5.5c3.6-3.6 9.4-3.6 13 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      )
    case 'grid':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {[5, 12, 19].map((cy) =>
            [5, 12, 19].map((cx) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.7" fill="currentColor" />
            ))
          )}
        </svg>
      )
    default:
      return null
  }
}

export function Chevron({ open }) {
  return (
    <svg
      className={`chevron ${open ? 'chevron--up' : ''}`}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
