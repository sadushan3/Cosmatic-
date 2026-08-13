import type { Page } from '../types'

interface Props {
  setPage: (p: Page) => void
}

export default function Footer({ setPage }: Props) {
  return (
    <footer style={{ background: '#1C1916', color: '#FAF8F5', paddingTop: 80, paddingBottom: 40 }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pb-16" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="font-display text-3xl tracking-wider mb-1">NAZ</div>
            <div style={{ fontSize: 9, letterSpacing: '0.28em', color: '#C4A882', fontWeight: 600, marginBottom: 16 }}>COSMATICES</div>
            <p style={{ fontSize: 13, color: 'rgba(250,248,245,0.55)', lineHeight: 1.7, maxWidth: 200 }}>
              Beauty, curated for you. Premium skincare and cosmetics from brands you love.
            </p>
            <div className="flex gap-4 mt-6">
              {['instagram', 'facebook', 'tiktok', 'youtube'].map(s => (
                <button key={s} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#FAF8F5', transition: 'background 0.3s ease' }}>
                  <SocialIcon name={s} />
                </button>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 style={{ fontSize: 11, letterSpacing: '0.18em', fontWeight: 600, color: '#C4A882', textTransform: 'uppercase', marginBottom: 20 }}>Shop</h4>
            <ul className="flex flex-col gap-3">
              {['All Products', 'New Arrivals', 'Offers', 'Categories'].map(item => (
                <li key={item}>
                  <button onClick={() => setPage('shop')} style={{ fontSize: 13, color: 'rgba(250,248,245,0.55)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.3s ease', fontFamily: 'inherit' }}>
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands */}
          <div>
            <h4 style={{ fontSize: 11, letterSpacing: '0.18em', fontWeight: 600, color: '#C4A882', textTransform: 'uppercase', marginBottom: 20 }}>Brands</h4>
            <ul className="flex flex-col gap-3">
              {['Dot n Key', 'Reginal Men', 'Palm', 'Flix', 'Mamaearth', 'Derma', 'Deconstruct', 'Foxtale'].map(b => (
                <li key={b}>
                  <button onClick={() => setPage('category')} style={{ fontSize: 13, color: 'rgba(250,248,245,0.55)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.3s ease', fontFamily: 'inherit' }}>
                    {b}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 style={{ fontSize: 11, letterSpacing: '0.18em', fontWeight: 600, color: '#C4A882', textTransform: 'uppercase', marginBottom: 20 }}>Customer Care</h4>
            <ul className="flex flex-col gap-3">
              {['Contact Us', 'Shipping', 'Returns & Exchanges', 'FAQs', 'Privacy Policy', 'Terms & Conditions'].map(item => (
                <li key={item}>
                  <button style={{ fontSize: 13, color: 'rgba(250,248,245,0.55)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.3s ease', fontFamily: 'inherit' }}>
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <p style={{ fontSize: 12, color: 'rgba(250,248,245,0.35)', letterSpacing: '0.06em' }}>
            © 2026 NAZ COSMATICES. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Visa', 'Mastercard', 'UPI', 'COD'].map(p => (
              <span key={p} style={{ fontSize: 11, color: 'rgba(250,248,245,0.3)', letterSpacing: '0.08em', fontWeight: 500 }}>{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({ name }: { name: string }) {
  const size = 14
  if (name === 'instagram') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  )
  if (name === 'facebook') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  )
  if (name === 'youtube') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
    </svg>
  )
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-11 9H8V7h2v4zm4 0h-2V7h2v4z"/>
    </svg>
  )
}
