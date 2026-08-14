import { useEffect, useMemo, useState } from 'react'
import { formatCurrency } from '../lib/currency'
import { supabase } from '../lib/supabase'
import { brands } from '../data'
import RichTextEditor from '../components/RichTextEditor'
import type { Page, Product } from '../types'

interface AdminPageProps {
  setPage: (page: Page) => void
}

type FormState = {
  name: string
  brand: string
  brandId: string
  category: string
  description: string
  price: string
  originalPrice: string
  rating: string
  reviews: string
  image: string
  gallery: string
  ingredients: string
  benefits: string
  howToUse: string
  concern: string
  isNew: boolean
  inStock: boolean
}

const initialForm: FormState = {
  name: '',
  brand: 'Dot n Key',
  brandId: 'dot-n-key',
  category: 'Serum',
  description: '',
  price: '1990',
  originalPrice: '2490',
  rating: '4.8',
  reviews: '0',
  image: '',
  gallery: '',
  ingredients: '',
  benefits: '',
  howToUse: '',
  concern: 'Brightening',
  isNew: true,
  inStock: true,
}

const categoryOptions = ['Serum', 'Moisturiser', 'Cleanser', 'Sunscreen', 'Toner', 'Hair Care', 'Lip Care', 'Mask']

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function normalizeConcern(value: string) {
  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

function normalizeBenefits(value: string) {
  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

function createSafeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (char) {
    const random = Math.random() * 16 | 0
    const value = char === 'x' ? random : (random & 0x3 | 0x8)
    return value.toString(16)
  })
}

function splitImageUrls(value: string) {
  return value
    .split(/[\s,]+/)
    .map(item => item.trim())
    .filter(Boolean)
}

function toProduct(row: any): Product {
  return {
    id: row.id,
    brand: row.brand ?? 'Unknown Brand',
    brandId: row.brand_id ?? row.brandId ?? slugify(row.brand ?? 'brand'),
    name: row.name ?? 'Untitled product',
    description: row.description ?? '',
    price: Number(row.price ?? 0),
    originalPrice: Number(row.original_price ?? row.originalPrice ?? Number(row.price ?? 0)),
    rating: Number(row.rating ?? 4.5),
    reviews: Number(row.reviews ?? 0),
    image: row.image ?? row.images?.[0] ?? '',
    images: Array.isArray(row.images) ? row.images : row.image ? [row.image] : [],
    category: row.category ?? 'General',
    concern: Array.isArray(row.concern) ? row.concern : normalizeConcern(row.concern ?? ''),
    isNew: Boolean(row.is_new ?? row.isNew ?? false),
    inStock: Boolean(row.in_stock ?? row.inStock ?? true),
    ingredients: row.ingredients ?? '',
    benefits: Array.isArray(row.benefits) ? row.benefits : normalizeBenefits(row.benefits ?? ''),
    howToUse: row.how_to_use ?? row.howToUse ?? '',
  }
}

