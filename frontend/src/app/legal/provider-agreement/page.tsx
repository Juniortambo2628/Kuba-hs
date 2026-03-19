import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { designSystem } from "@/lib/design-system";

export default function ProviderAgreementPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container px-6 pt-32 pb-24 mx-auto max-w-4xl">
        <h1 className={designSystem.typography.legal.h1}>Service Provider Agreement</h1>
        <div className="prose prose-blue dark:prose-invert max-w-none space-y-8">
          <section className="space-y-4">
            <p className={designSystem.typography.legal.meta}>Effective Date: March 18, 2026</p>
            <p className={designSystem.typography.legal.meta}>Governing Law: Republic of Kenya</p>
            <p className={designSystem.typography.legal.paragraph + " italic"}>This Agreement governs the terms under which the Service Provider will offer services via Kuba Platform.</p>
          </section>

          <section>
            <h2 className={designSystem.typography.legal.h2}>1. DEFINITIONS</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-muted-foreground font-medium">
              <li><strong>Platform:</strong> The Kuba web and mobile application and associated services.</li>
              <li><strong>Service(s):</strong> Specific tasks offered by the Provider via the Platform.</li>
              <li><strong>User/Client:</strong> Any individual or organization booking services through Kuba.</li>
              <li><strong>Content:</strong> Text, images, data, or materials uploaded or shared on the Platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 uppercase tracking-tight text-gray-900 dark:text-white">2. NATURE OF RELATIONSHIP</h2>
            <p className="text-gray-600 dark:text-muted-foreground leading-relaxed font-medium">The Provider operates as an independent contractor and is not an employee, agent, or partner of Kuba. Provider is solely responsible for service delivery, compliance, and legal obligations. Kuba only facilitates connections and does not guarantee service quality or safety.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 uppercase tracking-tight text-gray-900 dark:text-white">3. PROVIDER OBLIGATIONS</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-muted-foreground font-medium">
              <li>Maintain all necessary licenses, certifications, and permits.</li>
              <li>Provide services professionally, timely, and lawfully.</li>
              <li>Maintain confidentiality of User data and Platform information.</li>
              <li>Do not solicit Users outside the Platform.</li>
              <li>Keep records of service delivery as requested by Kuba.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 uppercase tracking-tight text-gray-900 dark:text-white">4. PLATFORM USAGE</h2>
            <p className="text-gray-600 dark:text-muted-foreground leading-relaxed font-medium"><strong>Dos:</strong> Update availability and services accurately, communicate professionally, use Platform legitimately.</p>
            <p className="text-gray-600 dark:text-muted-foreground leading-relaxed font-medium"><strong>Don’ts:</strong> Misrepresent qualifications, harass Users, share confidential info, bypass Platform fees. Violations may lead to suspension, termination, forfeiture of earnings, or legal action.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 uppercase tracking-tight text-gray-900 dark:text-white">5. PAYMENT TERMS</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-muted-foreground font-medium">
              <li>Payments via approved Kuba methods; escrow may be used until service confirmation.</li>
              <li>Kuba deducts platform commission as agreed before service.</li>
              <li>Provider responsible for taxes under Kenyan law.</li>
              <li>Disputed payments reviewed by Kuba; fraudulent chargebacks may lead to suspension or legal action.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 uppercase tracking-tight text-gray-900 dark:text-white">6. CANCELLATION & REFUNDS</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-muted-foreground font-medium">
              <li>Minimize cancellations; repeated cancellations may incur penalties.</li>
              <li>Refunds issued only if service not delivered or materially deviated.</li>
              <li>Emergency cancellations must be communicated promptly to Kuba and Users.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 uppercase tracking-tight text-gray-900 dark:text-white">7. CONFIDENTIALITY & DATA PROTECTION</h2>
            <p className="text-gray-600 dark:text-muted-foreground leading-relaxed font-medium">Provider must maintain confidentiality of User data, trade secrets, financial info, and Platform processes. Breaches may result in termination and legal liability. Provider agrees to comply with Kuba Privacy Policy and Kenya Data Protection Act, 2019.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 uppercase tracking-tight text-gray-900 dark:text-white">8. INTELLECTUAL PROPERTY</h2>
            <p className="text-gray-600 dark:text-muted-foreground leading-relaxed font-medium">Kuba retains rights to Platform software, branding, and proprietary content. Provider retains rights to original materials but grants Kuba a non-exclusive license to display them. Content created for Kuba in collaboration belongs to Kuba unless agreed otherwise in writing.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 uppercase tracking-tight text-gray-900 dark:text-white">9. INDEMNIFICATION</h2>
            <p className="text-gray-600 dark:text-muted-foreground leading-relaxed font-medium">Provider indemnifies Kuba from claims, losses, damages, or liabilities arising from breaches, misconduct, or illegal acts.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 uppercase tracking-tight text-gray-900 dark:text-white">10. BACKGROUND CHECK & VETTING</h2>
            <p className="text-gray-600 dark:text-muted-foreground leading-relaxed font-medium">Kuba may conduct background checks and credential verification. Platform approval does not guarantee endorsement or performance.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 uppercase tracking-tight text-gray-900 dark:text-white">11. LIMITATION OF LIABILITY</h2>
            <p className="text-gray-600 dark:text-muted-foreground leading-relaxed font-medium">Kuba not liable for indirect, incidental, punitive, or consequential damages. Total liability limited to fees collected for disputed service. Users engage Providers at their own risk.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 uppercase tracking-tight text-gray-900 dark:text-white">12. DISPUTE RESOLUTION</h2>
            <p className="text-gray-600 dark:text-muted-foreground leading-relaxed font-medium">Attempt amicable resolution first. Disputes proceed to mediation, then binding arbitration in Nairobi if unresolved. Agreement governed by Republic of Kenya law.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 uppercase tracking-tight text-gray-900 dark:text-white">13. TERMINATION</h2>
            <p className="text-gray-600 dark:text-muted-foreground leading-relaxed font-medium">Kuba may suspend or terminate Provider access for breaches, misconduct, fraud, or legal non-compliance.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 uppercase tracking-tight text-gray-900 dark:text-white">14. FORCE MAJEURE</h2>
            <p className="text-gray-600 dark:text-muted-foreground leading-relaxed font-medium">Neither Party liable for delays or failures due to events beyond reasonable control (natural disasters, government actions, outages, unrest).</p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
