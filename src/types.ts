export interface Product {
  id: string
  brand: string
  brandId: string
  name: string
  description: string
  price: number
  originalPrice: number
  rating: number
  reviews: number
  image: string
  images: string[]
  category: string
  concern: string[]
  isNew?: boolean
  inStock: boolean
  ingredients?: string
  benefits?: string[]
  howToUse?: string
}

export interface Brand {
  id: string
  name: string
  desc: string
  tagline: string
  image: string
  color: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export type Page = 'home' | 'shop' | 'product' | 'cart' | 'category' | 'checkout' | 'admin'
