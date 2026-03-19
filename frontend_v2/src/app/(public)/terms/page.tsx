import React from "react";

const PageTerms = () => {
  return (
    <div className="nc-PageTerms">
      <div className="container py-16 lg:py-28">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-semibold mb-8">KUBA USER TERMS & CONDITIONS</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-4">Effective Date: March 16, 2026</p>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8 font-semibold">Governing Law: Republic of Kenya</p>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. DEFINITIONS</h2>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-300">
                <li><strong>Platform:</strong> The Kuba web and mobile application.</li>
                <li><strong>User:</strong> Any individual or entity booking services through Kuba.</li>
                <li><strong>Service Provider:</strong> Independent contractor offering services via the Platform.</li>
                <li><strong>Services:</strong> Tasks or work booked through the Platform.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. ROLE OF KUBA</h2>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-300">
                <li>Kuba acts solely as a technology intermediary connecting Users and independent Service Providers.</li>
                <li>Kuba does not directly provide the listed services unless expressly stated.</li>
                <li>Kuba does not guarantee the quality, safety, or legality of services.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. USER OBLIGATIONS</h2>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-300">
                <li>Provide accurate and truthful information.</li>
                <li>Use the Platform for lawful purposes only.</li>
                <li>Treat Service Providers respectfully and professionally.</li>
                <li>Make payments through approved Kuba payment systems only.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. PROHIBITED CONDUCT</h2>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-300">
                <li>Circumventing the Platform to avoid payment of fees.</li>
                <li>Harassment, discrimination, or abusive conduct.</li>
                <li>Fraudulent chargebacks or false disputes.</li>
                <li>Posting false reviews or misleading information.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. PAYMENT TERMS</h2>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-300">
                <li>All payments must be processed via Kuba-approved methods.</li>
                <li>Payments may be held in escrow until service completion confirmation.</li>
                <li>Cancellation fees may apply depending on timing.</li>
                <li>Fraudulent payment reversals may result in suspension and legal action.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. CANCELLATION & REFUND POLICY</h2>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-300">
                <li>Users may cancel within the allowed time window without penalty.</li>
                <li>Late cancellations or no-shows may incur charges.</li>
                <li>Refunds are issued only if service was not delivered or materially deviated from the agreed scope.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. LIMITATION OF LIABILITY</h2>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-300">
                <li>To the fullest extent permitted by law, Kuba is not liable for indirect or consequential damages.</li>
                <li>Kuba’s total liability shall not exceed the amount paid for the disputed service.</li>
                <li>Users engage Service Providers at their own discretion and risk.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. PRIVACY & DATA PROTECTION</h2>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-300">
                <li>Kuba collects personal information necessary to facilitate services.</li>
                <li>Data is processed in accordance with applicable Kenyan data protection laws.</li>
                <li>Kuba implements encryption, access controls, and secure systems to protect information.</li>
                <li>Users may request access, correction, or deletion of their personal data subject to legal requirements.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. DISPUTE RESOLUTION</h2>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-300">
                <li>Parties agree to attempt amicable resolution first.</li>
                <li>If unresolved, disputes shall proceed to mediation, then binding arbitration in Nairobi, Kenya.</li>
                <li>These Terms are governed by the laws of the Republic of Kenya.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. ACCOUNT SUSPENSION & TERMINATION</h2>
              <p className="text-neutral-600 dark:text-neutral-300">Kuba may suspend or terminate User accounts for breach of these Terms, fraudulent activity, or misuse of the Platform.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. DISCLAIMER</h2>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-300">
                <li>The Platform is provided 'as is' without warranties of any kind.</li>
                <li>Kuba does not guarantee uninterrupted or error-free access.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. ACCEPTANCE</h2>
              <p className="text-neutral-600 dark:text-neutral-300">By creating an account or using the Platform, the User confirms acceptance of these Terms.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageTerms;
