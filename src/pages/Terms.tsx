import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';

const Terms = () => {
  return (
    <>
      <SEO 
        title="Terms of Service - Five London"
        description="Terms of service for Five London luxury escort services. Read our terms and conditions."
        canonicalUrl="/terms"
        noIndex={true}
      />
      <Navigation />
      
      <main className="pt-16">
        <section className="py-12 md:py-20 lg:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-light text-black mb-8">Terms of Service</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-light text-black mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing and using Five London services, you accept and agree to be bound by 
                the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-black mb-4">2. Service Description</h2>
              <p className="text-gray-600 mb-4">
                Five London provides luxury companion services for social events, business functions, 
                and private engagements in London.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-black mb-4">3. Booking and Payment</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>All bookings must be confirmed in advance</li>
                <li>Payment is required prior to service</li>
                <li>Cancellation policy applies to all bookings</li>
                <li>Additional charges may apply for extended services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-black mb-4">4. Client Responsibilities</h2>
              <p className="text-gray-600 mb-4">Clients agree to:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Treat our companions with respect and courtesy</li>
                <li>Provide accurate information during booking</li>
                <li>Comply with all applicable laws</li>
                <li>Maintain confidentiality and discretion</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-black mb-4">5. Privacy and Confidentiality</h2>
              <p className="text-gray-600 mb-4">
                We maintain strict confidentiality regarding all client information and expect 
                the same level of discretion from our clients.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-black mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">
                Five London shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-black mb-4">7. Contact Information</h2>
              <p className="text-gray-600 mb-4">
                For questions regarding these terms, please contact us at:
              </p>
              <p className="text-gray-600">
                Email: models@exclusivefivelondon.com<br />
                Phone: +44 7436 190679
              </p>
            </section>
          </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default Terms;