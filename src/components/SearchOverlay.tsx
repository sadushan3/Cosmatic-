import { useState, useEffect, useRef } from 'react'
import { getImageUrl, useProducts } from '../lib/products'
import type { Product, Page } from '../types'

interface Props {
  open: boolean
  onClose: () => void
  onViewProduct: (p: Product) => void
  setPage: (p: Page) => void
}

const popular = ['Vitamin C Serum', 'SPF 50 Sunscreen', 'Hyaluronic Acid', 'Retinol Cream', 'Dot n Key', 'Foxtale']
const recent = ['Brightening Serum', 'Ceramide Cream']

export default function SearchOverlay({ open, onClose, onViewProduct, setPage }: Props) {
  const products = useProducts()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
      setResults([])
    }
  }, [open])

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }
    const q = query.toLowerCase()
    setResults(
      products
        .filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.concern.some(c => c.toLowerCase().includes(q))
        )
        .slice(0, 5)
    )
  }, [query])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 animate-fade-in" style={{ background: 'rgba(28,25,22,0.5)' }} onClick={onClose}>
      <div
        className="animate-scale-in"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          background: '#FAF8F5',
          padding: '32px 24px 40px',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl" style={{ color: '#1C1916' }}>What are you looking for?</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1C1916' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="relative mb-8">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8A7E72" strokeWidth="1.8" style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search products, brands, concerns..."
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                borderBottom: '2px solid #1C1916',
                padding: '12px 0 12px 32px',
                fontSize: 18,
                color: '#1C1916',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {results.length > 0 ? (
            <div>
              <div className="section-label mb-4">Results</div>
              <div className="flex flex-col gap-3">
                {results.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { onViewProduct(p); onClose() }}
                    className="flex items-center gap-4 text-left w-full"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0', borderBottom: '1px solid #E0D9CF' }}
                  >
                    <img
                      src={getImageUrl(p.image, 80, 80)}
                      alt={p.name}
                      style={{ width: 52, height: 52, objectFit: 'cover', background: '#F5F2ED' }}
                    />
                    <div>
                      <div style={{ fontSize: 10, color: '#C4A882', letterSpacing: '0.12em', fontWeight: 600, textTransform: 'uppercase' }}>{p.brand}</div>
                      <div style={{ fontSize: 14, color: '#1C1916', fontWeight: 500 }}>{p.name}</div>
                      <div style={{ fontSize: 13, color: '#8A7E72' }}>{formatLkr(p.price)}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : query.length === 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {recent.length > 0 && (
                <div>
                  <div className="section-label mb-4">Recent</div>
                  <div className="flex flex-wrap gap-2">
                    {recent.map(r => (
                      <button key={r} onClick={() => setQuery(r)} style={{ background: '#F0EBE3', border: 'none', padding: '8px 16px', fontSize: 13, color: '#1C1916', cursor: 'pointer', fontFamily: 'inherit' }}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <div className="section-label mb-4">Popular</div>
                <div className="flex flex-wrap gap-2">
                  {popular.map(r => (
                    <button key={r} onClick={() => setQuery(r)} style={{ background: '#F0EBE3', border: 'none', padding: '8px 16px', fontSize: 13, color: '#1C1916', cursor: 'pointer', fontFamily: 'inherit' }}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#8A7E72' }}>
              <div className="font-display text-xl mb-2" style={{ color: '#1C1916' }}>No results found</div>
              <div style={{ fontSize: 14 }}>Try a different search term or browse our categories</div>
              <button onClick={() => { setPage('shop'); onClose() }} className="btn-outline" style={{ marginTop: 24 }}>
                Browse All Products
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
