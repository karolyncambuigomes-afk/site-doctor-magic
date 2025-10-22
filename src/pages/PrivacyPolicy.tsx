import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEOOptimized } from '@/components/SEOOptimized';

const PrivacyPolicy = () => {
  return (
    <>
      <SEOOptimized 
        title="Privacy Policy - Five London"
        description="Privacy policy for Five London luxury escort services. Learn how we protect your personal information and data."
        canonicalUrl="/privacy-policy"
        noIndex={true}
      />
      <Navigation />
      
      <main className="pt-0">
        {/* Hero Section */}
        <section className="pt-20 pb-16 md:py-24 bg-white">
          <div className="container-width text-center">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <h1 className="luxury-heading-xl mb-4 sm:mb-6 text-black">
                Privacy Policy
              </h1>
              <p className="luxury-body-lg text-black mb-12 md:mb-12">
                How we protect and handle your personal information with complete discretion
              </p>
            </div>
          </div>
          {/* Elegant separator */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-black/20 to-transparent"></div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
            
            <section className="mb-8">
              <h2 className="luxury-heading-lg text-foreground mb-4">1. Information We Collect</h2>
              <p className="text-gray-600 mb-4">
                We collect information you provide directly to us, such as when you contact us, 
                request our services, or subscribe to our communications.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Contact information (name, email, phone number)</li>
                <li>Service preferences and requirements</li>
                <li>Communication records</li>
                <li>Technical information (IP address, browser type, device information)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-black mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Provide and improve our services</li>
                <li>Communicate with you about our services</li>
                <li>Ensure the security and integrity of our platform</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-black mb-4">3. Information Sharing</h2>
              <p className="text-gray-600 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except as described in this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-black mb-4">4. Data Security</h2>
              <p className="text-gray-600 mb-4">
                We implement appropriate security measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-black mb-4">5. Cookies</h2>
              <p className="text-gray-600 mb-4">
                We use cookies to enhance your browsing experience and analyze website traffic. 
                You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-black mb-4">6. Your Rights</h2>
              <p className="text-gray-600 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Object to processing of your information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-black mb-4">7. Data Protection</h2>
              <p className="text-gray-600 mb-4">
                Five London implements comprehensive data protection measures:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Advanced encryption for all client communications and data storage</li>
                <li>Regular security audits and system updates to maintain protection</li>
                <li>Staff training on confidentiality and data protection requirements</li>
                <li>Secure disposal of any physical or digital records when no longer needed</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-black mb-4">8. Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
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

export default PrivacyPolicy;