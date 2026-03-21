"use client";

import React, { useState } from "react";
import SectionHero from "@/app/(server-components)/SectionHero";
import BgGlassmorphism from "@/components/BgGlassmorphism";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
import Textarea from "@/shared/Textarea";

const InvestorsPage = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/investors/inquire`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Investment inquiry failed:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nc-InvestorsPage relative overflow-hidden">
      <BgGlassmorphism />
      
      <div className="container relative py-16 lg:py-28 space-y-16 lg:space-y-28">
        <section className="text-center max-w-screen-md mx-auto space-y-6">
            <h1 className="text-4xl font-semibold sm:text-5xl lg:text-6xl">Invest in the Future of Service Delivery</h1>
            <p className="text-lg text-neutral-500 dark:text-neutral-400">
                Kuba is revolutionizing how services are discovered and booked across Africa. Join us on our mission to empower thousands of professionals and simplify lives for millions of customers.
            </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm text-center space-y-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mx-auto text-orange-600">
                    <i className="las la-chart-line text-3xl"></i>
                </div>
                <h3 className="text-xl font-semibold">Scaling Growth</h3>
                <p className="text-neutral-500 text-sm">Consistent month-over-month growth in user base and service bookings.</p>
            </div>
            <div className="p-8 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm text-center space-y-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto text-blue-600">
                    <i className="las la-users text-3xl"></i>
                </div>
                <h3 className="text-xl font-semibold">Empowered Workforce</h3>
                <p className="text-neutral-500 text-sm">Providing verified professionals with the tools they need to thrive in the digital economy.</p>
            </div>
            <div className="p-8 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm text-center space-y-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto text-green-600">
                    <i className="las la-globe text-3xl"></i>
                </div>
                <h3 className="text-xl font-semibold">Market Expansion</h3>
                <p className="text-neutral-500 text-sm">Strategic roadmap for expansion into emerging high-growth markets.</p>
            </div>
        </section>

        <section className="max-w-screen-md mx-auto bg-white dark:bg-neutral-900 p-8 sm:p-12 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-xl space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-semibold">Investor Inquiry</h2>
                <p className="text-neutral-500">Reach out to our investor relations team for more information.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <label className="block space-y-1">
                        <span className="text-neutral-800 dark:text-neutral-200 text-sm font-medium">Full Name</span>
                        <Input type="text" name="name" placeholder="John Doe" required />
                    </label>
                    <label className="block space-y-1">
                        <span className="text-neutral-800 dark:text-neutral-200 text-sm font-medium">Email Address</span>
                        <Input type="email" name="email" placeholder="john@example.com" required />
                    </label>
                </div>
                <label className="block space-y-1">
                    <span className="text-neutral-800 dark:text-neutral-200 text-sm font-medium">Organization / Fund</span>
                    <Input type="text" name="organization" placeholder="Venture Capital Co." required />
                </label>
                <label className="block space-y-1">
                    <span className="text-neutral-800 dark:text-neutral-200 text-sm font-medium">Message</span>
                    <Textarea name="message" rows={4} placeholder="Tell us more about your interest..." required />
                </label>

                {success && (
                  <div className="p-4 bg-green-100 text-green-800 rounded-2xl text-center text-sm">
                    Thank you! Your inquiry has been received. Our team will contact you shortly.
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-100 text-red-800 rounded-2xl text-center text-sm">
                    Something went wrong. Please try again or contact us directly at investors@kuba.com.
                  </div>
                )}

                <ButtonPrimary type="submit" className="w-full" loading={loading}>
                    Submit Inquiry
                </ButtonPrimary>
            </form>
        </section>
      </div>
    </div>
  );
};

export default InvestorsPage;
