import { useState } from 'react'
import Footer from '../components/Footer'
import { formatLkr } from '../lib/currency'
import { getImageUrl } from '../lib/products'
import type { CartItem, Page } from '../types'

interface Props {
  items: CartItem[]
  setPage: (p: Page) => void
  onOrderComplete: () => void
}

type CheckoutStep = 'details' | 'delivery' | 'payment' | 'confirmed'

export default function CheckoutPage({ items, setPage, onOrderComplete }: Props) {
  const [step, setStep] = useState<CheckoutStep>('details')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [pin, setPin] = useState('')
  const [deliveryMethod, setDeliveryMethod] = useState('standard')
  const [paymentMethod, setPaymentMethod] = useState('card')

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const delivery = deliveryMethod === 'express' ? 149 : (subtotal >= 499 ? 0 : 79)
  const total = subtotal + delivery

  function buildWhatsAppMessage() {
    const orderLines = items.map(item => `- ${item.product.name} x${item.quantity} (${formatLkr(item.product.price * item.quantity)})`).join('\n')

    return [
      'New order from NAZ COSMATICES',
      '',
      'Customer Details:',
      `Name: ${firstName} ${lastName}`,
      `Email: ${email || 'Not provided'}`,
      `Phone: ${phone || 'Not provided'}`,
      `Address: ${address || 'Not provided'}`,
      `City: ${city || 'Not provided'}`,
      `PIN: ${pin || 'Not provided'}`,
      `Delivery Method: ${deliveryMethod === 'express' ? 'Express Delivery' : 'Standard Delivery'}`,
      `Payment Method: ${paymentMethod === 'card' ? 'Credit / Debit Card' : paymentMethod === 'upi' ? 'UPI / Net Banking' : 'Cash on Delivery'}`,
      '',
      'Products:',
      orderLines,
      '',
      `Subtotal: ${formatLkr(subtotal)}`,
      `Delivery: ${delivery === 0 ? 'FREE' : formatLkr(delivery)}`,
      `Total: ${formatLkr(total)}`,
    ].join('\n')
  }

  function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault()
    const message = encodeURIComponent(buildWhatsAppMessage())
    const whatsappUrl = `https://wa.me/94767803584?text=${message}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    setStep('confirmed')
    onOrderComplete()
  }

  const steps = ['details', 'delivery', 'payment', 'confirmed']
  const stepIdx = steps.indexOf(step)

  if (step === 'confirmed') {
    return (
      <div style={{ background: '#FAF8F5', minHeight: '100vh', paddingTop: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: 480, padding: '0 24px' }} className="animate-fade-up">
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#1C1916', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C4A882" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div className="section-label mb-4">Order Confirmed</div>
          <h1 className="font-display" style={{ fontSize: 'clamp(32px, 4vw, 52px)', color: '#1C1916', marginBottom: 16 }}>
            Your Beauty is on Its Way.
          </h1>
          <p style={{ fontSize: 15, color: '#8A7E72', lineHeight: 1.7, marginBottom: 32 }}>
            Thank you for shopping with NAZ COSMATICES. You'll receive an order confirmation at {email || 'your email'} shortly.
          </p>
          <div style={{ background: '#F5F2ED', padding: '20px 24px', marginBottom: 32, textAlign: 'left' }}>
            <div style={{ fontSize: 11, color: '#C4A882', letterSpacing: '0.14em', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>Estimated Delivery</div>
            <div style={{ fontSize: 15, color: '#1C1916', fontWeight: 600 }}>
              {deliveryMethod === 'express' ? '2–3 business days' : '5–7 business days'}
            </div>
          </div>
          <button onClick={() => setPage('home')} className="btn-primary">Back to Home</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#FAF8F5', paddingTop: 80, minHeight: '100vh' }}>
      {/* Progress */}
      <div style={{ borderBottom: '1px solid #E0D9CF', padding: '20px 0' }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-center gap-4">
            {['Contact', 'Delivery', 'Payment'].map((s, i) => (
              <div key={s} className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: stepIdx >= i ? '#1C1916' : '#E0D9CF',
                    color: stepIdx >= i ? '#FAF8F5' : '#8A7E72',
                    fontSize: 12,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {stepIdx > i ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> : i + 1}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: stepIdx === i ? 600 : 400, color: stepIdx >= i ? '#1C1916' : '#8A7E72', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s}</span>
                </div>
                {i < 2 && <div style={{ width: 32, height: 1, background: stepIdx > i ? '#1C1916' : '#E0D9CF', transition: 'background 0.5s' }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 48, alignItems: 'start' }}>
          {/* Form */}
          <form onSubmit={step === 'payment' ? handlePlaceOrder : undefined}>
            {step === 'details' && (
              <div>
                <h2 className="font-display text-3xl" style={{ color: '#1C1916', marginBottom: 32 }}>Contact Information</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                  <Field label="First Name" value={firstName} onChange={setFirstName} required />
                  <Field label="Last Name" value={lastName} onChange={setLastName} required />
                </div>
                <Field label="Email Address" value={email} onChange={setEmail} type="email" required />
                <div style={{ marginTop: 20 }}>
                  <Field label="Phone Number" value={phone} onChange={setPhone} type="tel" required />
                </div>
                <h3 className="font-display text-2xl" style={{ color: '#1C1916', margin: '32px 0 20px' }}>Delivery Address</h3>
                <Field label="Street Address" value={address} onChange={setAddress} required />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 20 }}>
                  <Field label="City" value={city} onChange={setCity} required />
                  <Field label="PIN Code" value={pin} onChange={setPin} required />
                </div>
                <button
                  type="button"
                  onClick={() => { if (email && firstName && address && city && pin) setStep('delivery') }}
                  className="btn-primary mt-8"
                  style={{ width: '100%', justifyContent: 'center', height: 50 }}
                >
                  Continue to Delivery
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            )}

            {step === 'delivery' && (
              <div>
                <h2 className="font-display text-3xl" style={{ color: '#1C1916', marginBottom: 32 }}>Delivery Method</h2>
                <div className="flex flex-col gap-4 mb-8">
                  {[
                    { id: 'standard', label: 'Standard Delivery', sub: '5–7 business days', price: subtotal >= 499 ? 'FREE' : formatLkr(79) },
                    { id: 'express', label: 'Express Delivery', sub: '2–3 business days', price: formatLkr(149) },
                  ].map(opt => (
                    <label
                      key={opt.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '20px 20px',
                        border: `1.5px solid ${deliveryMethod === opt.id ? '#1C1916' : '#E0D9CF'}`,
                        cursor: 'pointer',
                        background: deliveryMethod === opt.id ? '#F5F2ED' : 'transparent',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${deliveryMethod === opt.id ? '#1C1916' : '#E0D9CF'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {deliveryMethod === opt.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1C1916' }} />}
                        </div>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: '#1C1916' }}>{opt.label}</div>
                          <div style={{ fontSize: 12, color: '#8A7E72' }}>{opt.sub}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: opt.price === 'FREE' ? '#2D7A4F' : '#1C1916' }}>{opt.price}</div>
                      <input type="radio" value={opt.id} checked={deliveryMethod === opt.id} onChange={() => setDeliveryMethod(opt.id)} style={{ display: 'none' }} />
                    </label>
                  ))}
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep('details')} className="btn-outline" style={{ flex: 1, height: 50, justifyContent: 'center' }}>Back</button>
                  <button type="button" onClick={() => setStep('payment')} className="btn-primary" style={{ flex: 2, height: 50, justifyContent: 'center' }}>Continue to Payment</button>
                </div>
              </div>
            )}

            {step === 'payment' && (
              <div>
                <h2 className="font-display text-3xl" style={{ color: '#1C1916', marginBottom: 32 }}>Payment Method</h2>
                <div className="flex flex-col gap-4 mb-8">
                  {[
                    { id: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay' },
                    { id: 'upi', label: 'UPI / Net Banking', sub: 'GPay, PhonePe, Paytm' },
                    { id: 'cod', label: 'Cash on Delivery', sub: 'Pay when your order arrives' },
                  ].map(opt => (
                    <label
                      key={opt.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        padding: '20px',
                        border: `1.5px solid ${paymentMethod === opt.id ? '#1C1916' : '#E0D9CF'}`,
                        cursor: 'pointer',
                        background: paymentMethod === opt.id ? '#F5F2ED' : 'transparent',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${paymentMethod === opt.id ? '#1C1916' : '#E0D9CF'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {paymentMethod === opt.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1C1916' }} />}
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: '#1C1916' }}>{opt.label}</div>
                        <div style={{ fontSize: 12, color: '#8A7E72' }}>{opt.sub}</div>
                      </div>
                      <input type="radio" value={opt.id} checked={paymentMethod === opt.id} onChange={() => setPaymentMethod(opt.id)} style={{ display: 'none' }} />
                    </label>
                  ))}
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep('delivery')} className="btn-outline" style={{ flex: 1, height: 50, justifyContent: 'center' }}>Back</button>
                  <button type="submit" onClick={handlePlaceOrder} className="btn-primary" style={{ flex: 2, height: 50, justifyContent: 'center' }}>
                    Place Order — {formatLkr(total)}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Summary */}
          <div style={{ background: '#F5F2ED', padding: 24, position: 'sticky', top: 100 }}>
            <h3 style={{ fontSize: 13, letterSpacing: '0.12em', fontWeight: 700, color: '#1C1916', textTransform: 'uppercase', marginBottom: 20 }}>Order Summary</h3>
            <div className="flex flex-col gap-3 mb-5">
              {items.map(i => (
                <div key={i.product.id} className="flex items-center gap-3">
                  <div style={{ width: 48, height: 54, background: '#E8E2D9', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={getImageUrl(i.product.image, 96, 108)} alt={i.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div className="flex-1">
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1C1916', lineHeight: 1.4 }}>{i.product.name}</div>
                    <div style={{ fontSize: 11, color: '#8A7E72' }}>Qty: {i.quantity}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1C1916', flexShrink: 0 }}>{formatLkr(i.product.price * i.quantity)}</div>
                </div>
              ))}
            </div>
            <div style={{ height: 1, background: '#E0D9CF', margin: '16px 0' }} />
            <div className="flex justify-between mb-2" style={{ fontSize: 13, color: '#8A7E72' }}>
              <span>Subtotal</span><span>{formatLkr(subtotal)}</span>
            </div>
            <div className="flex justify-between mb-4" style={{ fontSize: 13, color: '#8A7E72' }}>
              <span>Delivery</span><span>{delivery === 0 ? <span style={{ color: '#2D7A4F' }}>FREE</span> : formatLkr(delivery)}</span>
            </div>
            <div className="flex justify-between font-display" style={{ fontSize: 22, color: '#1C1916' }}>
              <span>Total</span><span>{formatLkr(total)}</span>
            </div>
          </div>
        </div>
      </div>
      <Footer setPage={setPage} />
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label style={{ fontSize: 11, color: '#8A7E72', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: 8 }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        className="input-field"
      />
    </div>
  )
}
