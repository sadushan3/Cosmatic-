import { useState, useEffect } from 'react'
import type { Page } from '../types'

interface Props {
  page: Page
  setPage: (p: Page) => void
  cartCount: number
  wishlistCount: number
  onSearch: () => void
  adminUnlocked: boolean
  onAdminOpen: () => void
}

export default function Navbar({ page, setPage, cartCount, wishlistCount, onSearch, adminUnlocked, onAdminOpen }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks: { label: string; page: Page }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Shop', page: 'shop' },
    { label: 'Categories', page: 'category' },
    { label: 'New Arrivals', page: 'shop' },
    { label: 'Offers', page: 'shop' },
    { label: 'Admin', page: 'admin' },
  ]

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-40 glass"
        style={{
          borderBottom: scrolled ? '1px solid rgba(224,217,207,0.6)' : '1px solid transparent',
          transition: 'all 0.4s ease',
          padding: scrolled ? '10px 0' : '18px 0',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => setPage('home')}
            className="flex flex-col items-start leading-none group"
          >
            <span
              className="font-display text-2xl tracking-wider"
              style={{ color: '#1C1916', lineHeight: 1 }}
            >
              NAZ
            </span>
            <span
              style={{
                fontSize: 9,
                letterSpacing: '0.28em',
                color: '#C4A882',
                fontWeight: 600,
                lineHeight: 1.4,
              }}
            >
              COSMATICES
            </span>
          </button>

          {/* Center nav */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <button
                  onClick={() => {
                    if (link.page === 'admin') {
                      if (!adminUnlocked) {
                        onAdminOpen()
                        return
                      }
                      setPage('admin')
                      return
                    }
                    setPage(link.page)
                  }}
                  className="relative"
                  style={{
                    fontSize: 12,
                    letterSpacing: '0.1em',
                    fontWeight: 500,
                    color: page === link.page ? '#C4A882' : '#1C1916',
                    textTransform: 'uppercase',
                    transition: 'color 0.3s ease',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px 0',
                  }}
                >
                  {link.label}
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: page === link.page ? '100%' : '0%',
                      height: 1,
                      background: '#C4A882',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </button>
              </li>
            ))}
          </ul>

          {/* Right icons */}
          <div className="flex items-center gap-5">
            <button onClick={onSearch} className="nav-icon" title="Search" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1C1916', transition: 'color 0.3s ease' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </button>
            <button
              onClick={() => setPage('cart')}
              className="relative"
              title="Wishlist"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1C1916', transition: 'color 0.3s ease' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-white" style={{ background: '#C4A882', fontSize: 9, fontWeight: 700 }}>
                  {wishlistCount}
                </span>
              )}
            </button>
            <button
              title="Account"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1C1916', transition: 'color 0.3s ease' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </button>
            <button
              onClick={() => setPage('cart')}
              className="relative"
              title="Cart"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1C1916', transition: 'color 0.3s ease' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-white" style={{ background: '#1C1916', fontSize: 9, fontWeight: 700 }}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Hamburger */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-1"
              onClick={() => setMenuOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <span style={{ display: 'block', width: 22, height: 1.5, background: '#1C1916', transition: 'all 0.3s' }} />
              <span style={{ display: 'block', width: 16, height: 1.5, background: '#1C1916', transition: 'all 0.3s' }} />
              <span style={{ display: 'block', width: 22, height: 1.5, background: '#1C1916', transition: 'all 0.3s' }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(28,25,22,0.4)' }}
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-72 animate-slide-in-right" style={{ background: '#FAF8F5' }}>
            <div className="p-6 flex items-center justify-between border-b" style={{ borderColor: '#E0D9CF' }}>
              <div>
                <div className="font-display text-xl" style={{ color: '#1C1916' }}>NAZ</div>
                <div style={{ fontSize: 9, letterSpacing: '0.28em', color: '#C4A882', fontWeight: 600 }}>COSMATICES</div>
              </div>
              <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1C1916' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <ul className="p-6 flex flex-col gap-6">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => {
                      if (link.page === 'admin') {
                        onAdminOpen()
                        setMenuOpen(false)
                        return
                      }
                      setPage(link.page)
                      setMenuOpen(false)
                    }}
                    style={{
                      fontSize: 14,
                      letterSpacing: '0.12em',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      color: page === link.page ? '#C4A882' : '#1C1916',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
