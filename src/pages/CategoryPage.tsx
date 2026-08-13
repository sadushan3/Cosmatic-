import { useState } from 'react'
import { brands } from '../data'
import ProductCard from '../components/ProductCard'
import Footer from '../components/Footer'
import { useProducts } from '../lib/products'
import type { Product, Page } from '../types'

interface Props {
  brandId: string | null
  onViewProduct: (p: Product) => void
  onAddToCart: (p: Product) => void
  wishlist: string[]
  onWishlist: (id: string) => void
  onViewBrand: (id: string) => void
  setPage: (p: Page) => void
}

export default function CategoryPage({ brandId, onViewProduct, onAddToCart, wishlist, onWishlist, onViewBrand, setPage }: Props) {
  const products = useProducts()
  const activeBrand = brandId ? brands.find(b => b.id === brandId) : null
  const [selectedBrand, setSelectedBrand] = useState(brandId || brands[0].id)
  const currentBrand = brands.find(b => b.id === selectedBrand) || brands[0]
  const brandProducts = products.filter(p => p.brandId === selectedBrand)

  return (
    <div style={{ background: '#FAF8F5', paddingTop: 80 }}>
      {/* Hero banner */}
      <div style={{ position: 'relative', height: 400, overflow: 'hidden', background: currentBrand.color }}>
        <img
          src={`https://images.unsplash.com/photo-${currentBrand.image}?w=1400&h=500&fit=crop&auto=format`}
          alt={currentBrand.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(28,25,22,0.8) 0%, rgba(28,25,22,0.3) 60%, transparent 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 80px' }}>
          <div>
            <div style={{ fontSize: 10, color: '#C4A882', letterSpacing: '0.22em', fontWeight: 600, textTransform: 'uppercase', marginBottom: 12 }}>{currentBrand.desc}</div>
            <h1 className="font-display" style={{ fontSize: 'clamp(40px, 5vw, 72px)', color: '#FAF8F5', marginBottom: 16, lineHeight: 1 }}>{currentBrand.name}</h1>
            <p style={{ fontSize: 16, color: 'rgba(250,248,245,0.75)', maxWidth: 440 }}>{currentBrand.tagline}</p>
          </div>
        </div>
      </div>

      {/* Brand tabs */}
      <div style={{ borderBottom: '1px solid #E0D9CF', background: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto">
          <div className="flex" style={{ gap: 0, whiteSpace: 'nowrap' }}>
            {brands.map(b => (
              <button
                key={b.id}
                onClick={() => { setSelectedBrand(b.id); onViewBrand(b.id) }}
                style={{
                  padding: '18px 24px',
                  fontSize: 13,
                  fontWeight: selectedBrand === b.id ? 700 : 400,
                  color: selectedBrand === b.id ? '#1C1916' : '#8A7E72',
                  background: 'none',
                  border: 'none',
                  borderBottom: selectedBrand === b.id ? '2.5px solid #1C1916' : '2.5px solid transparent',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  letterSpacing: '0.06em',
                  transition: 'all 0.3s ease',
                  marginBottom: -1,
                }}
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Brand description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-16" style={{ paddingBottom: 60, borderBottom: '1px solid #E0D9CF' }}>
          <div>
            <div className="section-label mb-4">About</div>
            <h2 className="font-display" style={{ fontSize: 'clamp(28px, 3vw, 44px)', color: '#1C1916', marginBottom: 16 }}>{currentBrand.name}</h2>
            <p style={{ fontSize: 15, color: '#8A7E72', lineHeight: 1.75, marginBottom: 24 }}>
              {currentBrand.tagline}. Discover the full range of {currentBrand.desc.toLowerCase()} designed for your unique skin story.
            </p>
            <div className="flex gap-8">
              <div>
                <div className="font-display text-3xl" style={{ color: '#1C1916' }}>{brandProducts.length}+</div>
                <div style={{ fontSize: 11, color: '#8A7E72', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Products</div>
              </div>
              <div>
                <div className="font-display text-3xl" style={{ color: '#1C1916' }}>
                  {(brandProducts.reduce((s, p) => s + p.rating, 0) / (brandProducts.length || 1)).toFixed(1)}
                </div>
                <div style={{ fontSize: 11, color: '#8A7E72', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Avg Rating</div>
              </div>
            </div>
          </div>
          <div style={{ aspectRatio: '16/9', background: '#F5F2ED', overflow: 'hidden' }}>
            <img
              src={`https://images.unsplash.com/photo-${currentBrand.image}?w=700&h=400&fit=crop&auto=format`}
              alt={currentBrand.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Products */}
        {brandProducts.length > 0 ? (
          <div>
            <div className="section-label mb-4">All Products</div>
            <h3 className="font-display" style={{ fontSize: 'clamp(24px, 2.5vw, 36px)', color: '#1C1916', marginBottom: 32 }}>
              {currentBrand.name} Collection
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
              {brandProducts.map(p => (
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
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div className="font-display text-3xl" style={{ color: '#1C1916', marginBottom: 12 }}>Coming Soon</div>
            <p style={{ color: '#8A7E72' }}>Products from {currentBrand.name} will be available soon.</p>
          </div>
        )}
      </div>

      <Footer setPage={setPage} />
    </div>
  )
}
