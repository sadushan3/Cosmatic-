import { useState } from 'react'
import { formatLkr } from '../lib/currency'
import { getImageUrl } from '../lib/products'
import type { Product } from '../types'

interface Props {
  product: Product
  onView: (p: Product) => void
  onAddToCart: (p: Product) => void
  isWishlisted: boolean
  onWishlist: (id: string) => void
}

export default function ProductCard({ product, onView, onAddToCart, isWishlisted, onWishlist }: Props) {
  const [added, setAdded] = useState(false)
  const [imgHovered, setImgHovered] = useState(false)
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation()
    onAddToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div
      className="group card-hover cursor-pointer"
      style={{ background: '#FFFFFF' }}
      onClick={() => onView(product)}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: '3/4', background: '#F5F2ED' }}
        onMouseEnter={() => setImgHovered(true)}
        onMouseLeave={() => setImgHovered(false)}
      >
        <img
          src={getImageUrl(product.image, 600, 800)}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: imgHovered ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span style={{ background: '#1C1916', color: '#FAF8F5', fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', padding: '4px 8px', textTransform: 'uppercase' }}>
              NEW
            </span>
          )}
          {discount >= 10 && (
            <span style={{ background: '#C4A882', color: '#1C1916', fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', padding: '4px 8px', textTransform: 'uppercase' }}>
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          className="wishlist-btn absolute top-3 right-3"
          onClick={(e) => { e.stopPropagation(); onWishlist(product.id) }}
          style={{ background: 'rgba(250,248,245,0.9)', border: 'none', width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={isWishlisted ? '#C4A882' : 'none'} stroke={isWishlisted ? '#C4A882' : '#1C1916'} strokeWidth="1.8">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Quick add overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '12px',
            opacity: imgHovered ? 1 : 0,
            transform: imgHovered ? 'translateY(0)' : 'translateY(8px)',
            transition: 'all 0.3s ease',
          }}
        >
          <button
            className="w-full"
            onClick={handleAdd}
            style={{
              background: added ? '#C4A882' : '#1C1916',
              color: added ? '#1C1916' : '#FAF8F5',
              padding: '11px 16px',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            {added ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                Added to Bag
              </>
            ) : (
              'Add to Bag'
            )}
          </button>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '14px 4px 4px' }}>
        <div style={{ fontSize: 10, color: '#C4A882', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>
          {product.brand}
        </div>
        <div style={{ fontSize: 14, color: '#1C1916', fontWeight: 500, lineHeight: 1.4, marginBottom: 6 }}>
          {product.name}
        </div>
        <div className="flex items-center gap-1 mb-8px" style={{ marginBottom: 8 }}>
          <div className="flex">
            {[1,2,3,4,5].map(s => (
              <svg key={s} width="10" height="10" viewBox="0 0 24 24" fill={s <= Math.round(product.rating) ? '#C4A882' : '#E0D9CF'} style={{ marginRight: 1 }}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          <span style={{ fontSize: 10, color: '#8A7E72' }}>({product.reviews})</span>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 15, fontWeight: 600, color: '#1C1916' }}>{formatLkr(product.price)}</span>
          {product.originalPrice > product.price && (
            <span style={{ fontSize: 12, color: '#8A7E72', textDecoration: 'line-through' }}>{formatLkr(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </div>
  )
}
