import Link from 'next/link'
import Head from 'next/head'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabase'
import { marked } from 'marked'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogPost({ blog }) {
  const cat = blog.categories
  const author = blog.authors

  return (
    <Layout
      title={blog.seo_title || `${blog.title} | CreatorFlowUS Blog`}
      description={blog.seo_description || blog.excerpt || blog.title}
    >
      {/* Extra meta for OG image + canonical */}
      <Head>
        {blog.og_image && <meta property="og:image" content={blog.og_image} />}
        {blog.cover_image && !blog.og_image && <meta property="og:image" content={blog.cover_image} />}
        {blog.canonical_url && <link rel="canonical" href={blog.canonical_url} />}
        {blog.no_index && <meta name="robots" content="noindex" />}
      </Head>

      {/* ── Cover Hero ── */}
      <section className="relative overflow-hidden" style={{ background: '#0D1526', minHeight: 360 }}>
        {blog.cover_image && (
          <img
            src={blog.cover_image}
            alt={blog.cover_image_alt || blog.title}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(13,21,38,0.5) 0%, rgba(13,21,38,0.85) 100%)' }} />

        <div className="relative z-10 container-custom section-padding flex flex-col justify-end" style={{ minHeight: 360 }}>
          <Link href="/blog" className="inline-flex items-center gap-2 text-slate-300 hover:text-white text-sm mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Blog
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            {cat && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '0.25rem 0.75rem', borderRadius: 9999, fontSize: '0.8125rem', fontWeight: 600, color: cat.color, background: cat.color + '22', border: `1px solid ${cat.color}40` }}>
                {cat.icon} {cat.name}
              </span>
            )}
            {blog.read_time && (
              <span className="text-slate-400 text-sm">{blog.read_time} min read</span>
            )}
            {blog.is_featured && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.2rem 0.65rem', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 700, color: '#f97316', background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)' }}>
                ★ Featured
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4" style={{ maxWidth: 820 }}>
            {blog.title}
          </h1>

          <div className="flex items-center gap-3 text-slate-400 text-sm flex-wrap">
            {author?.avatar_url && (
              <img src={author.avatar_url} alt={author.name} className="w-7 h-7 rounded-full object-cover" />
            )}
            <span>By {author?.name || 'CreatorFlowUS Team'}</span>
            {author?.role && author.role !== 'Author' && (
              <span style={{ padding: '1px 8px', borderRadius: 9999, background: 'rgba(123,147,255,0.15)', color: '#A8B8FF', fontSize: '0.72rem', fontWeight: 600 }}>{author.role}</span>
            )}
            <span>·</span>
            <span>{formatDate(blog.published_at || blog.created_at)}</span>
            {blog.word_count > 0 && (
              <><span>·</span><span>{blog.word_count.toLocaleString()} words</span></>
            )}
          </div>

          {/* Series indicator */}
          {blog.series_name && (
            <div className="mt-4">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '0.25rem 0.75rem', borderRadius: 9999, fontSize: '0.78rem', fontWeight: 600, color: '#A8B8FF', background: 'rgba(123,147,255,0.12)', border: '1px solid rgba(123,147,255,0.25)' }}>
                {blog.series_name}{blog.series_order ? ` — Part ${blog.series_order}` : ''}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ── Content ── */}
      <section className="section-alt section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <article
              className="prose"
              dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
            />

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-10 pt-8 border-t border-slate-200">
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map(tag => (
                    <span key={tag} className="badge" style={{ fontSize: '0.75rem' }}>{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Author bio */}
            {author?.bio && (
              <div className="mt-10 pt-8 border-t border-slate-200">
                <div className="flex items-start gap-4 p-5 rounded-2xl" style={{ background: 'rgba(123,147,255,0.04)', border: '1px solid rgba(123,147,255,0.12)' }}>
                  {author.avatar_url && (
                    <img src={author.avatar_url} alt={author.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-bold text-slate-900 text-sm mb-1">{author.name}</p>
                    {author.role && <p className="text-xs text-[#7B93FF] font-semibold mb-2">{author.role}</p>}
                    <p className="text-slate-500 text-sm leading-relaxed">{author.bio}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Back CTA */}
            <div className="mt-10 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <Link href="/blog" className="btn-secondary" style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}>
                ← All Articles
              </Link>
              <Link href="/contact" className="btn-primary" style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}>
                Work With Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  const { data: blog } = await supabase
    .from('blogs')
    .select('*, categories(id,name,slug,color,icon), authors(id,name,slug,avatar_url,bio,role)')
    .eq('slug', params.slug)
    .eq('published', true)
    .eq('status', 'published')
    .single()

  if (!blog) return { notFound: true }

  blog.contentHtml = marked.parse(blog.content || '')

  return {
    props: { blog },
    revalidate: 60,
  }
}

export async function getStaticPaths() {
  const { data: blogs } = await supabase
    .from('blogs')
    .select('slug')
    .eq('published', true)
    .eq('status', 'published')

  return {
    paths: (blogs || []).map(b => ({ params: { slug: b.slug } })),
    fallback: 'blocking',
  }
}
