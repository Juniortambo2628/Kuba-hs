"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Shield, Scale } from "lucide-react";

export type LegalModalType = "terms" | "privacy" | null;

export function LegalModals() {
  const [activeModal, setActiveModal] = useState<LegalModalType>(null);

  // Listen for custom events to open modals from anywhere
  useEffect(() => {
    const handleOpenModal = (e: any) => {
      setActiveModal(e.detail);
    };
    window.addEventListener("open-legal-modal", handleOpenModal);
    return () => window.removeEventListener("open-legal-modal", handleOpenModal);
  }, []);

  const close = () => setActiveModal(null);

  return (
    <>
      {/* Terms of Service Modal */}
      <Dialog open={activeModal === "terms"} onOpenChange={(open) => !open && close()}>
        <DialogContent className="bg-zinc-950 border-white/10 text-white max-w-3xl rounded-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-8 pb-4">
            <DialogTitle className="text-3xl font-bold flex items-center gap-3">
              <Scale className="w-8 h-8 text-indigo-500" />
              Terms of Service
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="flex-1 px-8 pb-10">
            <div className="space-y-8 text-gray-400 text-sm leading-relaxed">
              <p className="text-gray-300 italic">Last Updated: March 12, 2024</p>
              
              <section className="space-y-4">
                <h3 className="text-white text-lg font-semibold">1. Acceptance of Terms</h3>
                <p>
                  By accessing and using the Kuba platform, you agree to be bound by these Terms of Service. 
                  If you do not agree to all of these terms, do not use our services.
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="text-white text-lg font-semibold">2. Description of Service</h3>
                <p>
                  Kuba is a technology platform that connects homeowners (Customers) with home service professionals (Providers). 
                  Kuba does not provide home services directly and is not an employer of the Providers.
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="text-white text-lg font-semibold">3. User Responsibilities</h3>
                <p>
                  Users must provide accurate information when creating an account. 
                  Customers are responsible for providing clear access to their property for scheduled services. 
                  Providers are responsible for maintain valid licenses and insurance as required by law.
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="text-white text-lg font-semibold">4. Payments & Refunds</h3>
                <p>
                  Payments are processed through our partner, Stripe. By using our payment features, you agree to Stripe's terms. 
                  Refunds are subject to our cancellation policy, which varies by service category.
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="text-white text-lg font-semibold">5. Limitation of Liability</h3>
                <p>
                  Kuba is not liable for any damages arising from the conduct of Providers or Customers. 
                  Our total liability is limited to the amount paid for the specific service in question.
                </p>
              </section>

              <div className="pt-6 text-xs text-gray-600 border-t border-white/5">
                Questions about the Terms should be sent to legal@kuba.com
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Modal */}
      <Dialog open={activeModal === "privacy"} onOpenChange={(open) => !open && close()}>
        <DialogContent className="bg-zinc-950 border-white/10 text-white max-w-3xl rounded-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-8 pb-4">
            <DialogTitle className="text-3xl font-bold flex items-center gap-3">
              <Shield className="w-8 h-8 text-indigo-500" />
              Privacy Policy
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="flex-1 px-8 pb-10">
            <div className="space-y-8 text-gray-400 text-sm leading-relaxed">
              <p className="text-gray-300 italic">Last Updated: March 12, 2024</p>
              
              <section className="space-y-4">
                <h3 className="text-white text-lg font-semibold">1. Information We Collect</h3>
                <p>
                  We collect information you provide directly to us, such as when you create an account, 
                  book a service, or contact us for support. This includes your name, email, phone number, 
                  and service address.
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="text-white text-lg font-semibold">2. How We Use Information</h3>
                <p>
                  We use the information to facilitate connections between Customers and Providers, 
                  process payments, and improve our services through analytics and feedback.
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="text-white text-lg font-semibold">3. Information Sharing</h3>
                <p>
                  We share your location and contact details with Providers only after a booking is confirmed. 
                  We do not sell your personal data to third parties for marketing purposes.
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="text-white text-lg font-semibold">4. Data Security</h3>
                <p>
                  We use industry-standard encryption and security measures to protect your data. 
                  However, no system is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="text-white text-lg font-semibold">5. Your Rights</h3>
                <p>
                  You have the right to access, correct, or delete your personal information at any time 
                  through your account settings or by contacting our privacy team.
                </p>
              </section>

              <div className="pt-6 text-xs text-gray-600 border-t border-white/5">
                For more details, contact privacy@kuba.com
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Helper to trigger modals from anywhere
export function openLegalModal(type: LegalModalType) {
  const event = new CustomEvent("open-legal-modal", { detail: type });
  window.dispatchEvent(event);
}
