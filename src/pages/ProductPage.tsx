import { useState } from 'react'
import ProductCard from '../components/ProductCard'
import Footer from '../components/Footer'
import { formatCurrency } from '../lib/currency'
import { getImageUrl, useProducts } from '../lib/products'
import type { Product, Page } from '../types'

interface Props {
  product: Product
  onAddToCart: (p: Product, qty: number) => void
  wishlist: string[]
  onWishlist: (id: string) => void
  onViewProduct: (p: Product) => void
  setPage: (p: Page) => void
}

export default function ProductPage({ product, onAddToCart, wishlist, onWishlist, onViewProduct, setPage }: Props) {
  const products = useProducts()
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [activeTab, setActiveTab] = useState<'desc' | 'ing' | 'use' | 'reviews'>('desc')
  const [added, setAdded] = useState(false)
  const isWishlisted = wishlist.includes(product.id)

  const related = products.filter(p => p.brandId === product.brandId && p.id !== product.id).slice(0, 4)
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  function handleAdd() {
    onAddToCart(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <div style={{ background: '#FAF8F5', paddingTop: 80 }}>
      {/* Breadcrumb */}
      <div style={{ borderBottom: '1px solid #E0D9CF', padding: '16px 0' }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-2" style={{ fontSize: 12, color: '#8A7E72' }}>
          <button onClick={() => setPage('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8A7E72', fontFamily: 'inherit', fontSize: 12 }}>Home</button>
          <span>/</span>
          <button onClick={() => setPage('shop')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8A7E72', fontFamily: 'inherit', fontSize: 12 }}>Shop</button>
          <span>/</span>
          <span style={{ color: '#1C1916', fontWeight: 500 }}>{product.name}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(20px, 5vw, 64px)', alignItems: 'start' }}>
          {/* Gallery */}
          <div>
            <div style={{ aspectRatio: '4/5', background: '#F5F2ED', overflow: 'hidden', marginBottom: 'clamp(8px, 3vw, 12px)' }}>
              <img
                src={getImageUrl(product.images[activeImg] || product.image, 700, 875)}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.4s ease' }}
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{
                      width: 'clamp(50px, 12vw, 72px)',
                      height: 'clamp(50px, 12vw, 72px)',
                      minWidth: 'clamp(50px, 12vw, 72px)',
                      background: '#F5F2ED',
                      border: `2px solid ${activeImg === i ? '#1C1916' : 'transparent'}`,
                      padding: 0,
                      cursor: 'pointer',
                      overflow: 'hidden',
                      transition: 'border-color 0.3s ease',
                      flexShrink: 0,
                    }}
                  >
                    <img src={getImageUrl(img, 100, 100)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info — sticky on desktop */}
          <div style={{ position: 'sticky', top: 'clamp(60px, 10vw, 100px)' }}>
            <div style={{ fontSize: 11, color: '#C4A882', letterSpacing: '0.18em', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>{product.brand}</div>
            <h1 className="font-display" style={{ fontSize: 'clamp(26px, 3vw, 40px)', color: '#1C1916', lineHeight: 1.15, marginBottom: 16 }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= Math.round(product.rating) ? '#C4A882' : '#E0D9CF'} style={{ marginRight: 2 }}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span style={{ fontSize: 13, color: '#1C1916', fontWeight: 600 }}>{product.rating}</span>
              <span style={{ fontSize: 13, color: '#8A7E72' }}>({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-8">
              <span className="font-display" style={{ fontSize: 32, color: '#1C1916' }}>
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span style={{ fontSize: 18, color: '#8A7E72', textDecoration: 'line-through' }}>{formatCurrency(product.originalPrice)}</span>
                  <span style={{ background: '#C4A882', color: '#1C1916', fontSize: 11, fontWeight: 700, padding: '4px 10px', letterSpacing: '0.1em' }}>
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            <div
              className="rich-text-content"
              style={{ fontSize: 15, color: '#8A7E72', lineHeight: 1.7, marginBottom: 28 }}
              dangerouslySetInnerHTML={{ __html: product.description || '<p>No description available</p>' }}
            />

            {/* Availability */}
            <div className="flex items-center gap-2 mb-8" style={{ fontSize: 13, color: product.inStock ? '#2D7A4F' : '#C0392B' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: product.inStock ? '#2D7A4F' : '#C0392B' }} />
              {product.inStock ? 'In Stock — Ready to Ship' : 'Out of Stock'}
            </div>

            {/* Quantity + CTA */}
            <div className="flex gap-2 md:gap-3 mb-4 flex-col sm:flex-row">
              <div className="flex items-center" style={{ border: '1.5px solid #E0D9CF' }}>
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{ width: 'clamp(36px, 8vw, 44px)', height: 'clamp(44px, 8vw, 52px)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'clamp(16px, 2vw, 18px)', color: '#1C1916', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  −
                </button>
                <span style={{ width: 'clamp(30px, 6vw, 40px)', textAlign: 'center', fontSize: 'clamp(13px, 1.5vw, 15px)', fontWeight: 600, color: '#1C1916' }}>{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  style={{ width: 'clamp(36px, 8vw, 44px)', height: 'clamp(44px, 8vw, 52px)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'clamp(16px, 2vw, 18px)', color: '#1C1916', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAdd}
                className="flex-1"
                style={{
                  background: added ? '#C4A882' : '#1C1916',
                  color: added ? '#1C1916' : '#FAF8F5',
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.35s ease',
                  height: 52,
                  fontFamily: 'inherit',
                }}
              >
                {added ? (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Added to Bag</>
                ) : (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>Add to Bag</>
                )}
              </button>
            </div>

            <div className="flex gap-3 mb-8">
              <button
                onClick={() => { onAddToCart(product, qty); setPage('checkout') }}
                className="flex-1 btn-outline"
                style={{ height: 48, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em' }}
              >
                Buy Now
              </button>
              <button
                onClick={() => onWishlist(product.id)}
                style={{
                  width: 48,
                  height: 48,
                  border: `1.5px solid ${isWishlisted ? '#C4A882' : '#E0D9CF'}`,
                  background: isWishlisted ? 'rgba(196,168,130,0.1)' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={isWishlisted ? '#C4A882' : 'none'} stroke={isWishlisted ? '#C4A882' : '#1C1916'} strokeWidth="1.8">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </button>
            </div>

            {/* Delivery info */}
            <div style={{ background: '#F5F2ED', padding: '16px 20px' }}>
              <div className="flex items-center gap-3" style={{ fontSize: 13, color: '#1C1916' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4A882" strokeWidth="1.8"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                Free delivery on orders above {formatCurrency(499)}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ marginTop: 32 }}>
              <div className="flex" style={{ borderBottom: '1px solid #E0D9CF' }}>
                {[
                  { key: 'desc', label: 'Description' },
                  { key: 'ing', label: 'Ingredients' },
                  { key: 'use', label: 'How to Use' },
                  { key: 'reviews', label: 'Reviews' },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as typeof activeTab)}
                    style={{
                      padding: '12px 16px',
                      fontSize: 12,
                      fontWeight: activeTab === tab.key ? 700 : 400,
                      color: activeTab === tab.key ? '#1C1916' : '#8A7E72',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      background: 'none',
                      border: 'none',
                      borderBottom: activeTab === tab.key ? '2px solid #1C1916' : '2px solid transparent',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.3s ease',
                      marginBottom: -1,
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div style={{ padding: '20px 0', fontSize: 14, color: '#8A7E72', lineHeight: 1.7 }}>
                {activeTab === 'desc' && (
                  <div>
                    <div
                      className="rich-text-content"
                      style={{ marginBottom: 16 }}
                      dangerouslySetInnerHTML={{ __html: product.description || '<p>No description available</p>' }}
                    />
                    {product.benefits && (
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {product.benefits.map(b => (
                          <li key={b} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ color: '#C4A882', flexShrink: 0 }}>✦</span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                {activeTab === 'ing' && <p>{product.ingredients || 'Full ingredient list available on the product packaging.'}</p>}
                {activeTab === 'use' && <p>{product.howToUse || 'Apply as directed. See packaging for full instructions.'}</p>}
                {activeTab === 'reviews' && (
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="font-display text-5xl" style={{ color: '#1C1916', lineHeight: 1 }}>{product.rating}</div>
                      <div>
                        <div className="flex mb-1">
                          {[1,2,3,4,5].map(s => (
                            <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill={s <= Math.round(product.rating) ? '#C4A882' : '#E0D9CF'} style={{ marginRight: 2 }}>
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                        </div>
                        <div style={{ fontSize: 12, color: '#8A7E72' }}>{product.reviews} verified reviews</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: '#8A7E72' }}>Reviews will load here from your product database.</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section style={{ padding: '60px 0', background: '#F5F2ED' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="section-label mb-3">More from {product.brand}</div>
            <h2 className="font-display" style={{ fontSize: 36, color: '#1C1916', marginBottom: 32 }}>You May Also Like</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
              {related.map(p => (
                <ProductCard key={p.id} product={p} onView={onViewProduct} onAddToCart={q => onAddToCart(q, 1)} isWishlisted={wishlist.includes(p.id)} onWishlist={onWishlist} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer setPage={setPage} />
    </div>
  )
}
