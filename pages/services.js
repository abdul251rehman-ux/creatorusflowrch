import Layout from '../components/Layout';
import Link from 'next/link';
import { useState } from 'react';

// Official brand SVG icons
const PlatformIcon = ({ platform, size = 18 }) => {
  const icons = {
    tiktok: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
    youtube: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    instagram: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    facebook: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    snapchat: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.317 4.184v.003c.089.05.26.12.507.12.3-.007.658-.12 1.03-.368.144-.09.298-.135.45-.135.135 0 .27.03.397.09.55.254.881.753.881 1.297 0 .57-.377 1.066-.962 1.267-.06.02-.124.038-.193.056-.626.161-1.38.484-1.48 1.065-.035.198.001.407.105.656.427 1.066 1.351 2.765 3.544 3.566.042.015.08.03.118.042.55.196.83.583.83 1.051 0 .588-.443 1.282-1.474 1.482-.12.024-.25.044-.39.064-.48.07-1.21.182-1.377.71-.094.3-.015.688.217 1.163.006.014.575.133.575.133.618.124 1.05.438 1.05.812 0 .5-.601.934-1.538.934-.19 0-.36-.018-.5-.046-.35-.07-.605-.154-.891-.226-.35-.088-.71-.165-1.099-.165-.414 0-.77.055-1.225.255-.86.38-1.695.575-2.484.575-.789 0-1.624-.195-2.484-.575-.455-.2-.81-.255-1.225-.255-.389 0-.75.077-1.1.165-.285.072-.54.156-.89.226-.14.028-.31.046-.5.046-.937 0-1.538-.434-1.538-.934 0-.374.432-.688 1.05-.812.576-.115.576-.133.576-.133.232-.475.311-.863.217-1.163-.168-.528-.897-.64-1.377-.71-.14-.02-.27-.04-.39-.064-1.031-.2-1.474-.894-1.474-1.482 0-.468.28-.855.83-1.051.038-.012.076-.027.118-.042 2.193-.8 3.117-2.5 3.544-3.566.104-.249.14-.458.105-.656-.1-.581-.854-.904-1.48-1.065-.069-.018-.133-.036-.193-.056-.585-.2-.962-.697-.962-1.267 0-.544.33-1.043.88-1.297.128-.06.263-.09.397-.09.153 0 .307.045.451.135.372.248.73.36 1.03.368.247 0 .418-.07.507-.12v-.003c-.086-.965-.212-2.99.317-4.184C7.859 1.069 11.216.793 12.206.793z" />
      </svg>
    ),
    pinterest: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
      </svg>
    ),
  };
  return icons[platform] || null;
};

