import React from "react";

const PagePrivacy = () => {
  return (
    <div className="nc-PagePrivacy">
      <div className="container py-16 lg:py-28">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-semibold mb-8">KUBA PRIVACY POLICY</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-4">Effective Date: March 16, 2026</p>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8 font-semibold">Governing Law: Republic of Kenya</p>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <p className="text-neutral-600 dark:text-neutral-300">Kuba complies with the Data Protection Act, 2019 (Kenya). We collect personal information including names, contact details, payment data, and service history. Data is used to facilitate services, improve performance, and comply with legal obligations.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">DATA PROTECTION MEASURES</h2>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-300">
                <li>Encryption protocols and secure payment gateways are implemented.</li>
                <li>Access controls restrict unauthorized access.</li>
                <li>User data is not sold to third parties.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">COOKIE POLICY</h2>
              <p className="text-neutral-600 dark:text-neutral-300">Kuba uses cookies to improve user experience and analyze traffic. Users may manage cookie preferences through browser settings. By using the platform, users consent to cookie usage.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">WEBSITE DISCLAIMER</h2>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-300">
                <li>All services are provided 'as is' without warranties of any kind.</li>
                <li>Kuba does not guarantee uninterrupted access to the platform.</li>
                <li>Kuba is not responsible for third-party content or links.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">NAIROBI LAUNCH ADDENDUM</h2>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-300">
                <li>Initial operations are based in Nairobi, Kenya.</li>
                <li>Compliance with local county regulations and Kenyan national laws applies.</li>
                <li>Expansion to other regions will comply with applicable local regulations.</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagePrivacy;
