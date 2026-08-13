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

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [page, setPage] = useState<Page>('home')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [searchOpen, setSearchOpen] = useState(false)

  const navigateTo = useCallback((p: Page) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

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

          {page === 'admin' && <AdminPage setPage={navigateTo} />}
        </>
      )}
    </>
  )
}
