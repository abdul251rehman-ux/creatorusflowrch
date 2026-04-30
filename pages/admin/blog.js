import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { marked } from 'marked'

const STORAGE_KEY = 'admin_auth'

function slugify(t) {
  return t.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}
function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader()
    r.onload = () => res(r.result.split(',')[1])
    r.onerror = rej
    r.readAsDataURL(file)
  })
}
function fmtNum(n) {
  if (!n) return '0'
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K'
  return String(n)
}
function initFormFromBlog(b) {
  return {
    title: b.title || '',
    slug: b.slug || '',
    excerpt: b.excerpt || '',
    content: b.content || '',
    content_format: b.content_format || 'markdown',
    cover_image: b.cover_image || '',
    cover_image_alt: b.cover_image_alt || '',
    og_image: b.og_image || '',
    author_id: b.author_id || '',
    category_id: b.category_id || '',
    tags: Array.isArray(b.tags) ? b.tags.join(', ') : (b.tags || ''),
    series_name: b.series_name || '',
    series_order: b.series_order != null ? String(b.series_order) : '',
    status: b.status || 'draft',
    is_featured: !!b.is_featured,
    is_premium: !!b.is_premium,
    allow_comments: b.allow_comments !== false,
    scheduled_for: b.scheduled_for ? b.scheduled_for.slice(0, 16) : '',
    language: b.language || 'en',
    seo_title: b.seo_title || '',
    seo_description: b.seo_description || '',
    canonical_url: b.canonical_url || '',
    no_index: !!b.no_index,
  }
}

const STATUS_META = {
  draft:     { label: 'Draft',     color: '#d97706', bg: 'rgba(245,158,11,0.1)',   dot: '#f59e0b' },
  review:    { label: 'Review',    color: '#7c3aed', bg: 'rgba(139,92,246,0.12)',  dot: '#8b5cf6' },
  scheduled: { label: 'Scheduled', color: '#0891b2', bg: 'rgba(6,182,212,0.1)',    dot: '#06b6d4' },
  published: { label: 'Published', color: '#059669', bg: 'rgba(16,185,129,0.1)',   dot: '#10b981' },
  archived:  { label: 'Archived',  color: '#64748b', bg: 'rgba(100,116,139,0.1)',  dot: '#94a3b8' },
}

const EMPTY_FORM = {
  title: '', slug: '', excerpt: '', content: '', content_format: 'markdown',
  cover_image: '', cover_image_alt: '', og_image: '',
  author_id: '', category_id: '',
  tags: '', series_name: '', series_order: '',
  status: 'draft',
  is_featured: false, is_premium: false, allow_comments: true,
  scheduled_for: '', language: 'en',
  seo_title: '', seo_description: '', canonical_url: '', no_index: false,
}

// ─── Icons ────────────────────────────────────────────────────
const IC = {
  lock:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  eye:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  eyeOff:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  file:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  globe:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  pencil:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  trash:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
  external: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  plus:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  logout:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  close:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  upload:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>,
  image:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  check:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  clock:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  tag:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  link:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  alert:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  star:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  starFill: <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  shield:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  chat:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  users:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  search:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  bar:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  list:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
}

function Icon({ name, size = 16, color }) {
  return (
    <span style={{ width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: color || 'currentColor' }}>
      {IC[name]}
    </span>
  )
}