const platforms = {
  tiktok: {
    iconColor: '#000000',
    label: 'TikTok',
    color: 'from-pink-500 to-red-500',
    bg: 'rgba(236,72,153,0.08)',
    border: 'rgba(236,72,153,0.25)',
    activeText: '#be185d',
    title: 'TikTok Mastery',
    description: 'Viral content creation and explosive growth strategies that turn your account into a cultural force.',
    services: [
      'Content Strategy & Planning',
      'Hashtag Research & Optimisation',
      'Trend Analysis & Adaptation',
      'Account Management & Growth Hacking',
      'Monetisation Setup (Live Gifts, Brand Deals)',
      'Auto-Scheduling & Posting Automation',
      'Engagement Boost & Community Building',
      'Analytics & Performance Tracking',
    ],
    automation: 'AI-powered auto-scheduling, bulk content queuing, and automated hashtag injection to keep your TikTok active 24/7 without manual effort.',
    features: [
      'Daily content calendar creation',
      'Algorithm-optimised posting times',
      'Custom thumbnail design',
      'Cross-platform promotion strategies',
    ],
  },
  youtube: {
    iconColor: '#FF0000',
    label: 'YouTube',
    color: 'from-red-500 to-red-700',
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.25)',
    activeText: '#b91c1c',
    title: 'YouTube Domination',
    description: 'Channel optimisation and revenue maximisation — turning your videos into a consistent income stream.',
    services: [
      'Channel Audit & Strategy Development',
      'Video SEO & Keyword Optimisation',
      'Thumbnail & Title Optimisation',
      'Audience Retention Strategies',
      'Monetisation Application & Setup',
      'Automated Upload Scheduling & Notifications',
      'Content Series Planning',
      'Collaborations & Networking',
    ],
    automation: 'Automated video scheduling, end-screen & card automation, and performance alert bots so your channel grows even while you sleep.',
    features: [
      'Advanced analytics integration',
      'Competitor analysis reports',
      'Custom branding packages',
      'Multi-channel network connections',
    ],
  },
  instagram: {
    iconColor: '#E1306C',
    label: 'Instagram',
    color: 'from-purple-500 to-pink-500',
    bg: 'rgba(168,85,247,0.08)',
    border: 'rgba(168,85,247,0.25)',
    activeText: '#9d174d',
    title: 'Instagram Excellence',
    description: 'Visual storytelling and engagement mastery that builds a loyal, converting community.',
    services: [
      'Profile Optimisation & Branding',
      'Content Calendar Development',
      'Hashtag Strategy & Research',
      'Stories & Reels Management',
      'Influencer Collaboration Setup',
      'Auto-Posting, DM Automation & Comment Bots',
      'Engagement Strategy Implementation',
      'Growth Analytics & Reporting',
    ],
    automation: 'Scheduled post automation, automated DM welcome sequences, and comment reply bots to boost engagement around the clock.',
    features: [
      'Instagram Shop setup',
      'IGTV content strategy',
      'Live session management',
      'Instagram Insights optimisation',
    ],
  },
  facebook: {
    iconColor: '#1877F2',
    label: 'Facebook',
    color: 'from-blue-500 to-blue-700',
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.25)',
    activeText: '#1d4ed8',
    title: 'Facebook Powerhouse',
    description: 'Community building and precision advertising that drives real business results.',
    services: [
      'Page Setup & Optimisation',
      'Content Strategy & Calendar',
      'Community Management',
      'Advertising Campaign Creation',
      'Event Promotion & Management',
      'Group Creation & Moderation',
      'Messenger Bot & Auto-Reply Automation',
      'Cross-Platform Integration',
    ],
    automation: 'Messenger chatbot flows, automated post scheduling, lead capture sequences, and ad rule automation for hands-free campaign management.',
    features: [
      'Facebook Pixel setup',
      'Custom audience creation',
      'Lead generation campaigns',
      'Facebook Marketplace optimisation',
    ],
  },
  snapchat: {
    iconColor: '#111111',
    label: 'Snapchat',
    color: 'from-yellow-400 to-amber-500',
    bg: 'rgba(234,179,8,0.08)',
    border: 'rgba(234,179,8,0.25)',
    activeText: '#92400e',
    title: 'Snapchat Innovation',
    description: 'Ephemeral content and real-time engagement strategies built for the next generation of consumers.',
    services: [
      'Snapchat Strategy Development',
      'Geofilter & Lens Creation',
      'Stories & Spotlight Management',
      'Snap Ad Campaign Setup',
      'Real-time Engagement Monitoring',
      'Automated Story Scheduling & Publishing',
      'Content Series Creation',
      'Analytics & Performance Tracking',
    ],
    automation: 'Bulk story scheduling, automated Snap ad budget rules, and real-time engagement alerts to keep campaigns running without constant supervision.',
    features: [
      'AR filter development',
      'Location-based targeting',
      'Snap Map optimisation',
      'Discover channel management',
    ],
  },
  pinterest: {
    iconColor: '#E60023',
    label: 'Pinterest',
    color: 'from-red-500 to-rose-600',
    bg: 'rgba(230,0,35,0.07)',
    border: 'rgba(230,0,35,0.22)',
    activeText: '#be123c',
    title: 'Pinterest Growth',
    description: 'Visual discovery and shoppable content strategies that drive sustained organic traffic and conversions.',
    services: [
      'Profile & Board Optimisation',
      'Pin Design & Content Creation',
      'SEO-Driven Keyword Strategy',
      'Rich Pins Setup & Management',
      'Pinterest Ads Campaign Creation',
      'Automated Pin Scheduling & Board Management',
      'Shop & Catalogue Integration',
      'Analytics & Traffic Reporting',
    ],
    automation: 'Automated pin scheduling at peak traffic times, bulk board management, and catalogue sync automation to keep your Pinterest working around the clock.',
    features: [
      'Pinterest Shopping setup',
      'Idea Pin series management',
      'Seasonal trend campaigns',
      'Pinterest Analytics deep-dives',
    ],
  },
};

