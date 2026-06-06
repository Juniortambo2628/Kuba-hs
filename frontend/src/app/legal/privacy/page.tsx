import React from "react";
import { LegalPageLayout } from "@/components/layout/LegalPageLayout";
import { designSystem } from "@/lib/design-system";

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy">
          <section className="space-y-4">
            <p className={designSystem.typography.legal.meta}>Effective Date: March 18, 2026</p>
            <p className={designSystem.typography.legal.meta}>Governing Law: Republic of Kenya</p>
          </section>

          <section>
            <p className={designSystem.typography.legal.paragraph}>Kuba complies with the Data Protection Act, 2019 (Kenya). We collect personal information including names, contact details, payment data, and service history. Data is used to facilitate services, improve performance, and comply with legal obligations.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 uppercase tracking-tight text-gray-900 dark:text-white">Data Protection Measures</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-muted-foreground font-medium">
              <li>Encryption protocols and secure payment gateways are implemented.</li>
              <li>Access controls restrict unauthorized access.</li>
              <li>User data is not sold to third parties.</li>
            </ul>
          </section>

          <section>
            <h2 className={designSystem.typography.legal.h2}>Your Rights</h2>
            <p className="text-gray-600 dark:text-muted-foreground leading-relaxed font-medium">Users may request access, correction, or deletion of their personal data subject to legal requirements. We implement encryption, access controls, and secure systems to protect your information.</p>
          </section>

          <section>
             <h2 className="text-xl font-bold mb-4 uppercase tracking-tight text-gray-900 dark:text-white">Cookie Policy</h2>
             <p className="text-gray-600 dark:text-muted-foreground leading-relaxed font-medium">Kuba uses cookies to improve user experience and analyze traffic. Users may manage cookie preferences through browser settings. By using the platform, users consent to cookie usage.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 uppercase tracking-tight text-gray-900 dark:text-white">Nairobi Launch Addendum</h2>
            <p className="text-gray-600 dark:text-muted-foreground leading-relaxed font-medium">Initial operations are based in Nairobi, Kenya. Compliance with local county regulations and Kenyan national laws applies. Expansion to other regions will comply with applicable local regulations.</p>
          </section>
    </LegalPageLayout>
  );
}
