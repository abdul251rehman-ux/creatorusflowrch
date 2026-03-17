import Layout from '../components/Layout';

export default function Privacy() {
  return (
    <Layout title="Privacy Policy" description="CREATORFLOWUS's privacy policy and data protection practices">
      <section className="hero-bg section-padding animate-on-scroll">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-slate-900">
            Privacy Policy
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            At CREATORFLOWUS, we are committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your information.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-4xl mx-auto prose prose-lg prose-invert">
          <div className="card mb-8">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">Information We Collect</h2>
            <p className="text-slate-600 leading-relaxed">
              We may collect personal information such as your name, email address, and social media account details when you contact us or use our services.
            </p>
          </div>

          <div className="card mb-8">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">How We Use Your Information</h2>
            <p className="text-slate-600 leading-relaxed">
              Your information is used to provide our services, communicate with you, and improve our offerings. We do not sell or share your data with third parties without your consent.
            </p>
          </div>

          <div className="card mb-8">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">Data Security</h2>
            <p className="text-slate-600 leading-relaxed">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, or disclosure.
            </p>
          </div>

          <div className="card">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">Contact Us</h2>
            <p className="text-slate-600 leading-relaxed">
              If you have any questions about this privacy policy, please contact us at{' '}
              <a href="mailto:info@creatorflowus.com" className="text-slate-700 underline hover:text-slate-900 transition-colors">
                info@creatorflowus.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
