import Layout from '../components/Layout';
import Link from 'next/link';
import { useState } from 'react';

const faqs = [
  {
    question: 'What services does CREATORUSFLOW offer?',
    answer: 'We provide comprehensive social media solutions including growth strategies, content creation, monetisation setup, automation tools, analytics, and community management for TikTok, YouTube, Instagram, Facebook, Snapchat, and Pinterest.',
  },
  {
    question: 'How long does it take to see results?',
    answer: 'Results vary by platform and current account status, but most clients see initial growth within 2–4 weeks. Significant results typically appear within 1–3 months with consistent implementation of our strategies.',
  },
  {
    question: 'Do you offer free consultations?',
    answer: 'Yes! We provide a complimentary social media audit to assess your current presence, identify opportunities, and create a customised growth plan. This helps us understand your goals and demonstrate our expertise before any commitment.',
  },
  {
    question: 'What is your pricing structure?',
    answer: 'Our pricing is flexible and depends on the services selected, platforms managed, and scope of work. Packages start from $500/month for basic management up to $5,000+/month for comprehensive enterprise solutions. Contact us for a personalised quote.',
  },
  {
    question: 'Can you manage multiple platforms at once?',
    answer: 'Absolutely. Our integrated approach allows us to manage multiple platforms simultaneously, ensuring consistent branding and cross-platform promotion for maximum reach and engagement.',
  },
  {
    question: 'Do you create content or just manage accounts?',
    answer: 'Both. Our team can develop complete content calendars, create engaging posts, edit videos, and optimise your existing content for better performance — or just handle strategy and management if you prefer to create your own content.',
  },
  {
    question: 'What makes CREATORUSFLOW different from other agencies?',
    answer: "Our data-driven approach, proprietary automation tools, and focus on long-term sustainable growth set us apart. We don't just boost numbers — we build authentic communities and create lasting value for your brand.",
  },
  {
    question: 'Do you work with international clients?',
    answer: 'Yes. We serve clients in over 20 countries and have experience with global markets, cultural nuances, and international platform algorithms. Our team handles time zone differences and localisation strategies.',
  },
  {
    question: "What if I'm not satisfied with the results?",
    answer: "We stand behind our work with a 30-day satisfaction guarantee. If you're not seeing the promised results, we'll adjust our strategy or provide a full refund. Your success is our priority.",
  },
  {
    question: 'How do you handle account security and privacy?',
    answer: 'Security is paramount. We use enterprise-grade encryption, two-factor authentication, and never share your account credentials. All team members sign NDAs, and we follow strict data protection protocols.',
  },
];

export default function FAQs() {
  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <Layout title="FAQs" description="Frequently asked questions about CREATORUSFLOW's social media growth services.">

      {/* ── Hero ── */}
      <section className="hero-section section-padding relative" style={{ minHeight: '44vh', display: 'flex', alignItems: 'center' }}>
        <div className="orb orb-primary animate-float" style={{ width: 500, height: 500, top: '-20%', left: '-5%', opacity: 0.5 }} />
        <div className="orb orb-orange animate-float-slow" style={{ width: 400, height: 400, bottom: '-20%', right: '-5%', opacity: 0.4 }} />

        <div className="container-custom relative z-10 w-full">
          <div className="text-center max-w-3xl mx-auto animate-on-scroll">
            <span className="badge mb-5">Got Questions?</span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
              Frequently Asked{' '}
              <span className="text-slate-900">Questions</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Everything you need to know about our services, pricing, and how we work.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ Accordion ── */}
      <section className="section-alt section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFAQ === i;
              return (
                <div
                  key={i}
                  className="animate-on-scroll"
                  style={{
                    transitionDelay: `${i * 40}ms`,
                    background: '#FFFFFF',
                    border: isOpen ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(123,147,255,0.15)',
                    borderRadius: '1rem',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <button
                    className="w-full text-left px-6 py-5 flex justify-between items-center gap-4"
                    onClick={() => setOpenFAQ(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-semibold text-slate-900 leading-snug">
                      {faq.question}
                    </span>
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200"
                      style={{
                        background: isOpen ? 'rgba(123,147,255,0.18)' : 'rgba(123,147,255,0.06)',
                        border: isOpen ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(123,147,255,0.15)',
                        color: isOpen ? '#ffffff' : '#64748b',
                      }}
                    >
                      <svg
                        className="w-4 h-4 transition-transform duration-200"
                        style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6">
                      <div className="divider mb-4" />
                      <p className="text-slate-600 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Still have questions CTA ── */}
      <section className="section-padding">
        <div className="container-custom">
          <div
            className="relative overflow-hidden rounded-3xl text-center p-12 md:p-16 animate-on-scroll"
            style={{
              background: 'linear-gradient(135deg, rgba(123,147,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(123,147,255,0.18)',
            }}
          >
            <div className="orb orb-primary" style={{ width: 350, height: 350, top: '-50%', left: '-5%', opacity: 0.5 }} />
            <div className="orb orb-orange" style={{ width: 300, height: 300, bottom: '-50%', right: '-5%', opacity: 0.4 }} />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                Still Have <span className="text-slate-900">Questions?</span>
              </h2>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Can't find what you're looking for? Our team is happy to help — just reach out directly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="btn-primary">
                  Contact Us
                </Link>
                <Link href="/services" className="btn-secondary">
                  Browse Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
