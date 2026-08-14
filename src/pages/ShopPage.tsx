import { useState, useMemo } from 'react'
import { brands } from '../data'
import ProductCard from '../components/ProductCard'
import Footer from '../components/Footer'
import { useProducts } from '../lib/products'
import type { Product, Page } from '../types'

interface Props {
  onViewProduct: (p: Product) => void
  onAddToCart: (p: Product) => void
  wishlist: string[]
  onWishlist: (id: string) => void
  setPage: (p: Page) => void
}

const categories = ['All', 'Serum', 'Moisturiser', 'Cleanser', 'Sunscreen', 'Toner', 'Lip Care', 'Hair Care']
const concerns = ['All', 'Hydration', 'Brightening', 'Acne Care', 'Sun Care', 'Cleansing', 'Anti-aging']
const sortOptions = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Best Rated' },
]

export default function ShopPage({ onViewProduct, onAddToCart, wishlist, onWishlist, setPage }: Props) {
  const products = useProducts()
  const [activeBrand, setActiveBrand] = useState('All')
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeConcern, setActiveConcern] = useState('All')
  const [sort, setSort] = useState('recommended')
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    let list = [...products]
    if (activeBrand !== 'All') list = list.filter(p => p.brand === activeBrand)
    if (activeCategory !== 'All') list = list.filter(p => p.category === activeCategory)
    if (activeConcern !== 'All') list = list.filter(p => p.concern.includes(activeConcern))
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    }
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
    else if (sort === 'newest') list = list.filter(p => p.isNew).concat(list.filter(p => !p.isNew))
    return list
  }, [activeBrand, activeCategory, activeConcern, sort, search])

  return (
    <div style={{ background: '#FAF8F5', paddingTop: 80 }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #E0D9CF', padding: '48px 0 32px' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="section-label mb-2">Discover</div>
              <h1 className="font-display" style={{ fontSize: 'clamp(32px, 4vw, 56px)', color: '#1C1916' }}>
                Shop All Beauty
              </h1>
              <p style={{ fontSize: 14, color: '#8A7E72', marginTop: 8 }}>{filtered.length} products found</p>
            </div>
            <div className="flex gap-3 items-center">
              <div className="relative">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A7E72" strokeWidth="1.8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search products..."
                  style={{ paddingLeft: 36, paddingRight: 16, height: 42, border: '1.5px solid #E0D9CF', background: 'transparent', fontSize: 13, color: '#1C1916', outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.3s ease', width: 220 }}
                  onFocus={e => (e.target as HTMLElement).style.borderColor = '#C4A882'}
                  onBlur={e => (e.target as HTMLElement).style.borderColor = '#E0D9CF'}
                />
              </div>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                style={{ height: 42, padding: '0 36px 0 14px', border: '1.5px solid #E0D9CF', background: '#FAF8F5', fontSize: 12, color: '#1C1916', outline: 'none', fontFamily: 'inherit', letterSpacing: '0.04em', cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%238A7E72\' strokeWidth=\'2\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
              >
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
                style={{ height: 42, padding: '0 16px', border: '1.5px solid #E0D9CF', background: 'transparent', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1C1916', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'clamp(20px, 4vw, 40px)' }} className="md:grid-cols-[200px_1fr]">
          {/* Sidebar */}
          <aside className={`${showFilters ? '' : 'hidden md:block'}`} style={{ position: 'sticky', top: 100, height: 'fit-content' }}>
            <FilterGroup title="Brand" items={['All', ...brands.map(b => b.name)]} active={activeBrand} onChange={setActiveBrand} />
            <FilterGroup title="Category" items={categories} active={activeCategory} onChange={setActiveCategory} />
            <FilterGroup title="Concern" items={concerns} active={activeConcern} onChange={setActiveConcern} />
            <button
              onClick={() => { setActiveBrand('All'); setActiveCategory('All'); setActiveConcern('All'); setSearch('') }}
              style={{ fontSize: 11, color: '#C4A882', letterSpacing: '0.12em', fontWeight: 600, textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', marginTop: 8, fontFamily: 'inherit' }}
            >
              Clear All Filters
            </button>
          </aside>

          {/* Products */}
          <main>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div className="font-display text-3xl" style={{ color: '#1C1916', marginBottom: 12 }}>No products found</div>
                <p style={{ color: '#8A7E72', marginBottom: 24 }}>Try adjusting your filters or search term</p>
                <button onClick={() => { setActiveBrand('All'); setActiveCategory('All'); setActiveConcern('All'); setSearch('') }} className="btn-outline">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
                {filtered.map(p => (
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
            )}
          </main>
        </div>
      </div>

      <Footer setPage={setPage} />
    </div>
  )
}

function FilterGroup({ title, items, active, onChange }: { title: string; items: string[]; active: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontSize: 11, letterSpacing: '0.16em', fontWeight: 600, color: '#1C1916', textTransform: 'uppercase', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #E0D9CF' }}>
        {title}
      </div>
      <ul className="flex flex-col gap-2">
        {items.map(item => (
          <li key={item}>
            <button
              onClick={() => onChange(item)}
              style={{
                fontSize: 13,
                color: active === item ? '#1C1916' : '#8A7E72',
                fontWeight: active === item ? 600 : 400,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '3px 0',
                fontFamily: 'inherit',
                transition: 'color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {active === item && <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#C4A882', display: 'inline-block' }} />}
              {item}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
