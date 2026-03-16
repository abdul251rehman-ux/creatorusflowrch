import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

const services = [
  {
    name: 'TikTok',
    brandColor: '#EE1D52',
    color: 'from-pink-500 to-red-500',
    iconBg: 'rgba(236,72,153,0.1)',
    iconBorder: 'rgba(236,72,153,0.25)',
    shadow: 'rgba(236,72,153,0.18)',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
    shortDesc: 'Viral content creation & growth hacks',
    details: 'Our TikTok experts craft engaging short-form videos, optimise hashtags, and implement growth strategies to skyrocket your follower count. We handle scheduling, trend analysis, and monetisation through live gifts and brand partnerships.',
  },
  {
    name: 'YouTube',
    brandColor: '#FF0000',
    color: 'from-red-500 to-red-700',
    iconBg: 'rgba(239,68,68,0.1)',
    iconBorder: 'rgba(239,68,68,0.25)',
    shadow: 'rgba(239,68,68,0.18)',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    shortDesc: 'Channel optimisation & monetisation',
    details: 'From thumbnail design to SEO optimisation, we transform your YouTube channel into a revenue-generating machine. Services include video editing, keyword research, audience retention strategies, and AdSense monetisation setup.',
  },
  {
    name: 'Instagram',
    brandColor: '#E1306C',
    color: 'from-purple-500 to-pink-500',
    iconBg: 'rgba(168,85,247,0.1)',
    iconBorder: 'rgba(168,85,247,0.25)',
    shadow: 'rgba(168,85,247,0.18)',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    shortDesc: 'Visual storytelling & engagement',
    details: 'Elevate your Instagram with stunning visuals, strategic posting schedules, and targeted growth techniques. We manage Reels, Stories, IGTV, and implement influencer collaborations for maximum reach.',
  },
  {
    name: 'Facebook',
    brandColor: '#1877F2',
    color: 'from-blue-500 to-blue-700',
    iconBg: 'rgba(59,130,246,0.1)',
    iconBorder: 'rgba(59,130,246,0.25)',
    shadow: 'rgba(59,130,246,0.18)',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    shortDesc: 'Community building & paid ads',
    details: 'Build thriving communities with targeted content strategies and paid advertising campaigns. Our team handles page management, group creation, event promotion, and conversion-optimised ad creatives.',
  },
  {
    name: 'Snapchat',
    brandColor: '#111111',
    color: 'from-yellow-400 to-yellow-500',
    iconBg: 'rgba(234,179,8,0.1)',
    iconBorder: 'rgba(234,179,8,0.25)',
    shadow: 'rgba(234,179,8,0.2)',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.317 4.184v.003c.089.05.26.12.507.12.3-.007.658-.12 1.03-.368.144-.09.298-.135.45-.135.135 0 .27.03.397.09.55.254.881.753.881 1.297 0 .57-.377 1.066-.962 1.267-.06.02-.124.038-.193.056-.626.161-1.38.484-1.48 1.065-.035.198.001.407.105.656.427 1.066 1.351 2.765 3.544 3.566.042.015.08.03.118.042.55.196.83.583.83 1.051 0 .588-.443 1.282-1.474 1.482-.12.024-.25.044-.39.064-.48.07-1.21.182-1.377.71-.094.3-.015.688.217 1.163.006.014.575.133.575.133.618.124 1.05.438 1.05.812 0 .5-.601.934-1.538.934-.19 0-.36-.018-.5-.046-.35-.07-.605-.154-.891-.226-.35-.088-.71-.165-1.099-.165-.414 0-.77.055-1.225.255-.86.38-1.695.575-2.484.575-.789 0-1.624-.195-2.484-.575-.455-.2-.81-.255-1.225-.255-.389 0-.75.077-1.1.165-.285.072-.54.156-.89.226-.14.028-.31.046-.5.046-.937 0-1.538-.434-1.538-.934 0-.374.432-.688 1.05-.812.576-.115.576-.133.576-.133.232-.475.311-.863.217-1.163-.168-.528-.897-.64-1.377-.71-.14-.02-.27-.04-.39-.064-1.031-.2-1.474-.894-1.474-1.482 0-.468.28-.855.83-1.051.038-.012.076-.027.118-.042 2.193-.8 3.117-2.5 3.544-3.566.104-.249.14-.458.105-.656-.1-.581-.854-.904-1.48-1.065-.069-.018-.133-.036-.193-.056-.585-.2-.962-.697-.962-1.267 0-.544.33-1.043.88-1.297.128-.06.263-.09.397-.09.153 0 .307.045.451.135.372.248.73.36 1.03.368.247 0 .418-.07.507-.12v-.003c-.086-.965-.212-2.99.317-4.184C7.859 1.069 11.216.793 12.206.793z" />
      </svg>
    ),
    shortDesc: 'Ephemeral content & real-time reach',
    details: 'Harness disappearing content with Snapchat marketing. We create engaging Snaps, Stories, and Spotlight videos, manage filters and lenses, and build authentic connections through real-time and location-based targeting.',
  },
  {
    name: 'Pinterest',
    brandColor: '#E60023',
    color: 'from-red-500 to-rose-600',
    iconBg: 'rgba(230,0,35,0.07)',
    iconBorder: 'rgba(230,0,35,0.22)',
    shadow: 'rgba(230,0,35,0.16)',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
      </svg>
    ),
    shortDesc: 'Visual discovery & shoppable content',
    details: 'Drive sustained organic traffic with Pinterest marketing. We manage boards, create scroll-stopping pins, set up Pinterest Shopping, run targeted ads, and leverage seasonal trends to convert browsers into buyers.',
  },
];

