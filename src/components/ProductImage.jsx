import { PRODUCT_PHOTOS } from '../assets'

const P = '#3a3f47'
const G = '#c8ccd4'
const A = '#4e2fd2'

function Frame({ children }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {children}
    </svg>
  )
}

const ART = {
  motion: (
    <Frame>
      <rect x="20" y="16" width="24" height="24" rx="6" fill="#f4f5f7" stroke={P} strokeWidth="1.5" />
      <circle cx="32" cy="28" r="6" fill="#dfe2e8" stroke={P} strokeWidth="1.3" />
      <path d="M32 22v12M26 28h12" stroke={P} strokeWidth="1.2" opacity="0.5" />
      <rect x="28" y="42" width="8" height="6" rx="2" fill="#e2e5ea" />
    </Frame>
  ),
  hub: (
    <Frame>
      <rect x="12" y="30" width="40" height="12" rx="6" fill="#f4f5f7" stroke={P} strokeWidth="1.5" />
      <circle cx="20" cy="36" r="2.2" fill={A} />
      <path d="M30 30c4-8 12-8 16 0" stroke={G} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M33 30c2.4-5 8-5 10 0" stroke={A} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
    </Frame>
  ),
  entry: (
    <Frame>
      <rect x="18" y="18" width="12" height="28" rx="3" fill="#f4f5f7" stroke={P} strokeWidth="1.5" />
      <rect x="34" y="22" width="12" height="20" rx="3" fill="#eceef2" stroke={P} strokeWidth="1.5" />
      <circle cx="27" cy="32" r="1.6" fill={P} />
    </Frame>
  ),
  climate: (
    <Frame>
      <rect x="22" y="14" width="20" height="20" rx="5" fill="#f4f5f7" stroke={P} strokeWidth="1.5" />
      <path d="M30 20h4M30 24h4M30 28h4" stroke={P} strokeWidth="1.6" strokeLinecap="round" />
      <rect x="28" y="36" width="8" height="12" rx="4" fill="#e2e5ea" />
    </Frame>
  ),
  solar: (
    <Frame>
      <rect x="14" y="18" width="36" height="22" rx="2" fill="#1f2a44" transform="skewX(-6)" />
      <path d="M22 18v22M32 18v22M42 18v22M14 29h36" stroke="#3a4a74" strokeWidth="1.2" transform="skewX(-6)" />
      <rect x="30" y="40" width="4" height="8" fill={G} />
    </Frame>
  ),
  chime: (
    <Frame>
      <path d="M32 14c6 0 10 4 10 11v6l3 4H19l3-4v-6c0-7 4-11 10-11z" fill="#f4f5f7" stroke={P} strokeWidth="1.5" />
      <path d="M28 39a4 4 0 0 0 8 0" stroke={P} strokeWidth="1.5" fill="none" />
      <circle cx="32" cy="12" r="2" fill={A} />
    </Frame>
  ),
}

export default function ProductImage({ image, alt = '', className = 'product-img' }) {
  const photo = PRODUCT_PHOTOS[image]
  if (photo) {
    return (
      <div className={className}>
        <img src={photo} alt={alt} loading="lazy" />
      </div>
    )
  }
  return <div className={className}>{ART[image] ?? null}</div>
}
