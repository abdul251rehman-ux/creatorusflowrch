import Layout from '../components/Layout';

export default function Terms() {
  return (
    <Layout title="Terms & Conditions" description="CREATORFLOWUS's terms and conditions for our social media services">
      <section className="hero-bg section-padding animate-on-scroll">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-slate-900">
            Terms & Conditions
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            By using CREATORFLOWUS's services, you agree to the following terms and conditions.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="card">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">Services</h2>
            <p className="text-slate-600 leading-relaxed">
              We provide social media management and consulting services as described on our website. Results may vary based on various factors.
            </p>
          </div>

          <div className="card">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">Payment</h2>
            <p className="text-slate-600 leading-relaxed">
              Payment terms will be outlined in individual service agreements. Late payments may result in service suspension.
            </p>
          </div>

          <div className="card">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">Liability</h2>
            <p className="text-slate-600 leading-relaxed">
              CREATORFLOWUS is not liable for any indirect, incidental, or consequential damages arising from the use of our services.
            </p>
          </div>

          <div className="card">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">Intellectual Property</h2>
            <p className="text-slate-600 leading-relaxed">
              All content and materials provided by CREATORFLOWUS remain our intellectual property unless otherwise agreed.
            </p>
          </div>

          <div className="card">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">Termination</h2>
            <p className="text-slate-600 leading-relaxed">
              Either party may terminate services with written notice. Refunds will be provided based on the termination terms.
            </p>
          </div>

          <div className="card">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">Contact</h2>
            <p className="text-slate-600 leading-relaxed">
              For questions about these terms, contact us at{' '}
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
