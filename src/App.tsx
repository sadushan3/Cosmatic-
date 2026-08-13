import { useState, useCallback } from 'react'
import type { Page, Product, CartItem } from './types'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import SearchOverlay from './components/SearchOverlay'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CategoryPage from './pages/CategoryPage'
import CheckoutPage from './pages/CheckoutPage'
import AdminPage from './pages/AdminPage'

const adminPassword = (import.meta.env.VITE_ADMIN_PASSWORD ?? '').trim()

function AdminGate({ onUnlock }: { onUnlock: () => void }) {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF8F5', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#fff', border: '1px solid #E0D9CF', padding: 28 }}>
        <div className="section-label" style={{ marginBottom: 12 }}>Restricted Access</div>
        <h2 className="font-display" style={{ fontSize: 32, color: '#1C1916', margin: '0 0 12px' }}>Admin Login</h2>
        <p style={{ color: '#6B6259', marginBottom: 20 }}>
          This area is protected. Enter the admin password to continue.
        </p>
        <button className="btn-primary" onClick={onUnlock} style={{ width: '100%' }}>
          Unlock Admin
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [page, setPage] = useState<Page>('home')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [adminUnlocked, setAdminUnlocked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return sessionStorage.getItem('naz-admin-unlocked') === '1'
  })

  const navigateTo = useCallback((p: Page) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const unlockAdmin = useCallback(() => {
    if (!adminPassword) {
      window.alert('Set VITE_ADMIN_PASSWORD in your .env file to enable admin access.')
      return
    }

    const entered = window.prompt('Enter admin password')
    if (entered === adminPassword) {
      setAdminUnlocked(true)
      sessionStorage.setItem('naz-admin-unlocked', '1')
      navigateTo('admin')
      return
    }

    window.alert('Incorrect password. Customers cannot access the admin panel.')
  }, [adminPassword, navigateTo])

  const viewProduct = useCallback((product: Product) => {
    setSelectedProduct(product)
    navigateTo('product')
  }, [navigateTo])

  const viewBrand = useCallback((brandId: string) => {
    setSelectedBrandId(brandId)
    navigateTo('category')
  }, [navigateTo])

  const addToCart = useCallback((product: Product, qty = 1) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i)
      }
      return [...prev, { product, quantity: qty }]
    })
  }, [])

  const updateQty = useCallback((id: string, qty: number) => {
    setCartItems(prev => prev.map(i => i.product.id === id ? { ...i, quantity: qty } : i))
  }, [])

  const removeFromCart = useCallback((id: string) => {
    setCartItems(prev => prev.filter(i => i.product.id !== id))
  }, [])

  const toggleWishlist = useCallback((id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id])
  }, [])

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0)

  return (
    <>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}

      {loaded && (
        <>
          <Navbar
            page={page}
            setPage={navigateTo}
            cartCount={cartCount}
            wishlistCount={wishlist.length}
            onSearch={() => setSearchOpen(true)}
            adminUnlocked={adminUnlocked}
            onAdminOpen={unlockAdmin}
          />

          <SearchOverlay
            open={searchOpen}
            onClose={() => setSearchOpen(false)}
            onViewProduct={viewProduct}
            setPage={navigateTo}
          />

          {page === 'home' && (
            <HomePage
              onViewProduct={viewProduct}
              onViewBrand={viewBrand}
              onAddToCart={addToCart}
              wishlist={wishlist}
              onWishlist={toggleWishlist}
              setPage={navigateTo}
            />
          )}

          {page === 'shop' && (
            <ShopPage
              onViewProduct={viewProduct}
              onAddToCart={addToCart}
              wishlist={wishlist}
              onWishlist={toggleWishlist}
              setPage={navigateTo}
            />
          )}

          {page === 'product' && selectedProduct && (
            <ProductPage
              product={selectedProduct}
              onAddToCart={addToCart}
              wishlist={wishlist}
              onWishlist={toggleWishlist}
              onViewProduct={viewProduct}
              setPage={navigateTo}
            />
          )}

          {page === 'cart' && (
            <CartPage
              items={cartItems}
              onUpdateQty={updateQty}
              onRemove={removeFromCart}
              setPage={navigateTo}
            />
          )}

          {page === 'category' && (
            <CategoryPage
              brandId={selectedBrandId}
              onViewProduct={viewProduct}
              onAddToCart={addToCart}
              wishlist={wishlist}
              onWishlist={toggleWishlist}
              onViewBrand={viewBrand}
              setPage={navigateTo}
            />
          )}

          {page === 'checkout' && (
            <CheckoutPage
              items={cartItems}
              setPage={navigateTo}
              onOrderComplete={() => setCartItems([])}
            />
          )}

          {page === 'admin' && !adminUnlocked ? (
            <AdminGate onUnlock={unlockAdmin} />
          ) : null}

          {page === 'admin' && adminUnlocked && <AdminPage setPage={navigateTo} />}
        </>
      )}
    </>
  )
}