const stats = [
  { value: '20+', label: 'Countries Served', icon: '🌍' },
  { value: '98%', label: 'Client Satisfaction', icon: '⭐' },
  { value: '500K+', label: 'Followers Generated', icon: '📈' },
  { value: '$2M+', label: 'Revenue Monetised', icon: '💰' },
  { value: '500+', label: 'Projects Completed', icon: '✅' },
  { value: '24/7', label: 'Support Available', icon: '🛡️' },
];

export default function Home() {

  return (
    <Layout title="Home" description="Expert social media strategies for explosive growth and monetisation on TikTok, YouTube, Instagram, Facebook, Snapchat, and Pinterest.">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        className="hero-section relative overflow-hidden"
        style={{ minHeight: '88vh', display: 'flex', alignItems: 'stretch' }}
      >
        {/* Full-bleed background photo */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/hero-image.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* Subtle left fade so text is crisp — image is already light on the left */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(240,244,255,0.82) 0%, rgba(240,244,255,0.55) 40%, rgba(240,244,255,0) 68%)',
            zIndex: 1,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex items-center" style={{ width: '52%', padding: '5rem 3rem 5rem 6vw' }}>
          <div>
            {/* Badge */}
            <div className="mb-6">
              <span className="badge">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                Trusted by 500+ creators worldwide
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-extrabold mb-5 leading-tight text-shadow" style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}>
              <span className="text-slate-900">Transform Your</span>{' '}
              <span style={{ color: '#0EA5E9' }}>Social Media</span>
              <br />
              <span className="text-slate-900">Into a Revenue Machine</span>
            </h1>

            <p className="text-slate-600 mb-8 leading-relaxed" style={{ fontSize: '1.05rem', maxWidth: '420px' }}>
              Expert strategies for explosive growth and monetisation on TikTok, YouTube, Instagram, Facebook, and more.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Link href="/contact" className="btn-primary">
                Get Free Strategy Session
              </Link>
              <Link href="/services" className="btn-secondary">
                Explore Services
              </Link>
            </div>

            {/* Trust pill */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-600"
              style={{ background: 'rgba(14,165,233,0.07)', border: '1px solid rgba(14,165,233,0.2)' }}
            >
              <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#0EA5E9' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No contracts · Results-guaranteed · 24/7 support
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <section className="section-alt">
        <div className="container-custom section-padding-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="stat-card animate-on-scroll" style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-extrabold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-xs text-slate-500 leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-14 animate-on-scroll">
            <span className="badge mb-4">What We Do</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Six Platforms, <span className="text-slate-900">One Agency</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
              Click any platform below to discover exactly how we grow your presence and drive real revenue.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, i) => (
              <div
                key={i}
                className="card group animate-on-scroll flex flex-col"
                style={{
                  transitionDelay: `${i * 70}ms`,
                  boxShadow: `0 4px 20px ${service.shadow}`,
                  borderColor: service.iconBorder,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = `0 8px 32px ${service.shadow.replace(/[\d.]+\)$/, '0.32)')}`;
                  e.currentTarget.style.borderColor = service.iconBorder.replace(/[\d.]+\)$/, '0.5)');
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = `0 4px 20px ${service.shadow}`;
                  e.currentTarget.style.borderColor = service.iconBorder;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Icon + name row */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: service.iconBg, border: `1px solid ${service.iconBorder}` }}
                  >
                    <span style={{ color: service.brandColor, display: 'flex' }}>
                      {service.icon}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{service.name}</h3>
                </div>

                <p className="text-slate-500 text-sm leading-relaxed mb-4">{service.shortDesc}</p>

                <div className="flex flex-col flex-1" style={{ borderTop: '1px solid rgba(123,147,255,0.15)', paddingTop: '1rem' }}>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4" style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{service.details}</p>
                  <Link href="/services" className="btn-secondary !py-2 !px-4 !text-sm">
                    View Full Services →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Us ───────────────────────────────────────── */}
      <section className="section-deep section-padding">
        <div className="container-custom">
          <div className="text-center mb-14 animate-on-scroll">
            <span className="badge mb-4">Why CREATORUSFLOW</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              The Difference Is in the <span className="text-slate-900">Results</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: 'Data-Driven Strategy',
                desc: 'Every decision is backed by analytics. We analyse platform algorithms, audience behaviour, and competitor performance to craft strategies that actually work.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Rapid Growth Engine',
                desc: 'Our proprietary growth frameworks deliver measurable results within weeks, not months — with sustainable long-term momentum built in from day one.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Monetisation First',
                desc: 'Growth without revenue is vanity. We integrate monetisation pathways from day one — brand deals, affiliate income, ad revenue, and product funnels.',
              },
            ].map((item, i) => (
              <div key={i} className="card animate-on-scroll" style={{ transitionDelay: `${i * 100}ms` }}>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-slate-500"
                  style={{ background: 'rgba(123,147,255,0.08)', border: '1px solid rgba(123,147,255,0.2)' }}
                >
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-custom">
          <div
            className="relative overflow-hidden rounded-3xl text-center p-12 md:p-16 animate-on-scroll"
            style={{
              background: 'rgba(123,147,255,0.05)',
              border: '1px solid rgba(123,147,255,0.18)',
            }}
          >
            {/* Orbs inside card */}
            <div className="orb orb-primary" style={{ width: 400, height: 400, top: '-50%', left: '-10%', opacity: 0.5 }} />
            <div className="orb orb-orange" style={{ width: 350, height: 350, bottom: '-50%', right: '-5%', opacity: 0.4 }} />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
                Ready to Grow Your <span className="text-slate-900">Social Media?</span>
              </h2>
              <p className="text-slate-600 text-lg mb-10 max-w-xl mx-auto">
                Book a free 30-minute strategy call and see exactly how we'll grow your accounts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="btn-primary">
                  Book Free Strategy Call
                </Link>
                <Link href="/services" className="btn-secondary">
                  View All Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