export default function Services() {
  const [active, setActive] = useState('tiktok');
  const platform = platforms[active];

  return (
    <Layout title="Services" description="Comprehensive social media services for TikTok, YouTube, Instagram, Facebook, Snapchat, and Pinterest.">

      {/* ── Platform Tabs ── */}
      <section className="section-alt" style={{ padding: '3rem 1rem 3rem' }}>
        <div className="container-custom">
          {/* Tab bar */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {Object.entries(platforms).map(([key, p]) => {
              const isActive = active === key;
              return (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200"
                  style={
                    isActive
                      ? {
                          background: p.bg,
                          border: `1.5px solid ${p.border}`,
                          color: p.activeText,
                          boxShadow: `0 4px 20px ${p.border}`,
                        }
                      : {
                          background: 'rgba(123,147,255,0.05)',
                          border: '1.5px solid rgba(123,147,255,0.15)',
                          color: '#64748b',
                        }
                  }
                >
                  <span style={{ color: isActive ? p.iconColor : '#94a3b8' }}>
                    <PlatformIcon platform={key} size={16} />
                  </span>
                  <span className="hidden sm:inline">{p.label}</span>
                </button>
              );
            })}
          </div>

          {/* Platform detail card */}
          <div className="card" key={active}>
            {/* Header */}
            <div className="text-center mb-12 pb-10" style={{ borderBottom: '1px solid rgba(123,147,255,0.08)' }}>
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: platform.bg, border: `1px solid ${platform.border}`, color: platform.iconColor }}
              >
                <PlatformIcon platform={active} size={40} />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">{platform.title}</h2>
              <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">{platform.description}</p>
            </div>

            {/* Automation highlight banner */}
            <div
              className="flex items-start gap-4 rounded-2xl p-5 mb-10"
              style={{ background: `${platform.bg}`, border: `1.5px solid ${platform.border}` }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: platform.border, color: platform.iconColor }}
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold mb-1" style={{ color: platform.activeText }}>Automation — Our Core Advantage</p>
                <p className="text-sm text-slate-600 leading-relaxed">{platform.automation}</p>
              </div>
            </div>

            {/* Services + Features */}
            <div className="grid md:grid-cols-2 gap-10 mb-12">
              {/* Core Services */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                  <span
                    className="w-6 h-6 rounded-md flex items-center justify-center text-xs"
                    style={{ background: 'rgba(123,147,255,0.1)', border: '1px solid rgba(123,147,255,0.25)', color: '#7B93FF' }}
                  >
                    ✦
                  </span>
                  Core Services
                </h3>
                <ul className="space-y-3">
                  {platform.services.map((service, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <svg className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-600">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Features */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                  <span
                    className="w-6 h-6 rounded-md flex items-center justify-center text-xs"
                    style={{ background: 'rgba(123,147,255,0.1)', border: '1px solid rgba(123,147,255,0.25)', color: '#7B93FF' }}
                  >
                    ★
                  </span>
                  Key Features
                </h3>
                <ul className="space-y-4">
                  {platform.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-xl p-4 text-sm"
                      style={{ background: 'rgba(123,147,255,0.04)', border: '1px solid rgba(123,147,255,0.1)' }}
                    >
                      <svg className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA inside card */}
                <div className="mt-8">
                  <Link href="/contact" className="btn-primary w-full text-center block">
                    Get Started with {platform.label} →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="section-padding">
        <div className="container-custom">
          <div
            className="relative overflow-hidden rounded-3xl text-center p-12 animate-on-scroll"
            style={{
              background: 'linear-gradient(135deg, rgba(123,147,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(123,147,255,0.18)',
            }}
          >
            <div className="orb orb-primary" style={{ width: 300, height: 300, top: '-50%', left: '0%', opacity: 0.5 }} />
            <div className="orb orb-orange" style={{ width: 300, height: 300, bottom: '-50%', right: '0%', opacity: 0.4 }} />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                Not Sure Where to <span className="text-slate-900">Start?</span>
              </h2>
              <p className="text-slate-600 mb-8 max-w-lg mx-auto">
                Book a free strategy session and we'll identify the best platforms and services for your specific goals.
              </p>
              <Link href="/contact" className="btn-primary">
                Book Free Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
