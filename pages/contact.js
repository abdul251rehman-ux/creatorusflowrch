import Layout from '../components/Layout';
import { useState } from 'react';

const contactInfo = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: 'Phone',
    value: '+1 (123) 456-7890',
    sub: 'Mon–Fri, 9AM–6PM EST',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: 'Email',
    value: 'info@creatorusflow.com',
    sub: 'We respond within 24 hours',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 3H3a2 2 0 00-2 2v14a2 2 0 002 2h18a2 2 0 002-2V5a2 2 0 00-2-2z" />
      </svg>
    ),
    label: 'Live Chat',
    value: 'Available on our website',
    sub: 'Instant responses, 24/7',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: 'Office',
    value: 'Chak 47 TDA, Bhakkar',
    sub: 'Punjab, Pakistan',
  },
];

const socialLinks = [
  {
    href: 'https://www.tiktok.com/@creatorusflow', label: 'TikTok',
    color: '#000000', bg: 'rgba(0,0,0,0.06)', border: 'rgba(0,0,0,0.12)',
    icon: <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />,
  },
  {
    href: 'https://www.youtube.com/@creatorusflow', label: 'YouTube',
    color: '#FF0000', bg: 'rgba(255,0,0,0.06)', border: 'rgba(255,0,0,0.18)',
    icon: <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />,
  },
  {
    href: 'https://www.instagram.com/creatorusflow', label: 'Instagram',
    color: '#E1306C', bg: 'rgba(225,48,108,0.06)', border: 'rgba(225,48,108,0.18)',
    icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />,
  },
  {
    href: 'https://www.facebook.com/creatorusflow', label: 'Facebook',
    color: '#1877F2', bg: 'rgba(24,119,242,0.06)', border: 'rgba(24,119,242,0.18)',
    icon: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />,
  },
  {
    href: 'https://www.snapchat.com/add/creatorusflow', label: 'Snapchat',
    color: '#111111', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.3)',
    icon: <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.317 4.184v.003c.089.05.26.12.507.12.3-.007.658-.12 1.03-.368.144-.09.298-.135.45-.135.135 0 .27.03.397.09.55.254.881.753.881 1.297 0 .57-.377 1.066-.962 1.267-.06.02-.124.038-.193.056-.626.161-1.38.484-1.48 1.065-.035.198.001.407.105.656.427 1.066 1.351 2.765 3.544 3.566.042.015.08.03.118.042.55.196.83.583.83 1.051 0 .588-.443 1.282-1.474 1.482-.12.024-.25.044-.39.064-.48.07-1.21.182-1.377.71-.094.3-.015.688.217 1.163.006.014.575.133.575.133.618.124 1.05.438 1.05.812 0 .5-.601.934-1.538.934-.19 0-.36-.018-.5-.046-.35-.07-.605-.154-.891-.226-.35-.088-.71-.165-1.099-.165-.414 0-.77.055-1.225.255-.86.38-1.695.575-2.484.575-.789 0-1.624-.195-2.484-.575-.455-.2-.81-.255-1.225-.255-.389 0-.75.077-1.1.165-.285.072-.54.156-.89.226-.14.028-.31.046-.5.046-.937 0-1.538-.434-1.538-.934 0-.374.432-.688 1.05-.812.576-.115.576-.133.576-.133.232-.475.311-.863.217-1.163-.168-.528-.897-.64-1.377-.71-.14-.02-.27-.04-.39-.064-1.031-.2-1.474-.894-1.474-1.482 0-.468.28-.855.83-1.051.038-.012.076-.027.118-.042 2.193-.8 3.117-2.5 3.544-3.566.104-.249.14-.458.105-.656-.1-.581-.854-.904-1.48-1.065-.069-.018-.133-.036-.193-.056-.585-.2-.962-.697-.962-1.267 0-.544.33-1.043.88-1.297.128-.06.263-.09.397-.09.153 0 .307.045.451.135.372.248.73.36 1.03.368.247 0 .418-.07.507-.12v-.003c-.086-.965-.212-2.99.317-4.184C7.859 1.069 11.216.793 12.206.793z" />,
  },
  {
    href: 'https://www.pinterest.com/creatorusflow', label: 'Pinterest',
    color: '#E60023', bg: 'rgba(230,0,35,0.06)', border: 'rgba(230,0,35,0.18)',
    icon: <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />,
  },
];

