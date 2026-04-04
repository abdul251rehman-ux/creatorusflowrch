import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Analytics } from '@vercel/analytics/next';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About Us' },
  { href: '/faqs', label: 'FAQs' },
  { href: '/contact', label: 'Contact' },
];

export default function Layout({ children, title, description }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('animate-in'); }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Close mobile menu on route change / resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const pageTitle = title ? `${title} — CREATORFLOWUS` : 'CREATORFLOWUS — Social Media Solutions';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description || 'Expert social media growth strategies for creators and businesses. CREATORFLOWUS helps creators and brands dominate TikTok, YouTube, Instagram, Facebook, and more.'} />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="robots" content="index, follow" />

        {/* Favicon */}
        <link rel="icon" href="/creatorusflow_icon.ico" />
        <link rel="shortcut icon" href="/creatorusflow_icon.ico" />

        {/* Open Graph (Google / social previews) */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.creatorflowus.com/" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description || 'Expert social media growth strategies for creators and businesses. CREATORFLOWUS helps creators and brands dominate TikTok, YouTube, Instagram, Facebook, and more.'} />
        <meta property="og:image" content="https://www.creatorflowus.com/creatorusflow_icon.ico" />
        <meta property="og:site_name" content="CREATORFLOWUS" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description || 'Expert social media growth strategies for creators and businesses.'} />
        <meta name="twitter:image" content="https://www.creatorflowus.com/creatorusflow_icon.ico" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      {/* ── Navigation ── */}
      <header
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : '1px solid transparent',
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
        }}
      >
        <nav className="container-custom px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group" onClick={() => setMobileOpen(false)}>
              <img src="/rounded_icon_big_logo.ico" alt="CREATORFLOWUS logo" width={36} height={36} style={{ display: 'block' }} />
              <span className="font-extrabold tracking-wide" style={{ fontSize: '1.15rem', letterSpacing: '0.04em' }}>
                <span style={{ color: '#1B3A6B' }}>CREATORFLOW</span><span style={{ color: '#0EA5E9' }}>US</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <ul className="hidden md:flex items-center gap-1">
              {navLinks.map(link => {
                const isActive = router.pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                      style={{
                        color: isActive ? '#0EA5E9' : '#475569',
                        background: isActive ? 'rgba(14,165,233,0.08)' : 'transparent',
                        fontWeight: isActive ? 600 : 500,
                      }}
                      onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = '#1B3A6B'; e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; }}}
                      onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'transparent'; }}}
                    >
                      {link.label}
                      {isActive && (
                        <span style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', width: '18px', height: '2.5px', borderRadius: '99px', background: '#0EA5E9', display: 'block' }} />
                      )}
                    </Link>
                  </li>
                );
              })}
              <li className="ml-2">
                <Link href="/contact" className="btn-primary !py-2 !px-5 !text-sm" style={{ background: 'linear-gradient(135deg, #1B3A6B 0%, #0EA5E9 100%)', boxShadow: '0 4px 14px rgba(14,165,233,0.35)' }}>
                  Get Started
                </Link>
              </li>
            </ul>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-3 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-black/5 transition-all"
              onClick={() => setMobileOpen(prev => !prev)}
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile dropdown */}
          {mobileOpen && (
            <div
              className="md:hidden mt-2 pb-3 animate-slide-down"
              style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}
            >
              <ul className="pt-3 space-y-1">
                {navLinks.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block px-3 py-3 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-black/5 transition-all"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li className="pt-2 px-3">
                  <Link
                    href="/contact"
                    className="btn-primary w-full text-center !py-3 !text-sm"
                    onClick={() => setMobileOpen(false)}
                  >
                    Get Free Consultation
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </nav>
      </header>

      <main>{children}</main>

      {/* ── Footer ── */}
      <footer style={{ background: '#0D1526', borderTop: 'none' }}>
        <div className="container-custom px-4 sm:px-6 lg:px-8 py-6 md:py-16">

          {/* Mobile: Centered brand + socials */}
          <div className="md:hidden text-center mb-4">
            <Link href="/" className="inline-flex items-center gap-2 mb-2">
              <img src="/rounded_icon_big_logo.ico" alt="CREATORFLOWUS logo" width={28} height={28} style={{ display: 'block' }} />
              <span className="font-extrabold tracking-wide" style={{ fontSize: '1.1rem', letterSpacing: '0.04em' }}>
                <span style={{ color: '#60A5FA' }}>CREATORFLOW</span><span style={{ color: '#06B6D4' }}>US</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed mb-2 max-w-xs mx-auto">
              Empowering creators and businesses to dominate social media with data-driven strategies.
            </p>
            <div className="flex gap-3 justify-center mb-3">
              {[
                { href: 'https://www.tiktok.com/@creatorflowus', label: 'TikTok', icon: <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/> },
                { href: 'https://youtube.com/@creatorflowus', label: 'YouTube', icon: <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/> },
                { href: 'https://www.instagram.com/creatorflowus1/', label: 'Instagram', icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/> },
                { href: 'https://www.facebook.com/creatorflowus/', label: 'Facebook', icon: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/> },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
                  className="w-11 h-11 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all"
                  style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)' }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">{s.icon}</svg>
                </a>
              ))}
            </div>

            {/* Mobile: Nav + Contact side by side */}
            <div className="grid grid-cols-2 gap-4 text-left mb-4">
              <div>
                <h4 className="text-slate-300 font-semibold mb-3 text-xs uppercase tracking-widest">Quick Links</h4>
                <ul className="space-y-1">
                  {[
                    { href: '/', label: 'Home' },
                    { href: '/services', label: 'Services' },
                    { href: '/about', label: 'About Us' },
                    { href: '/faqs', label: 'FAQs' },
                  ].map(link => (
                    <li key={link.href}>
                      <Link href={link.href} className="block py-1.5 text-slate-400 hover:text-white transition-colors text-sm">{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-slate-300 font-semibold mb-3 text-xs uppercase tracking-widest">Contact</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="mailto:info@creatorflowus.com" className="hover:text-white transition-colors text-xs">info@creatorflowus.com</a></li>
                  <li><a href="tel:+447735390061" className="hover:text-white transition-colors">+44 7735 390061</a></li>
                  <li>Chak 47 TDA, Bhakkar<br />Punjab, Pakistan</li>
                </ul>
              </div>
            </div>

            {/* Mobile: Support + CTA */}
            <div
              className="rounded-xl p-3 mb-3 text-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white text-sm font-semibold">24/7 Support Active</span>
              </div>
              <p className="text-slate-400 text-xs mb-3">Average response time under 2 hours.</p>
              <Link href="/contact" className="btn-primary w-full text-center !py-3 !text-sm block">
                Free Consultation
              </Link>
            </div>
          </div>

          {/* Desktop: Original 4-column grid (hidden on mobile) */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">

            {/* Brand */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <img src="/rounded_icon_big_logo.ico" alt="CREATORFLOWUS logo" width={30} height={30} style={{ display: 'block' }} />
                <span className="font-extrabold tracking-wide" style={{ fontSize: '1.1rem', letterSpacing: '0.04em' }}>
                  <span style={{ color: '#60A5FA' }}>CREATORFLOW</span><span style={{ color: '#06B6D4' }}>US</span>
                </span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Empowering creators and businesses to dominate social media with data-driven strategies and expert execution.
              </p>
              <div className="flex gap-2">
                {[
                  { href: 'https://www.tiktok.com/@creatorflowus', label: 'TikTok', icon: <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/> },
                  { href: 'https://youtube.com/@creatorflowus', label: 'YouTube', icon: <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/> },
                  { href: 'https://www.instagram.com/creatorflowus1/', label: 'Instagram', icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/> },
                  { href: 'https://www.facebook.com/creatorflowus/', label: 'Facebook', icon: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/> },
                ].map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-white transition-all hover:bg-white/8"
                    style={{ border: '1px solid rgba(255,255,255,0.12)' }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">{s.icon}</svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-white font-semibold mb-5 text-xs uppercase tracking-widest text-slate-400">Navigation</h4>
              <ul className="space-y-3">
                {[
                  { href: '/', label: 'Home' },
                  { href: '/services', label: 'Services' },
                  { href: '/about', label: 'About Us' },
                  { href: '/faqs', label: 'FAQs' },
                  { href: '/privacy', label: 'Privacy Policy' },
                  { href: '/terms', label: 'Terms & Conditions' },
                ].map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-slate-400 hover:text-white transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-5 text-xs uppercase tracking-widest text-slate-400">Contact</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-slate-500 mt-0.5 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <span className="text-slate-400">info@creatorflowus.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-slate-500 mt-0.5 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <span className="text-slate-400">+44 7735 390061</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-slate-500 mt-0.5 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <span className="text-slate-400">Chak 47 TDA, Bhakkar<br />Punjab, Pakistan</span>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-5 text-xs uppercase tracking-widest text-slate-400">Support</h4>
              <div className="space-y-4">
                <div
                  className="rounded-xl p-4"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-white text-sm font-semibold">24/7 Support Active</span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">Average response time under 2 hours. Live chat and phone support available.</p>
                </div>
                <Link href="/contact" className="btn-primary w-full text-center !py-2.5 !text-sm block">
                  Free Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: '#08101e' }}>
          <div className="container-custom px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-slate-500 text-xs sm:text-sm">
              © 2026 <span style={{ fontWeight: 700 }}><span style={{ color: '#60A5FA' }}>CREATORFLOW</span><span style={{ color: '#06B6D4' }}>US</span></span>. All rights reserved.
            </p>
            <p className="text-slate-600 text-xs italic">
              "Transforming social media dreams into reality, one creator at a time."
            </p>
          </div>
        </div>
      </footer>
      <Analytics />
    </>
  );
}
