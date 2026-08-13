import { useEffect, useState } from 'react'
import { products as fallbackProducts } from '../data'
import { supabase } from './supabase'
import type { Product } from '../types'

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function normalizeConcern(value: string | string[] | null | undefined) {
  if (Array.isArray(value)) return value
  return String(value ?? '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

function normalizeBenefits(value: string | string[] | null | undefined) {
  if (Array.isArray(value)) return value
  return String(value ?? '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

export function getImageUrl(value?: string | null, width = 600, height = 800) {
  if (!value) {
    return `https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=${width}&h=${height}&fit=crop&auto=format`
  }

  const trimmed = value.trim()

  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed
  }

  if (trimmed.startsWith('/')) {
    return trimmed
  }

  if (trimmed.includes('.') || trimmed.includes('/')) {
    return trimmed
  }

  return `https://images.unsplash.com/photo-${trimmed}?w=${width}&h=${height}&fit=crop&auto=format`
}

export function toProduct(row: any): Product {
  const images = Array.isArray(row.images) && row.images.length > 0
    ? row.images.filter(Boolean)
    : row.image
      ? [row.image]
      : []

  return {
    id: String(row.id ?? slugify(row.name ?? 'product')),
    brand: row.brand ?? 'Unknown Brand',
    brandId: row.brand_id ?? row.brandId ?? slugify(row.brand ?? 'brand'),
    name: row.name ?? 'Untitled Product',
    description: row.description ?? '',
    price: Number(row.price ?? 0),
    originalPrice: Number(row.original_price ?? row.originalPrice ?? Number(row.price ?? 0)),
    rating: Number(row.rating ?? 4.5),
    reviews: Number(row.reviews ?? 0),
    image: row.image ?? images[0] ?? '',
    images,
    category: row.category ?? 'General',
    concern: normalizeConcern(row.concern),
    isNew: Boolean(row.is_new ?? row.isNew ?? false),
    inStock: Boolean(row.in_stock ?? row.inStock ?? true),
    ingredients: row.ingredients ?? '',
    benefits: normalizeBenefits(row.benefits),
    howToUse: row.how_to_use ?? row.howToUse ?? '',
  }
}

export async function fetchProductsFromSupabase(): Promise<Product[]> {
  const hasConfig = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
  if (!hasConfig || !supabase) return fallbackProducts

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    const rows = Array.isArray(data) ? data : []
    return rows.length > 0 ? rows.map(toProduct) : fallbackProducts
  } catch (error) {
    console.error('Supabase fetch failed, falling back to mock catalog:', error)
    return fallbackProducts
  }
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts)

  useEffect(() => {
    let ignore = false

    fetchProductsFromSupabase().then(result => {
      if (!ignore) setProducts(result)
    })

    return () => {
      ignore = true
    }
  }, [])

  return products
}
