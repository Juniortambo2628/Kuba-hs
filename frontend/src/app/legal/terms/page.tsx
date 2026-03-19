import React from "react";
import { designSystem } from "@/lib/design-system";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container px-6 pt-32 pb-24 mx-auto max-w-4xl">
        <h1 className={designSystem.typography.legal.h1}>User Terms & Conditions</h1>
        <div className="prose prose-blue dark:prose-invert max-w-none space-y-8">
          <section className="space-y-4">
            <p className={designSystem.typography.legal.meta}>Effective Date: March 18, 2026</p>
            <p className={designSystem.typography.legal.meta}>Governing Law: Republic of Kenya</p>
            <p className={designSystem.typography.section.subtitle + " italic"}>These Terms govern access and use of the Kuba multi-service platform.</p>
          </section>

          <section>
            <h2 className={designSystem.typography.legal.h2}>1. DEFINITIONS</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-muted-foreground font-medium">
              <li><strong>Platform:</strong> The Kuba web and mobile application.</li>
              <li><strong>User:</strong> Any individual or entity booking services through Kuba.</li>
              <li><strong>Service Provider:</strong> Independent contractor offering services via the Platform.</li>
              <li><strong>Services:</strong> Tasks or work booked through the Platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 uppercase tracking-tight text-gray-900 dark:text-white">2. ROLE OF KUBA</h2>
            <p className="text-gray-600 dark:text-muted-foreground leading-relaxed font-medium">Kuba acts solely as a technology intermediary connecting Users and independent Service Providers. Kuba does not directly provide the listed services unless expressly stated. Kuba does not guarantee the quality, safety, or legality of services.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 uppercase tracking-tight text-gray-900 dark:text-white">3. USER OBLIGATIONS</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-muted-foreground font-medium">
              <li>Provide accurate and truthful information.</li>
              <li>Use the Platform for lawful purposes only.</li>
              <li>Treat Service Providers respectfully and professionally.</li>
              <li>Make payments through approved Kuba payment systems only.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 uppercase tracking-tight text-gray-900 dark:text-white">4. PROHIBITED CONDUCT</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-muted-foreground font-medium">
              <li>Circumventing the Platform to avoid payment of fees.</li>
              <li>Harassment, discrimination, or abusive conduct.</li>
              <li>Fraudulent chargebacks or false disputes.</li>
              <li>Posting false reviews or misleading information.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 uppercase tracking-tight text-gray-900 dark:text-white">5. PAYMENT TERMS</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-muted-foreground font-medium">
              <li>All payments must be processed via Kuba-approved methods.</li>
              <li>Payments may be held in escrow until service completion confirmation.</li>
              <li>Cancellation fees may apply depending on timing.</li>
              <li>Fraudulent payment reversals may result in suspension and legal action.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 uppercase tracking-tight text-gray-900 dark:text-white">6. CANCELLATION & REFUND POLICY</h2>
            <p className="text-gray-600 dark:text-muted-foreground leading-relaxed font-medium">Users may cancel within the allowed time window without penalty. Late cancellations or no-shows may incur charges. Refunds are issued only if service was not delivered or materially deviated from the agreed scope.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 uppercase tracking-tight text-gray-900 dark:text-white">7. LIMITATION OF LIABILITY</h2>
            <p className="text-gray-600 dark:text-muted-foreground leading-relaxed font-medium">To the fullest extent permitted by law, Kuba is not liable for indirect or consequential damages. Kuba’s total liability shall not exceed the amount paid for the disputed service. Users engage Service Providers at their own discretion and risk.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 uppercase tracking-tight text-gray-900 dark:text-white">8. PRIVACY & DATA PROTECTION</h2>
            <p className="text-gray-600 dark:text-muted-foreground leading-relaxed font-medium">Kuba collects personal information necessary to facilitate services. Data is processed in accordance with applicable Kenyan data protection laws. Kuba implements encryption, access controls, and secure systems to protect information. Users may request access, correction, or deletion of their personal data subject to legal requirements.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 uppercase tracking-tight text-gray-900 dark:text-white">9. DISPUTE RESOLUTION</h2>
            <p className="text-gray-600 dark:text-muted-foreground leading-relaxed font-medium">Parties agree to attempt amicable resolution first. If unresolved, disputes shall proceed to mediation, then binding arbitration in Nairobi, Kenya. These Terms are governed by the laws of the Republic of Kenya.</p>
          </section>

          <section>
            <h2 className={designSystem.typography.legal.h2}>10. ACCOUNT SUSPENSION & TERMINATION</h2>
            <p className="text-gray-600 dark:text-muted-foreground leading-relaxed font-medium">Kuba may suspend or terminate User accounts for breach of these Terms, fraudulent activity, or misuse of the Platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 uppercase tracking-tight text-gray-900 dark:text-white">11. DISCLAIMER</h2>
            <p className="text-gray-600 dark:text-muted-foreground leading-relaxed font-medium">The Platform is provided 'as is' without warranties of any kind. Kuba does not guarantee uninterrupted or error-free access.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 uppercase tracking-tight text-gray-900 dark:text-white">12. ACCEPTANCE</h2>
            <p className="text-gray-600 dark:text-muted-foreground leading-relaxed font-medium">By creating an account or using the Platform, the User confirms acceptance of these Terms.</p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