export default function AdminPage({ setPage }: AdminPageProps) {
  const [form, setForm] = useState<FormState>(initialForm)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  const selectedImagePreviews = useMemo(
    () => selectedFiles.map(file => ({ file, url: URL.createObjectURL(file) })),
    [selectedFiles],
  )

  useEffect(() => {
    return () => {
      selectedImagePreviews.forEach(item => URL.revokeObjectURL(item.url))
    }
  }, [selectedImagePreviews])

  const connected = useMemo(
    () => Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY),
    [],
  )

  async function fetchProducts() {
    if (!supabase) {
      setLoading(false)
      setMessage({ type: 'error', text: 'Connect Supabase first to load products.' })
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })

      if (error) throw error
      setProducts((data ?? []).map(toProduct))
    } catch (error) {
      console.error(error)
      setMessage({ type: 'error', text: 'Could not load products from Supabase.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!connected) {
      setMessage({
        type: 'error',
        text: 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file before saving products.',
      })
      setLoading(false)
      return
    }

    void fetchProducts()
  }, [connected])

  async function uploadImages(files: File[]) {
    if (!files.length) return []
    if (!supabase) {
      throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
    }

    const uploadedUrls: string[] = []
    const bucketName = 'product-images'

    for (const file of files) {
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name.replace(/\s+/g, '-')}`
      const { error: uploadError } = await supabase.storage.from(bucketName).upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

      if (uploadError) {
        throw new Error(`Image upload failed: ${uploadError.message}`)
      }

      const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName)
      uploadedUrls.push(data.publicUrl)
    }

    return uploadedUrls
  }

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function loadProductIntoForm(product: Product) {
    setEditingId(product.id)
    setForm({
      name: product.name,
      brand: product.brand,
      brandId: product.brandId,
      category: product.category,
      description: product.description,
      price: String(product.price),
      originalPrice: String(product.originalPrice),
      rating: String(product.rating),
      reviews: String(product.reviews),
      image: product.image ?? '',
      gallery: (product.images ?? []).filter(img => img !== product.image).join(', '),
      ingredients: product.ingredients ?? '',
      benefits: (product.benefits ?? []).join(', '),
      howToUse: product.howToUse ?? '',
      concern: (product.concern ?? []).join(', '),
      isNew: Boolean(product.isNew),
      inStock: Boolean(product.inStock),
    })
  }

  async function handleEdit(product: Product) {
    loadProductIntoForm(product)
    setMessage({ type: 'success', text: `Editing ${product.name}. Update the fields and save.` })
  }

  async function handleDelete(productId: string) {
    if (!connected || !supabase) {
      setMessage({ type: 'error', text: 'Supabase credentials are missing.' })
      return
    }

    try {
      const { error } = await supabase.from('products').delete().eq('id', productId)
      if (error) throw error
      setMessage({ type: 'success', text: 'Product deleted successfully.' })
      setEditingId(null)
      setForm(initialForm)
      await fetchProducts()
    } catch (error: any) {
      console.error(error)
      setMessage({ type: 'error', text: error?.message ?? 'Failed to delete product.' })
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!connected || !supabase) {
      setMessage({ type: 'error', text: 'Supabase credentials are missing.' })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      setUploading(true)
      const uploadedUrls = selectedFiles.length ? await uploadImages(selectedFiles) : []
      const extraUrls = splitImageUrls(form.gallery)
      const allImages = [form.image.trim(), ...uploadedUrls, ...extraUrls].filter(Boolean)
      const imagePrimary = form.image.trim() || uploadedUrls[0] || allImages[0] || ''

      const payload = {
        id: editingId ?? createSafeId(),
        name: form.name.trim(),
        brand: form.brand.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        price: Number(form.price) || 0,
        original_price: Number(form.originalPrice) || Number(form.price) || 0,
        rating: Number(form.rating) || 4.5,
        reviews: Number(form.reviews) || 0,
        image: imagePrimary,
        images: [...new Set(allImages)],
        concern: normalizeConcern(form.concern),
        benefits: normalizeBenefits(form.benefits),
        how_to_use: form.howToUse.trim(),
        ingredients: form.ingredients.trim(),
        is_new: form.isNew,
        in_stock: form.inStock,
        created_at: editingId ? undefined : new Date().toISOString(),
      }

      let result
      if (editingId) {
        result = await supabase.from('products').update(payload).eq('id', editingId)
      } else {
        result = await supabase.from('products').insert([payload])
      }

      if (result.error) throw result.error

      setForm(initialForm)
      setSelectedFiles([])
      setEditingId(null)
      setMessage({ type: 'success', text: editingId ? 'Product updated successfully.' : 'Product added successfully.' })
      await fetchProducts()
    } catch (error: any) {
      console.error(error)
      setMessage({ type: 'error', text: error?.message ?? 'Something went wrong while saving the product.' })
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  const productCount = products.length
  const previewImages = [form.image.trim(), ...splitImageUrls(form.gallery)].filter(Boolean).slice(0, 4)

  return (
    <div style={{ background: '#FAF8F5', minHeight: '100vh', paddingTop: 88 }}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="section-label mb-2">Admin</div>
            <h1 className="font-display" style={{ fontSize: 'clamp(32px, 4vw, 56px)', color: '#1C1916' }}>
              Product Control Center
            </h1>
          </div>
          <button className="btn-outline" onClick={() => setPage('shop')}>
            View Store
          </button>
        </div>

        {message && (
          <div
            style={{
              marginBottom: 22,
              padding: '12px 16px',
              border: `1px solid ${message.type === 'success' ? '#8ea88a' : '#d6a4a4'}`,
              background: message.type === 'success' ? '#edf7ec' : '#fef0f0',
              color: '#1C1916',
            }}
          >
            {message.text}
          </div>
        )}

        {!connected && (
          <div style={{ marginBottom: 24, padding: 20, background: '#fff', border: '1px solid #E0D9CF' }}>
            Set your Supabase variables before using the admin panel.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 24, border: '1px solid #E0D9CF' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 18 }}>
              <Field label="Product Name">
                <input value={form.name} onChange={e => updateField('name', e.target.value)} className="input-field" placeholder="Vitamin C Serum" />
              </Field>

              <Field label="Brand">
                <select value={form.brand} onChange={e => updateField('brand', e.target.value)} className="input-field" style={{ appearance: 'none' }}>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.name}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Brand ID">
                <input value={form.brandId} onChange={e => updateField('brandId', e.target.value)} className="input-field" placeholder="dot-n-key" />
              </Field>

              <Field label="Category">
                <select value={form.category} onChange={e => updateField('category', e.target.value)} className="input-field" style={{ appearance: 'none' }}>
                  {categoryOptions.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Price (LKR)">
                <input type="number" value={form.price} onChange={e => updateField('price', e.target.value)} className="input-field" placeholder="1990" />
              </Field>

              <Field label="Original Price (LKR)">
                <input type="number" value={form.originalPrice} onChange={e => updateField('originalPrice', e.target.value)} className="input-field" placeholder="2490" />
              </Field>

              <Field label="Rating">
                <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e => updateField('rating', e.target.value)} className="input-field" placeholder="4.8" />
              </Field>

              <Field label="Reviews">
                <input type="number" value={form.reviews} onChange={e => updateField('reviews', e.target.value)} className="input-field" placeholder="328" />
              </Field>

              <Field label="Main Image URL">
                <input value={form.image} onChange={e => updateField('image', e.target.value)} className="input-field" placeholder="https://...jpg" />
              </Field>

              <Field label="Extra Image URLs (space separated)">
                <input
                  value={form.gallery}
                  onChange={e => updateField('gallery', e.target.value)}
                  className="input-field"
                  placeholder="https://...jpg https://...jpg"
                />
                <span style={{ fontSize: 11, color: '#8A7E72', marginTop: -4 }}>Use spaces between URLs. Commas still work too.</span>
              </Field>

              <Field label="Ingredients">
                <input value={form.ingredients} onChange={e => updateField('ingredients', e.target.value)} className="input-field" placeholder="Vitamin C, Niacinamide" />
              </Field>

              <Field label="Benefits (comma separated)">
                <input value={form.benefits} onChange={e => updateField('benefits', e.target.value)} className="input-field" placeholder="Brightens skin, Hydrates deeply" />
              </Field>

              <Field label="Concern Tags (comma separated)">
                <input value={form.concern} onChange={e => updateField('concern', e.target.value)} className="input-field" placeholder="Brightening, Hydration" />
              </Field>

              <Field label="How to Use">
                <input value={form.howToUse} onChange={e => updateField('howToUse', e.target.value)} className="input-field" placeholder="Apply 2-3 drops in the morning" />
              </Field>
            </div>

            <div style={{ marginTop: 20, marginBottom: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#1C1916', marginBottom: 12 }}>
                <input type="checkbox" checked={form.isNew} onChange={e => updateField('isNew', e.target.checked)} />
                Mark as new arrival
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#1C1916' }}>
                <input type="checkbox" checked={form.inStock} onChange={e => updateField('inStock', e.target.checked)} />
                Product is in stock
              </label>
            </div>

            <div style={{ marginTop: 18, marginBottom: 18 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1C1916', fontWeight: 600 }}>
                Upload product images
              </label>

              <label
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  width: '100%',
                  border: '1.5px dashed #D7C6A6',
                  background: 'linear-gradient(135deg, #FFFDFB 0%, #F8F3EE 100%)',
                  borderRadius: 18,
                  padding: 18,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#1C1916', marginBottom: 4 }}>Upload image + preview</div>
                    <div style={{ fontSize: 12, color: '#8A7E72' }}>PNG, JPG, WEBP up to multiple files</div>
                  </div>
                  <div style={{ padding: '8px 12px', background: '#1C1916', color: '#fff', fontSize: 12, fontWeight: 700, borderRadius: 999 }}>
                    Browse
                  </div>
                </div>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={e => setSelectedFiles(Array.from(e.target.files ?? []))}
                  style={{ display: 'none' }}
                />

                {selectedImagePreviews.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(72px, 1fr))', gap: 10 }}>
                    {selectedImagePreviews.map((item, index) => (
                      <img
                        key={`${item.file.name}-${index}`}
                        src={item.url}
                        alt={`Selected preview ${index + 1}`}
                        style={{ width: '100%', height: 88, objectFit: 'cover', borderRadius: 12, border: '1px solid #E0D9CF' }}
                      />
                    ))}
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: 10 }}>
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={`placeholder-${index}`}
                        style={{
                          aspectRatio: '1',
                          borderRadius: 12,
                          background: '#F5F0EA',
                          border: '1px solid #E0D9CF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#8A7E72',
                          fontSize: 24,
                        }}
                      >
                        +
                      </div>
                    ))}
                  </div>
                )}
              </label>

              {selectedFiles.length > 0 && (
                <div style={{ marginTop: 10, fontSize: 12, color: '#8A7E72' }}>
                  {selectedFiles.length} image(s) ready to upload.
                </div>
              )}
            </div>

            <div style={{ marginTop: 6 }}>
              <RichTextEditor
                value={form.description}
                onChange={value => updateField('description', value)}
                placeholder="Write the product description..."
              />
            </div>

            <div style={{ marginTop: 22, display: 'flex', gap: 12, alignItems: 'center' }}>
              <button type="submit" className="btn-primary" disabled={saving || uploading}>
                {saving ? 'Saving...' : editingId ? 'Update Product' : 'Save Product'}
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={() => {
                  setForm(initialForm)
                  setEditingId(null)
                }}
              >
                Reset Form
              </button>
            </div>
          </form>

          <aside style={{ background: '#fff', border: '1px solid #E0D9CF', padding: 20 }}>
            <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C4A882', fontWeight: 700, marginBottom: 10 }}>
              Inventory summary
            </div>
            <div style={{ fontSize: 42, fontWeight: 700, color: '#1C1916', marginBottom: 8 }}>{productCount}</div>
            <div style={{ color: '#8A7E72', marginBottom: 18 }}>Products in Supabase</div>

            <div style={{ marginBottom: 22, padding: 14, background: '#FAF8F5', border: '1px solid #E0D9CF' }}>
              <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1C1916', fontWeight: 700, marginBottom: 12 }}>
                Live preview
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {previewImages.length > 0 ? (
                  previewImages.map((image, index) => (
                    <img
                      key={`${image}-${index}`}
                      src={image || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=200&q=80'}
                      alt="product preview"
                      style={{ width: 52, height: 52, objectFit: 'cover', border: '1px solid #E0D9CF' }}
                    />
                  ))
                ) : (
                  <div style={{ width: 52, height: 52, background: '#F0ECE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8A7E72' }}>N</div>
                )}
              </div>
              <div style={{ fontWeight: 700, color: '#1C1916', marginBottom: 4 }}>{form.name || 'New product name'}</div>
              <div style={{ fontSize: 12, color: '#8A7E72', marginBottom: 8 }}>{form.brand || 'Brand'}</div>
              <div style={{ fontWeight: 700, color: '#1C1916' }}>{formatCurrency(Number(form.price) || 0)}</div>
            </div>

            <div style={{ display: 'grid', gap: 12, maxHeight: 420, overflowY: 'auto', paddingRight: 4 }}>
              {loading ? (
                <div style={{ color: '#8A7E72' }}>Loading products...</div>
              ) : products.length === 0 ? (
                <div style={{ color: '#8A7E72' }}>No products yet. Add your first product.</div>
              ) : (
                products.map(product => (
                  <div key={product.id} style={{ display: 'flex', gap: 10, alignItems: 'center', borderBottom: '1px solid #F0ECE7', paddingBottom: 10 }}>
                    <img src={product.image || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=200&q=80'} alt={product.name} style={{ width: 54, height: 54, objectFit: 'cover' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, color: '#1C1916', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</div>
                      <div style={{ fontSize: 12, color: '#8A7E72' }}>{product.brand}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                      <div style={{ fontWeight: 700, color: '#1C1916' }}>{formatCurrency(product.price)}</div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button type="button" onClick={() => handleEdit(product)} style={{ fontSize: 11, border: '1px solid #E0D9CF', background: '#fff', cursor: 'pointer', padding: '4px 8px' }}>Edit</button>
                        <button type="button" onClick={() => handleDelete(product.id)} style={{ fontSize: 11, border: '1px solid #d8a0a0', background: '#fff', color: '#8a3f3f', cursor: 'pointer', padding: '4px 8px' }}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1C1916', fontWeight: 600 }}>
        {label}
      </span>
      {children}
    </label>
  )
}
