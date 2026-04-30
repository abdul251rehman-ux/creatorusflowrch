import Head from 'next/head'
import Link from 'next/link'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabase'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogIndex({ blogs }) {
  return (
    <Layout
      title="Blog | CreatorFlowUS"
      description="Tips, strategies, and insights on social media growth, content creation, and digital marketing from the CreatorFlowUS team."
    >
      {/* ── Hero ── */}
      <section className="hero-section section-padding relative" style={{ minHeight: '44vh', display: 'flex', alignItems: 'center' }}>
        <div className="orb orb-primary animate-float" style={{ width: 500, height: 500, top: '-20%', right: '-5%', opacity: 0.5 }} />
        <div className="orb orb-neutral animate-float-slow" style={{ width: 400, height: 400, bottom: '-20%', left: '-10%', opacity: 0.4 }} />
        <div className="container-custom relative z-10 w-full">
          <div className="text-center max-w-3xl mx-auto animate-on-scroll">
            <span className="badge mb-5">Our Blog</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
              Insights to Grow Your{' '}
              <span className="accent-text">Social Presence</span>
            </h1>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed">
              Expert strategies, platform updates, and actionable tips to help creators and brands thrive on social media.
            </p>
          </div>
        </div>
      </section>

      {/* ── Blog Grid ── */}
      <section className="section-alt section-padding">
        <div className="container-custom">
          {blogs.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(123,147,255,0.08)', border: '1px solid rgba(123,147,255,0.18)' }}>
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6m-6-4h6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No posts yet</h3>
              <p className="text-slate-500">Check back soon — great content is on the way.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {blogs.map((blog, i) => {
                const cat = blog.categories
                return (
                  <Link key={blog.id} href={`/blog/${blog.slug}`} className="card group block" style={{ transitionDelay: `${i * 60}ms`, padding: 0, overflow: 'hidden' }}>
                    {/* Cover image */}
                    <div className="w-full overflow-hidden relative" style={{ height: 200, background: 'rgba(123,147,255,0.06)' }}>
                      {blog.cover_image ? (
                        <img
                          src={blog.cover_image}
                          alt={blog.cover_image_alt || blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      {blog.is_featured && (
                        <span style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(249,115,22,0.9)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 9999, backdropFilter: 'blur(4px)' }}>
                          ★ Featured
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        {cat ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.2rem 0.65rem', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600, color: cat.color, background: cat.color + '18', border: `1px solid ${cat.color}30` }}>
                            {cat.icon} {cat.name}
                          </span>
                        ) : null}
                        {blog.read_time && (
                          <span className="text-xs text-slate-400">{blog.read_time} min read</span>
                        )}
                      </div>
                      <h2 className="text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-[#7B93FF] transition-colors line-clamp-2">
                        {blog.title}
                      </h2>
                      {blog.excerpt && (
                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-4">{blog.excerpt}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">{formatDate(blog.published_at || blog.created_at)}</span>
                        <span className="text-sm font-semibold text-[#7B93FF] flex items-center gap-1">
                          Read more
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const { data: blogs } = await supabase
    .from('blogs')
    .select('id, title, slug, excerpt, cover_image, cover_image_alt, read_time, published_at, created_at, is_featured, categories(id,name,slug,color,icon)')
    .eq('published', true)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  return {
    props: { blogs: blogs || [] },
    revalidate: 60,
  }
}
