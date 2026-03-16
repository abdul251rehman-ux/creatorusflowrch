import Layout from '../components/Layout';


const stats = [
  { number: '500+', label: 'Projects Completed' },
  { number: '50+', label: 'Team Members' },
  { number: '20+', label: 'Countries Served' },
  { number: '98%', label: 'Client Satisfaction' },
];

const values = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Innovation',
    desc: 'Staying ahead of platform changes with cutting-edge strategies and proprietary technology.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Data-Driven',
    desc: 'Every decision is backed by analytics, proven methodologies, and real performance data.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Transparency',
    desc: 'Clear communication and honest reporting on all campaign performance and growth metrics.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: 'Results-Focused',
    desc: 'Committed to delivering measurable growth, real engagement, and proven ROI for every client.',
  },
];

export default function About() {
  return (
    <Layout title="About Us" description="Learn about CREATORUSFLOW's mission, expert team, and proven approach to social media growth.">

      {/* ── Hero ── */}
      <section className="hero-section section-padding relative" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center' }}>
        <div className="orb orb-primary animate-float" style={{ width: 500, height: 500, top: '-20%', right: '-5%', opacity: 0.5 }} />
        <div className="orb orb-orange animate-float-slow" style={{ width: 400, height: 400, bottom: '-20%', left: '-10%', opacity: 0.4 }} />

        <div className="container-custom relative z-10 w-full">
          <div className="text-center max-w-3xl mx-auto animate-on-scroll">
            <span className="badge mb-5">Our Story</span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
              We're the Team Behind{' '}
              <span className="text-slate-900">Your Growth</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Empowering creators and businesses to dominate social media with innovative strategies, cutting-edge technology, and genuine care for your success.
            </p>
          </div>
        </div>
      </section>

      {/* ── Mission + Stats ── */}
      <section className="section-alt section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-on-scroll">
              <span className="badge mb-4">Our Mission</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                Democratising Social Media{' '}
                <span className="text-slate-900">Success</span>
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                We believe everyone deserves the opportunity to build meaningful connections and monetise their passion. Our mission is to democratise social media success by providing accessible, data-driven solutions that transform ordinary accounts into extraordinary brands.
              </p>
              <p className="text-slate-500 leading-relaxed">
                Founded by creators for creators, we combine deep platform expertise with enterprise-grade analytics to deliver results that speak for themselves.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 animate-on-scroll">
              {stats.map((stat, i) => (
                <div key={i} className="stat-card" style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="text-4xl font-extrabold text-slate-900 mb-1">{stat.number}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

{/* ── Values ── */}
      <section className="section-deep section-padding">
        <div className="container-custom">
          <div className="text-center mb-14 animate-on-scroll">
            <span className="badge mb-4">What We Stand For</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Our Core{' '}
              <span className="text-slate-900">Values</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div
                key={i}
                className="card text-center animate-on-scroll"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-5 text-slate-500"
                  style={{ background: 'rgba(123,147,255,0.08)', border: '1px solid rgba(123,147,255,0.18)' }}
                >
                  {value.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
