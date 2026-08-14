import Footer from '../components/Footer'
import { formatCurrency } from '../lib/currency'
import { getImageUrl } from '../lib/products'
import type { CartItem, Page } from '../types'

interface Props {
  items: CartItem[]
  onUpdateQty: (id: string, qty: number) => void
  onRemove: (id: string) => void
  setPage: (p: Page) => void
}

export default function CartPage({ items, onUpdateQty, onRemove, setPage }: Props) {
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const savings = items.reduce((sum, i) => sum + (i.product.originalPrice - i.product.price) * i.quantity, 0)
  const delivery = subtotal >= 499 ? 0 : 79
  const total = subtotal + delivery

  return (
    <div style={{ background: '#FAF8F5', paddingTop: 80, minHeight: '100vh' }}>
      {/* Progress */}
      <div style={{ borderBottom: '1px solid #E0D9CF', padding: '20px 0' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-center gap-4">
            {['Cart', 'Address', 'Payment', 'Confirmed'].map((step, i) => (
              <div key={step} className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: i === 0 ? '#1C1916' : '#E0D9CF',
                    color: i === 0 ? '#FAF8F5' : '#8A7E72',
                    fontSize: 12,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>{i + 1}</div>
                  <span style={{ fontSize: 12, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? '#1C1916' : '#8A7E72', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{step}</span>
                </div>
                {i < 3 && <div style={{ width: 32, height: 1, background: '#E0D9CF' }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: '#1C1916', marginBottom: 32 }}>
          Your Beauty Bag
        </h1>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div className="font-display text-4xl" style={{ color: '#1C1916', marginBottom: 12 }}>Your beauty bag is waiting.</div>
            <p style={{ color: '#8A7E72', fontSize: 15, marginBottom: 32 }}>You haven't added any products yet.</p>
            <button onClick={() => setPage('shop')} className="btn-primary">Explore Products</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'clamp(30px, 5vw, 48px)', alignItems: 'start' }}>
            {/* Items */}
            <div>
              {items.map(item => (
                <div
                  key={item.product.id}
                  className="flex gap-5"
                  style={{ borderBottom: '1px solid #E0D9CF', paddingBottom: 24, marginBottom: 24 }}
                >
                  <div style={{ width: 'clamp(80px, 15vw, 100px)', height: 'clamp(96px, 18vw, 120px)', flexShrink: 0, background: '#F5F2ED', overflow: 'hidden' }}>
                    <img
                      src={getImageUrl(item.product.image, 200, 240)}
                      alt={item.product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="flex-1">
                    <div style={{ fontSize: 10, color: '#C4A882', letterSpacing: '0.14em', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{item.product.brand}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#1C1916', marginBottom: 4, lineHeight: 1.4 }}>{item.product.name}</div>
                    <div style={{ fontSize: 12, color: '#8A7E72', marginBottom: 14 }}>{item.product.category}</div>
                    <div className="flex items-center gap-6">
                      {/* Qty */}
                      <div className="flex items-center" style={{ border: '1.5px solid #E0D9CF' }}>
                        <button onClick={() => onUpdateQty(item.product.id, Math.max(1, item.quantity - 1))} style={{ width: 32, height: 32, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#1C1916', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                        <span style={{ width: 32, textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#1C1916' }}>{item.quantity}</span>
                        <button onClick={() => onUpdateQty(item.product.id, item.quantity + 1)} style={{ width: 32, height: 32, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#1C1916', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                      </div>
                      <button onClick={() => onRemove(item.product.id)} style={{ fontSize: 11, color: '#8A7E72', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                        Remove
                      </button>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#1C1916' }}>{formatCurrency(item.product.price * item.quantity)}</div>
                    {item.product.originalPrice > item.product.price && (
                      <div style={{ fontSize: 12, color: '#8A7E72', textDecoration: 'line-through' }}>{formatCurrency(item.product.originalPrice * item.quantity)}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div style={{ background: '#F5F2ED', padding: 28, position: 'sticky', top: 100 }}>
              <h3 className="font-display text-2xl" style={{ color: '#1C1916', marginBottom: 24 }}>Order Summary</h3>
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between" style={{ fontSize: 14, color: '#8A7E72' }}>
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between" style={{ fontSize: 14, color: '#2D7A4F' }}>
                    <span>You save</span>
                    <span>-{formatCurrency(savings)}</span>
                  </div>
                )}
                <div className="flex justify-between" style={{ fontSize: 14, color: '#8A7E72' }}>
                  <span>Delivery</span>
                  <span>{delivery === 0 ? <span style={{ color: '#2D7A4F' }}>FREE</span> : formatCurrency(delivery)}</span>
                </div>
                {delivery > 0 && (
                  <div style={{ fontSize: 11, color: '#8A7E72', background: 'rgba(196,168,130,0.15)', padding: '8px 12px' }}>
                    Add {formatCurrency(499 - subtotal)} more for free delivery
                  </div>
                )}
                <div style={{ height: 1, background: '#E0D9CF', margin: '4px 0' }} />
                <div className="flex justify-between font-display" style={{ fontSize: 22, color: '#1C1916' }}>
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
              <button
                onClick={() => setPage('checkout')}
                className="btn-primary w-full"
                style={{ justifyContent: 'center', height: 50 }}
              >
                Proceed to Checkout
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              <button onClick={() => setPage('shop')} style={{ width: '100%', textAlign: 'center', fontSize: 12, color: '#8A7E72', background: 'none', border: 'none', cursor: 'pointer', marginTop: 12, letterSpacing: '0.08em', fontFamily: 'inherit', textTransform: 'uppercase' }}>
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer setPage={setPage} />
    </div>
  )
}
