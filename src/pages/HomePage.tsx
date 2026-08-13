import { useState, useRef, useEffect } from 'react'
import { brands, journalPosts, skincareConcerns } from '../data'
import ProductCard from '../components/ProductCard'
import Footer from '../components/Footer'
import { formatCurrency } from '../lib/currency'
import { useProducts } from '../lib/products'
import type { Product, Page } from '../types'

interface Props {
  onViewProduct: (p: Product) => void
  onViewBrand: (id: string) => void
  onAddToCart: (p: Product) => void
  wishlist: string[]
  onWishlist: (id: string) => void
  setPage: (p: Page) => void
}

export default function HomePage({ onViewProduct, onViewBrand, onAddToCart, wishlist, onWishlist, setPage }: Props) {
  const products = useProducts()
  const [activeConcern, setActiveConcern] = useState<string | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [carouselIdx, setCarouselIdx] = useState(0)
  const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100)
  }, [])

  const featuredProducts = products.slice(0, 8)
  const newArrivals = products.filter(p => p.isNew).slice(0, 4)

  const concernProducts = activeConcern
    ? products.filter(p => p.concern.includes(activeConcern)).slice(0, 4)
    : products.slice(0, 4)

  function scrollCarousel(dir: number) {
    if (!carouselRef.current) return
    const cardWidth = 280 + 20
    carouselRef.current.scrollBy({ left: dir * cardWidth, behavior: 'smooth' })
    setCarouselIdx(i => Math.max(0, Math.min(i + dir, featuredProducts.length - 4)))
  }

  return (
    <div style={{ background: '#FAF8F5' }}>
      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', paddingTop: 80 }} className="max-w-none overflow-hidden relative">
        {/* Background grain */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.03\'/%3E%3C/svg%3E")', pointerEvents: 'none', zIndex: 0 }} />

        {/* Left content */}
        <div style={{ padding: '80px 64px 80px 80px', position: 'relative', zIndex: 1 }}>
          <div
            className="section-label mb-6"
            style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'none' : 'translateY(12px)', transition: 'all 0.7s ease 0.1s' }}
          >
            Premium Beauty — Curated For You
          </div>
          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(48px, 5.5vw, 84px)',
              lineHeight: 1.05,
              color: '#1C1916',
              marginBottom: 24,
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'none' : 'translateY(28px)',
              transition: 'all 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.2s',
            }}
          >
            Beauty,
            <br />
            <span style={{ fontStyle: 'italic', color: '#C4A882' }}>Curated</span>
            <br />
            For You.
          </h1>
          <p
            style={{
              fontSize: 16,
              color: '#8A7E72',
              lineHeight: 1.7,
              maxWidth: 400,
              marginBottom: 40,
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'none' : 'translateY(20px)',
              transition: 'all 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.35s',
            }}
          >
            Discover skincare and beauty essentials from brands you love, all in one place. Your ritual starts here.
          </p>
          <div
            className="flex flex-wrap gap-4"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'none' : 'translateY(16px)',
              transition: 'all 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.5s',
            }}
          >
            <button className="btn-primary" onClick={() => setPage('shop')}>
              Shop Now
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <button className="btn-outline" onClick={() => setPage('category')}>
              Explore Collection
            </button>
          </div>

          {/* Stats */}
          <div
            className="flex gap-10 mt-16"
            style={{
              opacity: heroVisible ? 1 : 0,
              transition: 'opacity 0.9s ease 0.7s',
            }}
          >
            {[['7+', 'Premium Brands'], ['500+', 'Products'], ['10K+', 'Happy Customers']].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-3xl" style={{ color: '#1C1916', lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 11, color: '#8A7E72', letterSpacing: '0.1em', marginTop: 4, textTransform: 'uppercase' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right – image composition */}
        <div
          style={{
            position: 'relative',
            height: '100vh',
            overflow: 'hidden',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'none' : 'translateX(40px)',
            transition: 'all 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.3s',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1670201203116-26644750a726?w=900&h=1100&fit=crop&auto=format"
            alt="Premium skincare"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* Gradient overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #FAF8F5 0%, transparent 20%, transparent 100%)' }} />

          {/* Floating product card */}
          <div
            className="animate-float glass-card"
            style={{
              position: 'absolute',
              bottom: 120,
              left: -30,
              padding: '16px 20px',
              borderRadius: 2,
              border: '1px solid rgba(224,217,207,0.5)',
              minWidth: 200,
              boxShadow: '0 20px 60px rgba(28,25,22,0.12)',
            }}
          >
            <div style={{ fontSize: 9, color: '#C4A882', letterSpacing: '0.14em', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>Dot n Key</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1C1916', marginBottom: 8 }}>Vitamin C Serum</div>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1C1916' }}>{formatCurrency(1990)}</span>
              <span style={{ fontSize: 10, color: '#FAF8F5', background: '#C4A882', padding: '3px 8px', fontWeight: 600 }}>SAVE 20%</span>
            </div>
          </div>

          {/* Second floating card */}
          <div
            className="animate-float-slow glass-card"
            style={{
              position: 'absolute',
              top: 140,
              right: 40,
              padding: '14px 18px',
              borderRadius: 2,
              border: '1px solid rgba(224,217,207,0.5)',
              boxShadow: '0 20px 60px rgba(28,25,22,0.10)',
            }}
          >
            <div className="flex items-center gap-2">
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#C4A882' }} />
              <span style={{ fontSize: 11, color: '#1C1916', fontWeight: 500 }}>4.8 ★ Foxtale</span>
            </div>
          </div>
        </div>

        {/* Mobile hero fallback */}
        <style>{`
          @media (max-width: 768px) {
            .hero-grid { grid-template-columns: 1fr !important; }
            .hero-right { display: none; }
          }
        `}</style>
      </section>

      {/* BENEFITS STRIP */}
      <section style={{ background: '#1C1916', padding: '24px 0' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {[
              ['Authentic Products', 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'],
              ['Curated Beauty', 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'],
              ['Secure Shopping', 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'],
              ['Fast Delivery', 'M13 10V3L4 14h7v7l9-11h-7z'],
              ['Easy Returns', 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6'],
            ].map(([label, path]) => (
              <div key={label} className="flex items-center gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4A882" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d={path} />
                </svg>
                <span style={{ fontSize: 12, color: 'rgba(250,248,245,0.8)', fontWeight: 500, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section style={{ padding: '100px 0' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="section-label mb-4">Discover</div>
            <h2 className="font-display" style={{ fontSize: 'clamp(36px, 4vw, 60px)', color: '#1C1916', marginBottom: 16 }}>
              Explore Your Beauty Ritual
            </h2>
            <p style={{ fontSize: 16, color: '#8A7E72', maxWidth: 480, margin: '0 auto' }}>
              Find the essentials your skin deserves, from brands built for your journey.
            </p>
          </div>

          {/* Asymmetric editorial grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'auto', gap: 16 }}>
            {/* Dot n Key — large feature */}
            <div
              className="group cursor-pointer overflow-hidden relative"
              style={{ gridColumn: '1 / 3', gridRow: '1 / 3', minHeight: 500, background: brands[0].color }}
              onClick={() => onViewBrand(brands[0].id)}
            >
              <img
                src={`https://images.unsplash.com/photo-${brands[0].image}?w=800&h=700&fit=crop&auto=format`}
                alt={brands[0].name}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ transition: 'transform 0.6s cubic-bezier(0.22,1,0.36,1)' }}
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(28,25,22,0.7) 0%, transparent 60%)' }} />
              <div className="absolute bottom-0 left-0 p-8" style={{ transition: 'transform 0.4s ease' }}>
                <div style={{ fontSize: 9, color: '#C4A882', letterSpacing: '0.22em', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>Skincare Essentials</div>
                <h3 className="font-display text-4xl" style={{ color: '#FAF8F5', marginBottom: 8 }}>Dot n Key</h3>
                <p style={{ fontSize: 13, color: 'rgba(250,248,245,0.75)', marginBottom: 16, maxWidth: 280 }}>{brands[0].tagline}</p>
                <span style={{ fontSize: 11, color: '#FAF8F5', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                  Explore
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transition: 'transform 0.3s ease' }} className="group-hover:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
              </div>
            </div>

            {/* Reginal Men */}
            <div
              className="group cursor-pointer overflow-hidden relative"
              style={{ gridColumn: '3', gridRow: '1', minHeight: 240, background: brands[1].color }}
              onClick={() => onViewBrand(brands[1].id)}
            >
              <img src={`https://images.unsplash.com/photo-${brands[1].image}?w=400&h=300&fit=crop&auto=format`} alt={brands[1].name} className="absolute inset-0 w-full h-full object-cover" style={{ transition: 'transform 0.6s ease' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(28,25,22,0.65) 0%, transparent 55%)' }} />
              <CategoryCardContent brand={brands[1]} />
            </div>

            {/* Palm */}
            <div
              className="group cursor-pointer overflow-hidden relative"
              style={{ gridColumn: '4', gridRow: '1', minHeight: 240, background: brands[2].color }}
              onClick={() => onViewBrand(brands[2].id)}
            >
              <img src={`https://images.unsplash.com/photo-${brands[2].image}?w=400&h=300&fit=crop&auto=format`} alt={brands[2].name} className="absolute inset-0 w-full h-full object-cover" style={{ transition: 'transform 0.6s ease' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(28,25,22,0.65) 0%, transparent 55%)' }} />
              <CategoryCardContent brand={brands[2]} />
            </div>

            {/* Flix */}
            <div
              className="group cursor-pointer overflow-hidden relative"
              style={{ gridColumn: '3', gridRow: '2', minHeight: 240, background: brands[3].color }}
              onClick={() => onViewBrand(brands[3].id)}
            >
              <img src={`https://images.unsplash.com/photo-${brands[3].image}?w=400&h=300&fit=crop&auto=format`} alt={brands[3].name} className="absolute inset-0 w-full h-full object-cover" style={{ transition: 'transform 0.6s ease' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(28,25,22,0.65) 0%, transparent 55%)' }} />
              <CategoryCardContent brand={brands[3]} />
            </div>

            {/* Mamaearth */}
            <div
              className="group cursor-pointer overflow-hidden relative"
              style={{ gridColumn: '4', gridRow: '2', minHeight: 240, background: brands[4].color }}
              onClick={() => onViewBrand(brands[4].id)}
            >
              <img src={`https://images.unsplash.com/photo-${brands[4].image}?w=400&h=300&fit=crop&auto=format`} alt={brands[4].name} className="absolute inset-0 w-full h-full object-cover" style={{ transition: 'transform 0.6s ease' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(28,25,22,0.65) 0%, transparent 55%)' }} />
              <CategoryCardContent brand={brands[4]} />
            </div>

            {/* Derma — wide */}
            <div
              className="group cursor-pointer overflow-hidden relative"
              style={{ gridColumn: '1 / 3', gridRow: '3', minHeight: 220, background: brands[5].color }}
              onClick={() => onViewBrand(brands[5].id)}
            >
              <img src={`https://images.unsplash.com/photo-${brands[5].image}?w=700&h=260&fit=crop&auto=format`} alt={brands[5].name} className="absolute inset-0 w-full h-full object-cover" style={{ transition: 'transform 0.6s ease' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(28,25,22,0.65) 0%, transparent 55%)' }} />
              <CategoryCardContent brand={brands[5]} />
            </div>

            {/* Foxtale — wide */}
            <div
              className="group cursor-pointer overflow-hidden relative"
              style={{ gridColumn: '3 / 5', gridRow: '3', minHeight: 220, background: brands[6].color }}
              onClick={() => onViewBrand(brands[6].id)}
            >
              <img src={`https://images.unsplash.com/photo-${brands[6].image}?w=700&h=260&fit=crop&auto=format`} alt={brands[6].name} className="absolute inset-0 w-full h-full object-cover" style={{ transition: 'transform 0.6s ease' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(28,25,22,0.65) 0%, transparent 55%)' }} />
              <CategoryCardContent brand={brands[6]} />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED COLLECTION */}
      <section style={{ padding: '80px 0', background: '#F5F2ED' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="section-label mb-3">Curated Picks</div>
              <h2 className="font-display" style={{ fontSize: 'clamp(32px, 3.5vw, 52px)', color: '#1C1916' }}>
                Your Skin's New Favorites
              </h2>
            </div>
            <button className="btn-outline hidden md:flex" onClick={() => setPage('shop')}>View All</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {featuredProducts.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onView={onViewProduct}
                onAddToCart={onAddToCart}
                isWishlisted={wishlist.includes(p.id)}
                onWishlist={onWishlist}
              />
            ))}
          </div>
          <div className="text-center mt-10 md:hidden">
            <button className="btn-outline" onClick={() => setPage('shop')}>View All Products</button>
          </div>
        </div>
      </section>

      {/* PRODUCT CAROUSEL */}
      <section style={{ padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="section-label mb-3">Bestsellers</div>
              <h2 className="font-display" style={{ fontSize: 'clamp(28px, 3vw, 44px)', color: '#1C1916' }}>
                Most Loved Products
              </h2>
            </div>
            <div className="flex gap-3">
              <button onClick={() => scrollCarousel(-1)} style={{ width: 44, height: 44, border: '1.5px solid #E0D9CF', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#1C1916'; (e.currentTarget as HTMLElement).style.borderColor = '#1C1916'; (e.currentTarget as HTMLElement).querySelector('svg')!.style.color = '#FAF8F5' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; (e.currentTarget as HTMLElement).style.borderColor = '#E0D9CF'; (e.currentTarget as HTMLElement).querySelector('svg')!.style.color = '#1C1916' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1C1916" strokeWidth="1.8"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              </button>
              <button onClick={() => scrollCarousel(1)} style={{ width: 44, height: 44, border: '1.5px solid #E0D9CF', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#1C1916'; (e.currentTarget as HTMLElement).style.borderColor = '#1C1916'; (e.currentTarget as HTMLElement).querySelector('svg')!.style.color = '#FAF8F5' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; (e.currentTarget as HTMLElement).style.borderColor = '#E0D9CF'; (e.currentTarget as HTMLElement).querySelector('svg')!.style.color = '#1C1916' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1C1916" strokeWidth="1.8"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
          <div ref={carouselRef} className="flex gap-5 overflow-x-auto scroll-hide pb-4" style={{ scrollSnapType: 'x mandatory' }}>
            {products.map(p => (
              <div key={p.id} style={{ minWidth: 260, scrollSnapAlign: 'start', flexShrink: 0 }}>
                <ProductCard
                  product={p}
                  onView={onViewProduct}
                  onAddToCart={onAddToCart}
                  isWishlisted={wishlist.includes(p.id)}
                  onWishlist={onWishlist}
                />
              </div>
            ))}
          </div>
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-6">
            {[0,1,2,3].map(i => (
              <div key={i} style={{ width: i === carouselIdx ? 24 : 8, height: 3, background: i === carouselIdx ? '#1C1916' : '#E0D9CF', transition: 'all 0.3s ease', borderRadius: 2 }} />
            ))}
          </div>
        </div>
      </section>

      {/* BRAND MARQUEE */}
      <section style={{ padding: '60px 0', background: '#F0EBE3', overflow: 'hidden' }}>
        <div className="mb-8 text-center">
          <div className="section-label mb-3">Our Brands</div>
          <h2 className="font-display" style={{ fontSize: 'clamp(28px, 3vw, 44px)', color: '#1C1916' }}>
            Beauty Brands, All in One Place.
          </h2>
        </div>
        <div style={{ overflow: 'hidden', position: 'relative' }}>
          <div className="flex animate-marquee" style={{ width: 'max-content', gap: 0 }}>
            {[...brands, ...brands].map((b, i) => (
              <div key={i} className="flex items-center gap-8" style={{ padding: '20px 48px', borderRight: '1px solid rgba(28,25,22,0.1)', whiteSpace: 'nowrap' }}>
                <span className="font-display" style={{ fontSize: 22, color: '#1C1916', opacity: 0.7 }}>{b.name}</span>
                <span style={{ color: '#C4A882', fontSize: 14 }}>✦</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EDITORIAL BANNER */}
      <section style={{ position: 'relative', height: 600, overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1544717304-a2db4a7b16ee?w=1400&h=700&fit=crop&auto=format"
          alt="Beauty routine"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(28,25,22,0.75) 0%, rgba(28,25,22,0.3) 60%, transparent 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 80px' }}>
          <div style={{ maxWidth: 520 }}>
            <div className="section-label mb-4" style={{ color: '#C4A882' }}>Your Ritual Awaits</div>
            <h2 className="font-display" style={{ fontSize: 'clamp(36px, 4.5vw, 66px)', color: '#FAF8F5', marginBottom: 20, lineHeight: 1.05 }}>
              A Better Routine Starts Here.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.75)', marginBottom: 36, lineHeight: 1.7 }}>
              Build a routine that fits your skin, your lifestyle, and your everyday goals.
            </p>
            <button
              onClick={() => setPage('shop')}
              style={{ background: '#C4A882', color: '#1C1916', padding: '14px 36px', fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.3s ease' }}
            >
              Discover Skincare
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </section>

      {/* SKINCARE DISCOVERY */}
      <section style={{ padding: '100px 0', background: '#FAF8F5' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="section-label mb-3">Personalise</div>
            <h2 className="font-display" style={{ fontSize: 'clamp(32px, 3.5vw, 52px)', color: '#1C1916', marginBottom: 12 }}>
              Find What Your Skin Needs.
            </h2>
            <p style={{ fontSize: 15, color: '#8A7E72' }}>Select a concern to discover products curated for you.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {skincareConcerns.map(c => (
              <button
                key={c.label}
                onClick={() => setActiveConcern(activeConcern === c.label ? null : c.label)}
                style={{
                  padding: '12px 24px',
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                  border: `1.5px solid ${activeConcern === c.label ? '#1C1916' : '#E0D9CF'}`,
                  background: activeConcern === c.label ? '#1C1916' : 'transparent',
                  color: activeConcern === c.label ? '#FAF8F5' : '#1C1916',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: 'inherit',
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {concernProducts.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onView={onViewProduct}
                onAddToCart={onAddToCart}
                isWishlisted={wishlist.includes(p.id)}
                onWishlist={onWishlist}
              />
            ))}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section style={{ padding: '80px 0', background: '#F5F2ED' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="section-label mb-3">Just Landed</div>
              <h2 className="font-display" style={{ fontSize: 'clamp(28px, 3.5vw, 50px)', color: '#1C1916' }}>
                Fresh Into Your Routine.
              </h2>
            </div>
            <button className="btn-outline hidden md:flex" onClick={() => setPage('shop')}>See All New</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {newArrivals.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onView={onViewProduct}
                onAddToCart={onAddToCart}
                isWishlisted={wishlist.includes(p.id)}
                onWishlist={onWishlist}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SPECIAL OFFER */}
      <section style={{ background: '#1C1916', padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: '0.28em', color: '#C4A882', fontWeight: 600, textTransform: 'uppercase', marginBottom: 16 }}>Exclusive Deals</div>
              <h2 className="font-display" style={{ fontSize: 'clamp(32px, 4vw, 58px)', color: '#FAF8F5', marginBottom: 20, lineHeight: 1.05 }}>
                Your Beauty Ritual,
                <span style={{ color: '#C4A882', fontStyle: 'italic' }}> Better.</span>
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(250,248,245,0.6)', lineHeight: 1.7, marginBottom: 36, maxWidth: 400 }}>
                Discover selected beauty essentials at exclusive prices. Limited-time offers curated just for you.
              </p>
              <button
                onClick={() => setPage('shop')}
                style={{ background: '#C4A882', color: '#1C1916', padding: '14px 36px', fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10 }}
              >
                Shop Offers
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {products.filter(p => p.originalPrice - p.price > 300).slice(0, 4).map(p => (
                <div
                  key={p.id}
                  onClick={() => onViewProduct(p)}
                  className="group cursor-pointer overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px', transition: 'background 0.3s ease' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'}
                >
                  <div style={{ fontSize: 9, color: '#C4A882', letterSpacing: '0.14em', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{p.brand}</div>
                  <div style={{ fontSize: 13, color: '#FAF8F5', fontWeight: 500, lineHeight: 1.4, marginBottom: 8 }}>{p.name}</div>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#C4A882' }}>{formatCurrency(p.price)}</span>
                    <span style={{ fontSize: 11, color: 'rgba(250,248,245,0.4)', textDecoration: 'line-through' }}>{formatCurrency(p.originalPrice)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BEAUTY JOURNAL */}
      <section style={{ padding: '100px 0' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="section-label mb-3">Journal</div>
              <h2 className="font-display" style={{ fontSize: 'clamp(32px, 3.5vw, 52px)', color: '#1C1916' }}>
                The NAZ Beauty Journal
              </h2>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {journalPosts.map(post => (
              <div key={post.id} className="group cursor-pointer card-hover" style={{ background: '#FFFFFF', overflow: 'hidden' }}>
                <div style={{ height: 240, overflow: 'hidden', background: '#F5F2ED' }}>
                  <img
                    src={`https://images.unsplash.com/photo-${post.image}?w=600&h=340&fit=crop&auto=format`}
                    alt={post.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1)', transition: 'transform 0.6s ease' }}
                    className="group-hover:scale-105"
                  />
                </div>
                <div style={{ padding: '24px' }}>
                  <div className="flex items-center justify-between mb-3">
                    <span style={{ fontSize: 9, color: '#C4A882', letterSpacing: '0.16em', fontWeight: 600, textTransform: 'uppercase' }}>{post.category}</span>
                    <span style={{ fontSize: 11, color: '#8A7E72' }}>{post.readTime}</span>
                  </div>
                  <h3 className="font-display" style={{ fontSize: 20, color: '#1C1916', lineHeight: 1.3, marginBottom: 12 }}>{post.title}</h3>
                  <p style={{ fontSize: 13, color: '#8A7E72', lineHeight: 1.6, marginBottom: 16 }}>{post.excerpt}</p>
                  <div className="flex items-center gap-2" style={{ fontSize: 11, color: '#1C1916', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Read More
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transition: 'transform 0.3s ease' }} className="group-hover:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <NewsletterSection />

      <Footer setPage={setPage} />
    </div>
  )
}

function CategoryCardContent({ brand }: { brand: typeof brands[0] }) {
  return (
    <div className="absolute bottom-0 left-0 p-6 w-full">
      <div style={{ fontSize: 9, color: '#C4A882', letterSpacing: '0.18em', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{brand.desc}</div>
      <h3 className="font-display text-xl" style={{ color: '#FAF8F5', marginBottom: 4 }}>{brand.name}</h3>
      <span className="group-hover:gap-3 flex items-center gap-2" style={{ fontSize: 10, color: 'rgba(250,248,245,0.75)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
        Explore
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transition: 'transform 0.3s ease' }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </span>
    </div>
  )
}

function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <section style={{ background: '#F0EBE3', padding: '100px 0' }}>
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="section-label mb-5">Newsletter</div>
        <h2 className="font-display" style={{ fontSize: 'clamp(32px, 4vw, 56px)', color: '#1C1916', marginBottom: 16 }}>
          Stay In The Glow.
        </h2>
        <p style={{ fontSize: 15, color: '#8A7E72', lineHeight: 1.7, marginBottom: 48, maxWidth: 400, margin: '0 auto 48px' }}>
          Get beauty tips, new arrivals and exclusive offers from NAZ COSMATICES.
        </p>
        {submitted ? (
          <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#1C1916', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C4A882" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div className="font-display text-2xl" style={{ color: '#1C1916' }}>You're in the glow.</div>
            <p style={{ fontSize: 14, color: '#8A7E72' }}>Welcome to the NAZ community.</p>
          </div>
        ) : (
          <form
            onSubmit={e => { e.preventDefault(); if (email) setSubmitted(true) }}
            className="flex gap-3 max-w-sm mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="input-field flex-1"
            />
            <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
              Join NAZ
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