function Spinner({ size = 18, color = '#7B93FF' }) {
  return <span style={{ width: size, height: size, display: 'inline-block', border: `2px solid rgba(123,147,255,0.2)`, borderTopColor: color, borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
}

function Toggle({ checked, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      style={{ width: 46, height: 26, borderRadius: 13, background: checked ? '#7B93FF' : '#cbd5e1', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.25s', flexShrink: 0 }}>
      <span style={{ position: 'absolute', top: 3, left: checked ? 23 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.25s', display: 'block', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
    </button>
  )
}

// ─── PIN Screen ───────────────────────────────────────────────
function PinScreen({ onAuth }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/admin/verify-pin', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pin }),
      })
      const data = await res.json()
      if (data.success) { sessionStorage.setItem(STORAGE_KEY, '1'); onAuth() }
      else { setError('Incorrect PIN. Please try again.'); setPin('') }
    } catch { setError('Something went wrong. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080E1C', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '1.5rem' }}>
      <Head><title>Admin — CreatorFlowUS</title></Head>
      <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,147,255,0.08) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
      <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: 64, height: 64, background: 'rgba(123,147,255,0.12)', border: '1px solid rgba(123,147,255,0.25)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: '#7B93FF' }}>
            <span style={{ width: 30, height: 30 }}>{IC.lock}</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.02em' }}>Admin Access</h1>
          <p style={{ color: '#475569', fontSize: '0.875rem', margin: 0 }}>Enter your PIN to access the dashboard</p>
        </div>
        <form onSubmit={submit} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(123,147,255,0.12)', borderRadius: 20, padding: '1.75rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>PIN Code</label>
            <div style={{ position: 'relative' }}>
              <input
                type={show ? 'text' : 'password'}
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder="••••••••"
                autoFocus
                style={{ width: '100%', padding: '0.875rem 3rem 0.875rem 1.1rem', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: `1.5px solid ${error ? 'rgba(239,68,68,0.5)' : 'rgba(123,147,255,0.18)'}`, color: '#fff', fontSize: '1rem', outline: 'none', letterSpacing: show ? 'normal' : '0.25em', boxSizing: 'border-box' }}
              />
              <button type="button" onClick={() => setShow(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 0, display: 'flex' }}>
                <span style={{ width: 18, height: 18 }}>{show ? IC.eyeOff : IC.eye}</span>
              </button>
            </div>
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f87171', fontSize: '0.8rem', marginTop: 8 }}>
                <span style={{ width: 14, height: 14 }}>{IC.alert}</span>{error}
              </div>
            )}
          </div>
          <button type="submit" disabled={loading || !pin}
            style={{ width: '100%', padding: '0.875rem', borderRadius: 12, background: pin ? '#7B93FF' : 'rgba(123,147,255,0.2)', color: pin ? '#fff' : 'rgba(255,255,255,0.3)', fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: pin && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {loading ? <><Spinner size={16} color="#fff" /> Verifying…</> : 'Enter Dashboard'}
          </button>
        </form>
        <p style={{ textAlign: 'center', color: '#1e293b', fontSize: '0.8rem', marginTop: '1.5rem' }}>CreatorFlowUS &copy; {new Date().getFullYear()}</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

// ─── Blog Panel ───────────────────────────────────────────────
function BlogPanel({ blog, onSave, onClose, isMobile, categories, authors }) {
  const [form, setForm] = useState(blog ? initFormFromBlog(blog) : { ...EMPTY_FORM })
  const [tab, setTab] = useState('content')
  const [preview, setPreview] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [imageTab, setImageTab] = useState('upload')
  const [urlInput, setUrlInput] = useState(blog?.cover_image || '')
  const [urlPreviewOk, setUrlPreviewOk] = useState(!!(blog?.cover_image))
  const fileRef = useRef()

  function set(field, value) {
    setForm(f => {
      const u = { ...f, [field]: value }
      if (field === 'title' && !blog) u.slug = slugify(value)
      return u
    })
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const fileData = await fileToBase64(file)
      const res = await fetch('/api/admin/upload', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, fileType: file.type, fileData }),
      })
      const data = await res.json()
      if (data.url) set('cover_image', data.url)
      else setError(data.error || 'Upload failed')
    } catch { setError('Image upload failed') }
    finally { setUploading(false) }
  }

  async function handleSave() {
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
      setError('Title, slug, and content are required.'); return
    }
    if (form.status === 'scheduled' && !form.scheduled_for) {
      setError('Please set a publish date for scheduled posts.'); return
    }
    setSaving(true); setError('')
    try {
      const tags = form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      await onSave({
        title: form.title.trim(),
        slug: form.slug.trim(),
        excerpt: form.excerpt || null,
        content: form.content,
        content_format: form.content_format || 'markdown',
        cover_image: form.cover_image || null,
        cover_image_alt: form.cover_image_alt || null,
        og_image: form.og_image || null,
        author_id: form.author_id || null,
        category_id: form.category_id || null,
        tags,
        series_name: form.series_name || null,
        series_order: form.series_order ? parseInt(form.series_order) : null,
        status: form.status,
        is_featured: !!form.is_featured,
        is_premium: !!form.is_premium,
        allow_comments: form.allow_comments !== false,
        scheduled_for: form.status === 'scheduled' ? (form.scheduled_for || null) : null,
        language: form.language || 'en',
        seo_title: form.seo_title || null,
        seo_description: form.seo_description || null,
        canonical_url: form.canonical_url || null,
        no_index: !!form.no_index,
      })
    } catch (err) { setError(err.message || 'Failed to save') }
    finally { setSaving(false) }
  }

  const inp = { width: '100%', padding: '0.75rem 1rem', borderRadius: 10, background: '#F8FAFF', border: '1.5px solid rgba(123,147,255,0.18)', color: '#0D1526', fontSize: '0.9375rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s' }
  const lbl = { display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.06em' }
  const sel = { ...inp, appearance: 'none', paddingRight: '2.5rem', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '16px', cursor: 'pointer' }

  const TABS = [
    { key: 'content', label: 'Content', icon: 'pencil' },
    { key: 'media',   label: 'Media',   icon: 'image' },
    { key: 'details', label: 'Details', icon: 'list' },
    { key: 'seo',     label: 'SEO',     icon: 'search' },
  ]

  const sm = STATUS_META[form.status] || STATUS_META.draft

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(8,14,28,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: isMobile ? 'flex-end' : 'flex-start', justifyContent: isMobile ? 'stretch' : 'flex-end' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="adm-panel"
        style={{ width: '100%', maxWidth: isMobile ? '100%' : 720, height: isMobile ? '95dvh' : '100vh', background: '#fff', display: 'flex', flexDirection: 'column', boxShadow: isMobile ? '0 -12px 60px rgba(13,21,38,0.2)' : '-12px 0 60px rgba(13,21,38,0.2)', borderRadius: isMobile ? '20px 20px 0 0' : 0 }}>

        {isMobile && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
            <div style={{ width: 36, height: 4, borderRadius: 9999, background: 'rgba(0,0,0,0.12)' }} />
          </div>
        )}

        {/* Header */}
        <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid rgba(123,147,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(123,147,255,0.08)', border: '1px solid rgba(123,147,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7B93FF' }}>
              <Icon name={blog ? 'pencil' : 'plus'} size={15} />
            </div>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#0D1526', margin: 0 }}>{blog ? 'Edit Post' : 'New Post'}</h2>
              <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: 0 }}>{blog ? `/${blog.slug}` : 'Fill in the details below'}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {tab === 'content' && (
              <button onClick={() => setPreview(p => !p)}
                style={{ padding: '0.375rem 0.75rem', borderRadius: 8, border: '1.5px solid rgba(123,147,255,0.22)', background: preview ? 'rgba(123,147,255,0.08)' : 'transparent', color: '#5B72D9', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Icon name={preview ? 'pencil' : 'eye'} size={13} />
                {!isMobile && (preview ? 'Edit' : 'Preview')}
              </button>
            )}
            <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 8, border: 'none', background: 'rgba(0,0,0,0.05)', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="close" size={15} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(123,147,255,0.1)', background: '#fff', flexShrink: 0 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ flex: 1, padding: isMobile ? '0.6rem 0.25rem' : '0.625rem 1rem', border: 'none', borderBottom: `2.5px solid ${tab === t.key ? '#7B93FF' : 'transparent'}`, background: 'transparent', color: tab === t.key ? '#7B93FF' : '#64748b', fontWeight: tab === t.key ? 700 : 500, fontSize: isMobile ? '0.75rem' : '0.8125rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, transition: 'all 0.15s' }}>
              <Icon name={t.icon} size={13} />{t.label}
            </button>
          ))}
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '1rem' : '1.5rem' }}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: '#fef2f2', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '0.75rem 1rem', color: '#dc2626', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              <Icon name="alert" size={16} color="#dc2626" />{error}
            </div>
          )}

          {/* ── CONTENT TAB ── */}
          {tab === 'content' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={lbl}><Icon name="file" size={12} /> Title <span style={{ color: '#f87171' }}>*</span></label>
                <input style={inp} value={form.title} onChange={e => set('title', e.target.value)} placeholder="Your blog post title…" />
              </div>

              <div>
                <label style={lbl}><Icon name="link" size={12} /> Slug <span style={{ color: '#f87171' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.8rem', pointerEvents: 'none' }}>/blog/</span>
                  <input style={{ ...inp, paddingLeft: 54 }} value={form.slug} onChange={e => set('slug', slugify(e.target.value))} placeholder="url-friendly-slug" />
                </div>
              </div>

              <div>
                <label style={lbl}><Icon name="file" size={12} /> Excerpt</label>
                <textarea style={{ ...inp, resize: 'vertical', minHeight: 72 }} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} placeholder="Short summary for listings and SEO…" />
              </div>

              <div>
                <label style={lbl}><Icon name="pencil" size={12} /> Content (Markdown) <span style={{ color: '#f87171' }}>*</span></label>
                {preview ? (
                  <div style={{ background: '#F8FAFF', border: '1px solid rgba(123,147,255,0.12)', borderRadius: 12, padding: '1.25rem', minHeight: 300 }}>
                    <div className="prose" dangerouslySetInnerHTML={{ __html: marked.parse(form.content || '') }} />
                  </div>
                ) : (
                  <textarea
                    style={{ ...inp, resize: 'vertical', minHeight: isMobile ? 220 : 320, fontFamily: 'ui-monospace, "Cascadia Code", monospace', fontSize: '0.875rem', lineHeight: 1.65 }}
                    value={form.content}
                    onChange={e => set('content', e.target.value)}
                    placeholder={'# Heading\n\nWrite in **markdown**...\n\n- Bullet point\n\n> Blockquote\n\n`inline code`'}
                  />
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {['**bold**', '*italic*', '# H1', '## H2', '- list', '> quote', '`code`'].map(tag => (
                      <code key={tag} style={{ padding: '2px 7px', borderRadius: 5, background: 'rgba(123,147,255,0.07)', border: '1px solid rgba(123,147,255,0.15)', fontSize: '0.72rem', color: '#5B72D9' }}>{tag}</code>
                    ))}
                  </div>
                  {form.content && (
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                      {form.content.trim().split(/\s+/).filter(Boolean).length} words
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── MEDIA TAB ── */}
          {tab === 'media' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {/* Cover Image */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <label style={{ ...lbl, marginBottom: 0 }}><Icon name="image" size={12} /> Cover Image</label>
                  <div style={{ display: 'flex', gap: 3, background: '#F0F4FF', borderRadius: 8, padding: 3, border: '1px solid rgba(123,147,255,0.12)' }}>
                    {[{ key: 'upload', icon: 'upload', label: 'Upload' }, { key: 'url', icon: 'link', label: 'URL' }].map(t => (
                      <button key={t.key} onClick={() => setImageTab(t.key)}
                        style={{ padding: '0.25rem 0.65rem', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: imageTab === t.key ? 700 : 500, background: imageTab === t.key ? '#fff' : 'transparent', color: imageTab === t.key ? '#0D1526' : '#64748b', boxShadow: imageTab === t.key ? '0 1px 4px rgba(13,21,38,0.1)' : 'none', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Icon name={t.icon} size={11} />{t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {form.cover_image && (
                  <div style={{ marginBottom: 10, borderRadius: 12, overflow: 'hidden', position: 'relative', height: 160, border: '1px solid rgba(123,147,255,0.15)' }}>
                    <img src={form.cover_image} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,21,38,0.5) 0%, transparent 50%)', pointerEvents: 'none' }} />
                    <button onClick={() => { set('cover_image', ''); setUrlInput(''); setUrlPreviewOk(false) }}
                      style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(13,21,38,0.75)', color: '#fff', border: 'none', borderRadius: 7, padding: '4px 10px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5, backdropFilter: 'blur(4px)' }}>
                      <Icon name="close" size={12} /> Remove
                    </button>
                  </div>
                )}

                {imageTab === 'upload' && (
                  <div>
                    {!form.cover_image && (
                      <div onClick={() => fileRef.current.click()}
                        style={{ marginBottom: 10, borderRadius: 12, border: '2px dashed rgba(123,147,255,0.2)', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: '#94a3b8', cursor: 'pointer', background: 'rgba(123,147,255,0.02)', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(123,147,255,0.4)'; e.currentTarget.style.background = 'rgba(123,147,255,0.05)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(123,147,255,0.2)'; e.currentTarget.style.background = 'rgba(123,147,255,0.02)' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(123,147,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon name="upload" size={20} color="#7B93FF" />
                        </div>
                        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>Click to upload</p>
                        <p style={{ margin: 0, fontSize: '0.75rem' }}>PNG, JPG, WebP — max 10 MB</p>
                      </div>
                    )}
                    <button onClick={() => fileRef.current.click()} disabled={uploading}
                      style={{ padding: '0.55rem 1.1rem', borderRadius: 8, border: '1.5px solid rgba(123,147,255,0.25)', background: 'rgba(123,147,255,0.04)', color: '#5B72D9', fontSize: '0.8125rem', fontWeight: 700, cursor: uploading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 7, opacity: uploading ? 0.6 : 1 }}>
                      {uploading ? <Spinner size={14} /> : <Icon name="upload" size={14} />}
                      {uploading ? 'Uploading…' : form.cover_image ? 'Replace Image' : 'Upload Image'}
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                  </div>
                )}

                {imageTab === 'url' && (
                  <div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
                      <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><Icon name="link" size={14} /></span>
                        <input style={{ ...inp, paddingLeft: 34 }} type="url" value={urlInput}
                          onChange={e => { setUrlInput(e.target.value); setUrlPreviewOk(false) }}
                          placeholder="https://images.unsplash.com/…" />
                      </div>
                      <button onClick={() => { if (urlPreviewOk) set('cover_image', urlInput) }} disabled={!urlPreviewOk}
                        style={{ padding: '0.75rem 1rem', borderRadius: 10, border: 'none', background: urlPreviewOk ? '#7B93FF' : 'rgba(123,147,255,0.15)', color: urlPreviewOk ? '#fff' : 'rgba(123,147,255,0.4)', fontWeight: 700, fontSize: '0.8125rem', cursor: urlPreviewOk ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s', width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}>
                        <Icon name="check" size={13} /> Use Image
                      </button>
                    </div>
                    {urlInput ? (
                      <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(123,147,255,0.15)', background: '#F8FAFF', minHeight: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <img key={urlInput} src={urlInput} alt=""
                          onLoad={() => setUrlPreviewOk(true)} onError={() => setUrlPreviewOk(false)}
                          style={{ width: '100%', height: 140, objectFit: 'cover', display: urlPreviewOk ? 'block' : 'none' }} />
                        {!urlPreviewOk && (
                          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: '#94a3b8' }}>
                            <Spinner size={18} /><p style={{ margin: 0, fontSize: '0.8125rem' }}>Loading preview…</p>
                          </div>
                        )}
                        {urlPreviewOk && (
                          <div style={{ position: 'absolute', bottom: 8, right: 8 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(16,185,129,0.9)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>
                              <Icon name="check" size={11} /> Ready
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ borderRadius: 10, border: '2px dashed rgba(123,147,255,0.15)', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: '#cbd5e1', background: 'rgba(123,147,255,0.01)' }}>
                        <Icon name="image" size={26} />
                        <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 500, color: '#94a3b8' }}>Paste a URL above to preview</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cover Image Alt */}
              <div>
                <label style={lbl}><Icon name="file" size={12} /> Cover Image Alt Text</label>
                <input style={inp} value={form.cover_image_alt} onChange={e => set('cover_image_alt', e.target.value)} placeholder="Describe the image for screen readers…" />
                <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 4 }}>Improves accessibility and SEO image indexing</p>
              </div>

              {/* OG Image */}
              <div>
                <label style={lbl}><Icon name="image" size={12} /> Open Graph Image <span style={{ color: '#94a3b8', fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: '0.7rem', marginLeft: 4 }}>optional</span></label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><Icon name="link" size={14} /></span>
                  <input style={{ ...inp, paddingLeft: 34 }} type="url" value={form.og_image} onChange={e => set('og_image', e.target.value)} placeholder="https://… (1200×630 recommended)" />
                </div>
                <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 4 }}>Overrides the cover image for Twitter, Facebook, and LinkedIn shares</p>
                {form.og_image && (
                  <div style={{ marginTop: 8, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(123,147,255,0.15)', height: 80 }}>
                    <img src={form.og_image} alt="og preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── DETAILS TAB ── */}
          {tab === 'details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Status */}
              <div>
                <label style={lbl}><Icon name="globe" size={12} /> Status</label>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {Object.entries(STATUS_META).map(([key, meta]) => (
                    <button key={key} type="button" onClick={() => set('status', key)}
                      style={{ padding: '0.375rem 0.875rem', borderRadius: 9999, border: `1.5px solid ${form.status === key ? meta.dot : 'rgba(0,0,0,0.1)'}`, background: form.status === key ? meta.bg : 'transparent', color: form.status === key ? meta.color : '#64748b', fontWeight: form.status === key ? 700 : 500, fontSize: '0.8125rem', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: form.status === key ? meta.dot : '#cbd5e1', flexShrink: 0 }} />
                      {meta.label}
                    </button>
                  ))}
                </div>
                {form.status === 'scheduled' && (
                  <div style={{ marginTop: 10 }}>
                    <label style={{ ...lbl, marginBottom: 5 }}><Icon name="calendar" size={12} /> Scheduled Publish Date <span style={{ color: '#f87171' }}>*</span></label>
                    <input type="datetime-local" style={{ ...inp, colorScheme: 'light' }} value={form.scheduled_for} onChange={e => set('scheduled_for', e.target.value)} min={new Date().toISOString().slice(0, 16)} />
                  </div>
                )}
              </div>

              {/* Category */}
              <div>
                <label style={lbl}><Icon name="globe" size={12} /> Category</label>
                {form.category_id && (() => {
                  const cat = categories.find(c => c.id === form.category_id)
                  return cat ? (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.25rem 0.75rem', borderRadius: 9999, fontSize: '0.8125rem', fontWeight: 600, color: cat.color, background: cat.color + '18', border: `1px solid ${cat.color}35`, marginBottom: 8 }}>
                      {cat.icon} {cat.name}
                    </div>
                  ) : null
                })()}
                <select style={sel} value={form.category_id} onChange={e => set('category_id', e.target.value)}>
                  <option value="">Select a category…</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
              </div>

              {/* Author */}
              <div>
                <label style={lbl}><Icon name="users" size={12} /> Author</label>
                <select style={sel} value={form.author_id} onChange={e => set('author_id', e.target.value)}>
                  <option value="">Select an author…</option>
                  {authors.map(a => <option key={a.id} value={a.id}>{a.name} — {a.role}</option>)}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label style={lbl}><Icon name="tag" size={12} /> Tags</label>
                <input style={inp} value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="tiktok, growth, monetisation" />
                {form.tags && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
                    {form.tags.split(',').map(t => t.trim()).filter(Boolean).map(t => (
                      <span key={t} style={{ padding: '2px 10px', borderRadius: 9999, background: 'rgba(123,147,255,0.08)', border: '1px solid rgba(123,147,255,0.18)', color: '#5B72D9', fontSize: '0.75rem', fontWeight: 600 }}>{t}</span>
                    ))}
                  </div>
                )}
                <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 5 }}>Comma separated</p>
              </div>

              {/* Series */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.875rem' }}>
                <div>
                  <label style={lbl}><Icon name="list" size={12} /> Series Name</label>
                  <input style={inp} value={form.series_name} onChange={e => set('series_name', e.target.value)} placeholder="e.g. TikTok Masterclass" />
                </div>
                <div>
                  <label style={lbl}><Icon name="list" size={12} /> Part #</label>
                  <input style={inp} type="number" min="1" value={form.series_order} onChange={e => set('series_order', e.target.value)} placeholder="1" />
                </div>
              </div>

              {/* Language */}
              <div>
                <label style={lbl}><Icon name="globe" size={12} /> Language</label>
                <select style={sel} value={form.language} onChange={e => set('language', e.target.value)}>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="pt">Portuguese</option>
                  <option value="it">Italian</option>
                </select>
              </div>

              {/* Toggles */}
              <div style={{ background: '#F8FAFF', borderRadius: 14, border: '1px solid rgba(123,147,255,0.12)', overflow: 'hidden' }}>
                {[
                  { key: 'is_featured', label: 'Featured Post',    desc: 'Highlighted in the featured section on the blog', icon: 'star',   color: '#f59e0b' },
                  { key: 'is_premium',  label: 'Premium Content',  desc: 'Gated — visible to subscribers only',             icon: 'shield', color: '#8b5cf6' },
                  { key: 'allow_comments', label: 'Allow Comments', desc: 'Let readers leave comments on this post',        icon: 'chat',   color: '#10b981' },
                ].map((item, i) => (
                  <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', borderBottom: i < 2 ? '1px solid rgba(123,147,255,0.08)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 9, background: form[item.key] ? item.color + '18' : 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: form[item.key] ? item.color : '#94a3b8', transition: 'all 0.2s', flexShrink: 0 }}>
                        <Icon name={item.icon} size={15} />
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0D1526', margin: 0 }}>{item.label}</p>
                        <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>{item.desc}</p>
                      </div>
                    </div>
                    <Toggle checked={!!form[item.key]} onChange={v => set(item.key, v)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SEO TAB ── */}
          {tab === 'seo' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: 'rgba(123,147,255,0.05)', border: '1px solid rgba(123,147,255,0.12)', borderRadius: 12, padding: '0.875rem 1rem', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <Icon name="search" size={16} color="#7B93FF" />
                <p style={{ margin: 0, fontSize: '0.8125rem', color: '#475569', lineHeight: 1.5 }}>
                  SEO fields override the title and excerpt in search results. Leave blank to use post defaults.
                </p>
              </div>

              {/* SEO Title */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                  <label style={{ ...lbl, marginBottom: 0 }}><Icon name="search" size={12} /> SEO Title</label>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: form.seo_title.length > 60 ? '#ef4444' : form.seo_title.length >= 50 ? '#10b981' : '#94a3b8' }}>
                    {form.seo_title.length}/60
                  </span>
                </div>
                <input style={inp} value={form.seo_title} onChange={e => set('seo_title', e.target.value)} placeholder="Overrides title in browser tab & Google" maxLength={80} />
              </div>

              {/* Meta Description */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                  <label style={{ ...lbl, marginBottom: 0 }}><Icon name="file" size={12} /> Meta Description</label>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: form.seo_description.length > 160 ? '#ef4444' : form.seo_description.length >= 150 ? '#10b981' : '#94a3b8' }}>
                    {form.seo_description.length}/160
                  </span>
                </div>
                <textarea style={{ ...inp, minHeight: 88, resize: 'vertical' }} value={form.seo_description} onChange={e => set('seo_description', e.target.value)} placeholder="Shown in Google search results…" maxLength={200} />
              </div>

              {/* Canonical URL */}
              <div>
                <label style={lbl}><Icon name="link" size={12} /> Canonical URL</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><Icon name="link" size={14} /></span>
                  <input style={{ ...inp, paddingLeft: 34 }} type="url" value={form.canonical_url} onChange={e => set('canonical_url', e.target.value)} placeholder="https://original-source.com/post-slug" />
                </div>
                <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 4 }}>For syndicated or cross-posted content</p>
              </div>

              {/* No Index */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', background: form.no_index ? 'rgba(239,68,68,0.04)' : '#F8FAFF', borderRadius: 12, border: `1px solid ${form.no_index ? 'rgba(239,68,68,0.18)' : 'rgba(123,147,255,0.12)'}`, transition: 'all 0.2s' }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0D1526', margin: 0 }}>Hide from Search Engines</p>
                  <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>Adds noindex — Google won't index this post</p>
                </div>
                <Toggle checked={!!form.no_index} onChange={v => set('no_index', v)} />
              </div>

              {/* Google Preview */}
              {(form.title || form.seo_title) && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Google Preview</label>
                  <div style={{ border: '1px solid rgba(0,0,0,0.12)', borderRadius: 10, padding: '1rem', background: '#fff', fontFamily: 'Arial, sans-serif', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <p style={{ fontSize: '0.7rem', color: '#202124', opacity: 0.6, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      creatorflowus.com › blog › {form.slug || 'post-slug'}
                    </p>
                    <p style={{ fontSize: '1.05rem', color: '#1a0dab', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {form.seo_title || form.title || 'Post Title'}
                    </p>
                    <p style={{ fontSize: '0.8125rem', color: '#4d5156', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                      {form.seo_description || form.excerpt || 'No description. Add a meta description or excerpt to show here.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid rgba(123,147,255,0.1)', display: 'flex', gap: 10, alignItems: 'center', background: '#fff', flexShrink: 0 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0.3rem 0.75rem', borderRadius: 9999, fontSize: '0.78rem', fontWeight: 700, background: sm.bg, color: sm.color, flex: 1 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: sm.dot }} />
            {sm.label}
          </span>
          <button onClick={onClose} style={{ padding: '0.7rem 1.125rem', borderRadius: 10, border: '1.5px solid rgba(123,147,255,0.22)', background: 'transparent', color: '#5B72D9', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            style={{ padding: '0.7rem 1.5rem', borderRadius: 10, background: saving ? 'rgba(123,147,255,0.6)' : '#7B93FF', color: '#fff', fontWeight: 700, fontSize: '0.875rem', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: saving ? 'none' : '0 4px 14px rgba(123,147,255,0.3)', transition: 'all 0.2s' }}>
            {saving ? <><Spinner size={14} color="#fff" /> Saving…</> : <><Icon name="check" size={14} /> {blog ? 'Update Post' : 'Save Post'}</>}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────
export default function AdminBlog() {
  const [authed, setAuthed] = useState(false)
  const [blogs, setBlogs] = useState([])
  const [categories, setCategories] = useState([])
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [toast, setToast] = useState({ msg: '', type: 'success' })
  const [filter, setFilter] = useState('all')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) setAuthed(true)
    else setLoading(false)
  }, [])

  useEffect(() => {
    if (authed) { fetchBlogs(); fetchCategories(); fetchAuthors() }
  }, [authed])

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3500)
  }

  async function fetchBlogs() {
    setLoading(true)
    const res = await fetch('/api/admin/blogs')
    const data = await res.json()
    setBlogs(Array.isArray(data) ? data : [])
    setLoading(false)
  }
  async function fetchCategories() {
    try { const res = await fetch('/api/admin/categories'); const d = await res.json(); setCategories(Array.isArray(d) ? d : []) } catch {}
  }
  async function fetchAuthors() {
    try { const res = await fetch('/api/admin/authors'); const d = await res.json(); setAuthors(Array.isArray(d) ? d : []) } catch {}
  }

  async function handleSave(form) {
    const isEdit = modal && modal !== 'new'
    const url = isEdit ? `/api/admin/blogs/${modal.id}` : '/api/admin/blogs'
    const res = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Save failed')
    setModal(null); fetchBlogs()
    showToast(isEdit ? 'Post updated!' : 'Post created!')
  }

  async function handleDelete(id) {
    await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' })
    setDeleteId(null); fetchBlogs()
    showToast('Post permanently deleted.', 'error')
  }

  async function toggleStatus(blog) {
    const newStatus = blog.status === 'published' ? 'draft' : 'published'
    await fetch(`/api/admin/blogs/${blog.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) })
    fetchBlogs()
    showToast(newStatus === 'published' ? 'Post is now live!' : 'Post moved to drafts.')
  }

  async function toggleFeatured(blog) {
    await fetch(`/api/admin/blogs/${blog.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_featured: !blog.is_featured }) })
    fetchBlogs()
    showToast(blog.is_featured ? 'Removed from featured.' : 'Post marked as featured!')
  }

  function logout() { sessionStorage.removeItem(STORAGE_KEY); setAuthed(false) }

  if (!authed) return <PinScreen onAuth={() => setAuthed(true)} />

  const publishedCount  = blogs.filter(b => b.status === 'published').length
  const draftCount      = blogs.filter(b => b.status === 'draft').length
  const scheduledCount  = blogs.filter(b => b.status === 'scheduled').length
  const archivedCount   = blogs.filter(b => b.status === 'archived').length
  const totalViews      = blogs.reduce((s, b) => s + (b.view_count || 0), 0)
  const featuredCount   = blogs.filter(b => b.is_featured).length

  const stats = [
    { label: 'Total Posts', value: blogs.length,        icon: 'file',     color: '#7B93FF', bg: 'rgba(123,147,255,0.1)', border: 'rgba(123,147,255,0.2)' },
    { label: 'Published',   value: publishedCount,      icon: 'globe',    color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.2)' },
    { label: 'Drafts',      value: draftCount,          icon: 'pencil',   color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
    { label: 'Scheduled',   value: scheduledCount,      icon: 'calendar', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)',  border: 'rgba(6,182,212,0.2)' },
    { label: 'Total Views', value: fmtNum(totalViews),  icon: 'bar',      color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)' },
    { label: 'Featured',    value: featuredCount,       icon: 'star',     color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.2)' },
  ]

  const FILTERS = [
    { key: 'all',       label: 'All',       count: blogs.length },
    { key: 'published', label: 'Published', count: publishedCount },
    { key: 'draft',     label: 'Draft',     count: draftCount },
    { key: 'scheduled', label: 'Scheduled', count: scheduledCount },
    { key: 'archived',  label: 'Archived',  count: archivedCount },
  ]

  const filtered = filter === 'all' ? blogs : blogs.filter(b => b.status === filter)

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Head><title>Blog Admin — CreatorFlowUS</title></Head>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes fadeSlideUp { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes slideUp { from { transform:translateY(100%) } to { transform:translateY(0) } }
        .adm-row:hover td { background: #F5F7FF; }
        .icon-btn { display:flex; align-items:center; justify-content:center; border:none; cursor:pointer; transition:all 0.15s; }
        .icon-btn:hover { transform:translateY(-1px); }
        .adm-panel { animation: ${isMobile ? 'slideUp 0.3s ease' : 'none'}; }
      `}</style>

      {/* Header */}
      <header style={{ background: '#0D1526', padding: isMobile ? '0 1rem' : '0 1.5rem', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40, borderBottom: '1px solid rgba(123,147,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'rgba(123,147,255,0.15)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7B93FF', flexShrink: 0 }}>
            <Icon name="file" size={15} />
          </div>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>CreatorFlowUS</span>
          {!isMobile && <><span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span><span style={{ color: '#64748b', fontSize: '0.8125rem', fontWeight: 500 }}>Blog Admin</span></>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <a href="/blog" target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#64748b', fontSize: '0.8125rem', textDecoration: 'none', padding: isMobile ? '0.4rem 0.6rem' : '0.4rem 0.85rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }}>
            <Icon name="external" size={13} />{!isMobile && 'View Blog'}
          </a>
          <button onClick={logout}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: isMobile ? '0.4rem 0.6rem' : '0.4rem 0.85rem', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b', fontSize: '0.8125rem', cursor: 'pointer', fontWeight: 500 }}>
            <Icon name="logout" size={13} />{!isMobile && 'Logout'}
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '1rem' : '2rem 1.5rem' }}>
        {/* Title + CTA */}
        <div style={{ display: 'flex', alignItems: isMobile ? 'stretch' : 'flex-start', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '0.875rem' }}>
          <div>
            <h1 style={{ fontSize: isMobile ? '1.375rem' : '1.625rem', fontWeight: 800, color: '#0D1526', margin: '0 0 3px', letterSpacing: '-0.02em' }}>Blog Manager</h1>
            <p style={{ color: '#64748b', fontSize: '0.8125rem', margin: 0 }}>Write, publish, and manage all your content</p>
          </div>
          <button onClick={() => setModal('new')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0.7rem 1.5rem', borderRadius: 11, background: '#7B93FF', color: '#fff', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(123,147,255,0.35)', width: isMobile ? '100%' : 'auto', flexShrink: 0 }}>
            <Icon name="plus" size={16} /> New Post
          </button>
        </div>

        {/* Stats — auto-responsive grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: '0.875rem', marginBottom: '1.5rem' }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 14, padding: '1.125rem', border: '1px solid rgba(123,147,255,0.12)', boxShadow: '0 2px 10px rgba(13,21,38,0.05)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: s.bg, border: `1px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>
                <Icon name={s.icon} size={18} color={s.color} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0D1526', lineHeight: 1.1 }}>{s.value}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2, fontWeight: 500 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Posts card */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(123,147,255,0.12)', boxShadow: '0 2px 12px rgba(13,21,38,0.05)', overflow: 'hidden' }}>

          {/* Toolbar */}
          <div style={{ padding: isMobile ? '0.875rem 1rem' : '1rem 1.25rem', borderBottom: '1px solid rgba(123,147,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.625rem' }}>
            <div style={{ display: 'flex', gap: 2, background: '#F8FAFF', borderRadius: 9, padding: 3, border: '1px solid rgba(123,147,255,0.12)', flexWrap: 'wrap' }}>
              {FILTERS.map(t => (
                <button key={t.key} onClick={() => setFilter(t.key)}
                  style={{ padding: isMobile ? '0.28rem 0.5rem' : '0.35rem 0.7rem', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: isMobile ? '0.72rem' : '0.78125rem', fontWeight: filter === t.key ? 700 : 500, background: filter === t.key ? '#fff' : 'transparent', color: filter === t.key ? '#0D1526' : '#64748b', boxShadow: filter === t.key ? '0 1px 4px rgba(13,21,38,0.1)' : 'none', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
                  {t.label}
                  <span style={{ padding: '1px 5px', borderRadius: 9999, background: filter === t.key ? 'rgba(123,147,255,0.1)' : 'rgba(0,0,0,0.05)', fontSize: '0.65rem', fontWeight: 700, color: filter === t.key ? '#5B72D9' : '#94a3b8' }}>{t.count}</span>
                </button>
              ))}
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.78rem', margin: 0, whiteSpace: 'nowrap' }}>{filtered.length} {filtered.length === 1 ? 'post' : 'posts'}</p>
          </div>

          {loading ? (
            <div style={{ padding: '3.5rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#94a3b8', fontSize: '0.9rem' }}>
              <Spinner /> Loading posts…
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(123,147,255,0.07)', border: '1px solid rgba(123,147,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#94a3b8' }}>
                <Icon name="file" size={24} />
              </div>
              <h3 style={{ fontWeight: 700, color: '#0D1526', marginBottom: 6, fontSize: '1rem' }}>{filter === 'all' ? 'No posts yet' : `No ${filter} posts`}</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                {filter === 'all' ? 'Create your first blog post to get started.' : `No ${filter} posts found.`}
              </p>
              {filter === 'all' && (
                <button onClick={() => setModal('new')} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '0.65rem 1.25rem', borderRadius: 10, background: '#7B93FF', color: '#fff', fontWeight: 700, fontSize: '0.875rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(123,147,255,0.3)' }}>
                  <Icon name="plus" size={14} /> Create First Post
                </button>
              )}
            </div>

          ) : isMobile ? (
            /* ── Mobile cards ── */
            <div>
              {filtered.map((blog, i) => {
                const cat = blog.categories
                const sm = STATUS_META[blog.status] || STATUS_META.draft
                return (
                  <div key={blog.id} style={{ padding: '0.875rem 1rem', borderBottom: i < filtered.length - 1 ? '1px solid rgba(123,147,255,0.07)' : 'none' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ width: 52, height: 52, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: 'rgba(123,147,255,0.06)', border: '1px solid rgba(123,147,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', position: 'relative' }}>
                        {blog.cover_image ? <img src={blog.cover_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Icon name="image" size={18} />}
                        {blog.is_featured && <span style={{ position: 'absolute', top: 2, right: 3, color: '#f59e0b', fontSize: '0.7rem', lineHeight: 1 }}>★</span>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 700, color: '#0D1526', margin: 0, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{blog.title}</p>
                        <p style={{ color: '#94a3b8', fontSize: '0.68rem', margin: '2px 0 6px', fontFamily: 'ui-monospace, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>/blog/{blog.slug}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 5 }}>
                          <button onClick={() => toggleStatus(blog)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '0.2rem 0.6rem', borderRadius: 9999, border: 'none', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, background: sm.bg, color: sm.color }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: sm.dot, flexShrink: 0 }} />{sm.label}
                          </button>
                          {cat && (
                            <span style={{ padding: '0.18rem 0.55rem', borderRadius: 9999, fontSize: '0.68rem', fontWeight: 600, color: cat.color, background: cat.color + '18', border: `1px solid ${cat.color}30` }}>
                              {cat.icon} {cat.name}
                            </span>
                          )}
                          <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                            {new Date(blog.published_at || blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          {blog.view_count > 0 && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#94a3b8', fontSize: '0.7rem' }}>
                              <Icon name="bar" size={10} />{fmtNum(blog.view_count)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                        <button onClick={() => setModal(blog)} className="icon-btn"
                          style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid rgba(123,147,255,0.2)', background: 'transparent', color: '#5B72D9' }}>
                          <Icon name="pencil" size={13} />
                        </button>
                        <button onClick={() => setDeleteId(blog.id)} className="icon-btn"
                          style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid rgba(239,68,68,0.2)', background: 'transparent', color: '#f87171' }}>
                          <Icon name="trash" size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

          ) : (
            /* ── Desktop table ── */
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
                <thead>
                  <tr style={{ background: '#FAFBFF', borderBottom: '1px solid rgba(123,147,255,0.1)' }}>
                    {['Post', 'Category', 'Status', 'Views', '★', 'Date', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((blog, i) => {
                    const cat = blog.categories
                    const sm = STATUS_META[blog.status] || STATUS_META.draft
                    return (
                      <tr key={blog.id} className="adm-row" style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(123,147,255,0.07)' : 'none' }}>
                        <td style={{ padding: '1rem 1.25rem', maxWidth: 280 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 46, height: 46, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: 'rgba(123,147,255,0.06)', border: '1px solid rgba(123,147,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                              {blog.cover_image ? <img src={blog.cover_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Icon name="image" size={18} />}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <p style={{ fontWeight: 700, color: '#0D1526', margin: 0, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{blog.title}</p>
                              <p style={{ color: '#94a3b8', fontSize: '0.7rem', margin: '2px 0 0', fontFamily: 'ui-monospace, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>/blog/{blog.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          {cat ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.2rem 0.65rem', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600, color: cat.color, background: cat.color + '18', border: `1px solid ${cat.color}30`, whiteSpace: 'nowrap' }}>
                              {cat.icon} {cat.name}
                            </span>
                          ) : <span style={{ color: '#e2e8f0' }}>—</span>}
                        </td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <button onClick={() => toggleStatus(blog)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.28rem 0.75rem', borderRadius: 9999, border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, background: sm.bg, color: sm.color, whiteSpace: 'nowrap' }}
                            title={blog.status === 'published' ? 'Click to unpublish' : 'Click to publish'}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: sm.dot, flexShrink: 0 }} />{sm.label}
                          </button>
                        </td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: blog.view_count > 0 ? '#64748b' : '#cbd5e1', fontSize: '0.8125rem' }}>
                            <Icon name="bar" size={13} color={blog.view_count > 0 ? '#94a3b8' : '#e2e8f0'} />{fmtNum(blog.view_count || 0)}
                          </div>
                        </td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <button onClick={() => toggleFeatured(blog)} className="icon-btn"
                            style={{ width: 30, height: 30, borderRadius: 7, border: 'none', background: blog.is_featured ? 'rgba(245,158,11,0.1)' : 'rgba(0,0,0,0.04)', color: blog.is_featured ? '#f59e0b' : '#cbd5e1' }}
                            title={blog.is_featured ? 'Remove from featured' : 'Mark as featured'}>
                            <Icon name={blog.is_featured ? 'starFill' : 'star'} size={14} />
                          </button>
                        </td>
                        <td style={{ padding: '1rem 1.25rem', color: '#64748b', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                          {new Date(blog.published_at || blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <a href={`/blog/${blog.slug}`} target="_blank" rel="noreferrer" className="icon-btn"
                              style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid rgba(123,147,255,0.2)', background: 'transparent', color: '#94a3b8', textDecoration: 'none' }} title="View post">
                              <Icon name="external" size={13} />
                            </a>
                            <button onClick={() => setModal(blog)} className="icon-btn"
                              style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid rgba(123,147,255,0.2)', background: 'transparent', color: '#5B72D9' }} title="Edit">
                              <Icon name="pencil" size={13} />
                            </button>
                            <button onClick={() => setDeleteId(blog.id)} className="icon-btn"
                              style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid rgba(239,68,68,0.2)', background: 'transparent', color: '#f87171' }} title="Delete">
                              <Icon name="trash" size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Create/Edit Panel */}
      {modal && (
        <BlogPanel
          blog={modal === 'new' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
          isMobile={isMobile}
          categories={categories}
          authors={authors}
        />
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(8,14,28,0.7)', backdropFilter: 'blur(6px)' }}>
          <div style={{ background: '#fff', borderRadius: 18, padding: '1.75rem', maxWidth: 400, width: '100%', boxShadow: '0 24px 80px rgba(13,21,38,0.25)', animation: 'fadeSlideUp 0.2s ease' }}>
            <div style={{ width: 48, height: 48, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Icon name="trash" size={20} color="#dc2626" />
            </div>
            <h3 style={{ fontWeight: 800, color: '#0D1526', marginBottom: 6, fontSize: '1.05rem' }}>Delete this post?</h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>This is permanent and cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: '0.7rem', borderRadius: 10, border: '1.5px solid rgba(123,147,255,0.22)', background: 'transparent', color: '#5B72D9', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} style={{ flex: 1, padding: '0.7rem', borderRadius: 10, background: '#dc2626', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                <Icon name="trash" size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.msg && (
        <div style={{ position: 'fixed', bottom: 24, left: isMobile ? 16 : '50%', right: isMobile ? 16 : 'auto', transform: isMobile ? 'none' : 'translateX(-50%)', background: toast.type === 'error' ? '#1a0a0a' : '#0D1526', color: '#fff', padding: '0.75rem 1.125rem', borderRadius: 12, fontSize: '0.875rem', fontWeight: 600, boxShadow: '0 8px 30px rgba(0,0,0,0.35)', zIndex: 70, display: 'flex', alignItems: 'center', gap: 10, animation: 'fadeSlideUp 0.2s ease', borderLeft: `3px solid ${toast.type === 'error' ? '#ef4444' : '#10b981'}` }}>
          <span style={{ width: 18, height: 18, borderRadius: '50%', background: toast.type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: toast.type === 'error' ? '#f87171' : '#10b981', flexShrink: 0 }}>
            <Icon name={toast.type === 'error' ? 'trash' : 'check'} size={11} />
          </span>
          {toast.msg}
        </div>
      )}
    </div>
  )
}
