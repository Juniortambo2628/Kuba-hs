import React from "react";

const PageServiceProviderAgreement = () => {
  return (
    <div className="nc-PageServiceProviderAgreement">
      <div className="container py-16 lg:py-28">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-semibold mb-8">KUBA SERVICE PROVIDER AGREEMENT</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-4">Effective Date: March 16, 2026</p>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8 font-semibold">Governing Law: Republic of Kenya</p>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <p className="text-neutral-600 dark:text-neutral-300">This Agreement governs the terms under which the Service Provider will offer services via Kuba Platform.</p>

            <section>
              <h2 className="text-2xl font-semibold mb-4">1. DEFINITIONS</h2>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-300">
                <li><strong>Platform:</strong> The Kuba web and mobile application and associated services.</li>
                <li><strong>Service(s):</strong> Specific tasks offered by the Provider via the Platform.</li>
                <li><strong>User/Client:</strong> Any individual or organization booking services through Kuba.</li>
                <li><strong>Content:</strong> Text, images, data, or materials uploaded or shared on the Platform.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. NATURE OF RELATIONSHIP</h2>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-300">
                <li>The Provider operates as an independent contractor and is not an employee, agent, or partner of Kuba.</li>
                <li>Provider is solely responsible for service delivery, compliance, and legal obligations.</li>
                <li>Kuba only facilitates connections and does not guarantee service quality or safety.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. PROVIDER OBLIGATIONS</h2>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-300">
                <li>Maintain all necessary licenses, certifications, and permits.</li>
                <li>Provide services professionally, timely, and lawfully.</li>
                <li>Maintain confidentiality of User data and Platform information.</li>
                <li>Do not solicit Users outside the Platform.</li>
                <li>Keep records of service delivery as requested by Kuba.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. PLATFORM USAGE</h2>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-300">
                <li><strong>Dos:</strong> Update availability and services accurately, communicate professionally, use Platform legitimately.</li>
                <li><strong>Don’ts:</strong> Misrepresent qualifications, harass Users, share confidential info, bypass Platform fees.</li>
                <li>Violations may lead to suspension, termination, forfeiture of earnings, or legal action.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. PAYMENT TERMS</h2>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-300">
                <li>Payments via approved Kuba methods; escrow may be used until service confirmation.</li>
                <li>Kuba deducts platform commission as agreed before service.</li>
                <li>Provider responsible for taxes under Kenyan law.</li>
                <li>Disputed payments reviewed by Kuba; fraudulent chargebacks may lead to suspension or legal action.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. CANCELLATION & REFUNDS</h2>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-300">
                <li>Minimize cancellations; repeated cancellations may incur penalties.</li>
                <li>Refunds issued only if service not delivered or materially deviated.</li>
                <li>Emergency cancellations must be communicated promptly to Kuba and Users.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. CONFIDENTIALITY & DATA PROTECTION</h2>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-300">
                <li>Provider must maintain confidentiality of User data, trade secrets, financial info, and Platform processes.</li>
                <li>Breaches may result in termination and legal liability.</li>
                <li>Provider agrees to comply with Kuba Privacy Policy and Kenya Data Protection Act, 2019.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. INTELLECTUAL PROPERTY</h2>
              <p className="text-neutral-600 dark:text-neutral-300">Kuba retains rights to Platform software, branding, and proprietary content. Provider retains rights to original materials but grants Kuba a non-exclusive license to display them.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">9. INDEMNIFICATION</h2>
              <p className="text-neutral-600 dark:text-neutral-300">Provider indemnifies Kuba from claims, losses, damages, or liabilities arising from breaches, misconduct, or illegal acts.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">10. BACKGROUND CHECK & VETTING</h2>
              <p className="text-neutral-600 dark:text-neutral-300">Kuba may conduct background checks and credential verification. Platform approval does not guarantee endorsement or performance.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">11. LIMITATION OF LIABILITY</h2>
              <p className="text-neutral-600 dark:text-neutral-300">Kuba not liable for indirect, incidental, punitive, or consequential damages. Total liability limited to fees collected for disputed service. Users engage Providers at their own risk.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. DISPUTE RESOLUTION</h2>
              <p className="text-neutral-600 dark:text-neutral-300">Attempt amicable resolution first. Disputes proceed to mediation, then binding arbitration in Nairobi if unresolved. Agreement governed by Republic of Kenya law.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. TERMINATION</h2>
              <p className="text-neutral-600 dark:text-neutral-300">Kuba may suspend or terminate Provider access for breaches, misconduct, fraud, or legal non-compliance.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageServiceProviderAgreement;