export default function Contact() {
  const [status, setStatus] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', service: '', message: '',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  function handleSubmit(e) {
    e.preventDefault();
    const subject = encodeURIComponent(`New Enquiry from ${formData.name}`);
    const body = encodeURIComponent(
`Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || '—'}
Service: ${formData.service || '—'}

Message:
${formData.message}`
    );
    window.location.href = `mailto:info@creatorusflow.com?subject=${subject}&body=${body}`;
    setStatus('sent');
    setFormData({ name: '', email: '', phone: '', service: '', message: '' });
  }

  const inputClass = 'input-field';

  return (
    <Layout title="Contact" description="Get in touch with CREATORUSFLOW for a free strategy session on your social media growth.">

      {/* ── Main content ── */}
      <section className="section-alt" style={{ padding: '2.5rem 1rem 3.5rem' }}>
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8 items-start">

            {/* ── Left: Contact info ── */}
            <div className="flex flex-col gap-5">
              <div>
                <span className="badge mb-3">Let's Talk</span>
                <h1 className="text-2xl font-extrabold text-slate-900 mt-2 mb-1">Get In Touch</h1>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Book a free strategy session — we'll show you exactly how to grow.
                </p>
              </div>

              {/* Contact info 2×2 grid */}
              <div className="grid grid-cols-2 gap-3">
                {contactInfo.map((item, i) => (
                  <div
                    key={i}
                    className="card !p-4 flex gap-3 items-start"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-slate-500 mt-0.5"
                      style={{ background: 'rgba(123,147,255,0.08)', border: '1px solid rgba(123,147,255,0.15)' }}
                    >
                      <span className="scale-75">{item.icon}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{item.label}</div>
                      <div className="text-slate-900 text-sm font-semibold truncate">{item.value}</div>
                      <div className="text-slate-400 text-xs">{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social links */}
              <div>
                <p className="text-xs font-medium text-slate-400 mb-2">Follow us on</p>
                <div className="grid grid-cols-3 gap-2">
                  {socialLinks.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
                      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
                    >
                      <svg width={13} height={13} viewBox="0 0 24 24" fill="currentColor">{s.icon}</svg>
                      <span>{s.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right: Form ── */}
            <div>
              <form className="card !p-6" onSubmit={handleSubmit}>
                <h2 className="text-xl font-extrabold text-slate-900 mb-5">Send Us a Message</h2>

                <div className="grid sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-slate-500 mb-1.5">Full Name *</label>
                    <input
                      id="name" name="name" type="text"
                      value={formData.name} onChange={handleChange}
                      required placeholder="Your full name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-slate-500 mb-1.5">Email *</label>
                    <input
                      id="email" name="email" type="email"
                      value={formData.email} onChange={handleChange}
                      required placeholder="your@email.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label htmlFor="phone" className="block text-xs font-medium text-slate-500 mb-1.5">Phone <span className="text-slate-400">(optional)</span></label>
                    <input
                      id="phone" name="phone" type="tel"
                      value={formData.phone} onChange={handleChange}
                      placeholder="+1 (123) 456-7890"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-xs font-medium text-slate-500 mb-1.5">Service</label>
                    <select
                      id="service" name="service"
                      value={formData.service} onChange={handleChange}
                      className={inputClass}
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="">Select a service</option>
                      <option value="tiktok">TikTok Growth</option>
                      <option value="youtube">YouTube Optimisation</option>
                      <option value="instagram">Instagram Management</option>
                      <option value="facebook">Facebook Marketing</option>
                      <option value="snapchat">Snapchat Campaigns</option>
                      <option value="pinterest">Pinterest Growth</option>
                      <option value="consultation">Free Consultation</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="message" className="block text-xs font-medium text-slate-500 mb-1.5">Message *</label>
                  <textarea
                    id="message" name="message"
                    value={formData.message} onChange={handleChange}
                    required
                    placeholder="Tell us your goals and what you'd like to achieve..."
                    rows={3}
                    className={inputClass}
                    style={{ resize: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="btn-primary w-full"
                  style={{ opacity: status === 'sending' ? 0.65 : 1, cursor: status === 'sending' ? 'not-allowed' : 'pointer' }}
                >
                  {status === 'sending' ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </span>
                  ) : 'Send Message'}
                </button>

                {status === 'sent' && (
                  <div
                    className="mt-5 p-4 rounded-xl text-sm flex items-start gap-3"
                    style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#86efac' }}
                  >
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Message sent! We'll get back to you within 24 hours.
                  </div>
                )}
                {status === 'error' && (
                  <div
                    className="mt-5 p-4 rounded-xl text-sm flex items-start gap-3"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}
                  >
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Something went wrong. Please try again or email us directly.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
