"use client";

import React, { FC, useState } from "react";
import SectionSubscribe2 from "@/components/SectionSubscribe2";
import SocialsList from "@/shared/SocialsList";
import Label from "@/components/Label";
import Input from "@/shared/Input";
import Textarea from "@/shared/Textarea";
import ButtonPrimary from "@/shared/ButtonPrimary";

export interface PageContactProps {}

const info = [
  {
    title: "🗺 ADDRESS",
    desc: "Nissi Insights, Nairobi, Kenya",
  },
  {
    title: "💌 EMAIL",
    desc: "contact@kuba.com",
  },
  {
    title: "☎ PHONE",
    desc: "+254 700 000 000",
  },
];

const PageContact: FC<PageContactProps> = ({}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(false);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
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
      console.error("Contact form submission failed:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`nc-PageContact overflow-hidden`}>
      <div className="mb-24 lg:mb-32">
        <h2 className="my-16 sm:my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Contact
        </h2>
        <div className="container max-w-7xl mx-auto">
          <div className="flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-12 ">
            <div className="max-w-sm space-y-8">
              {info.map((item, index) => (
                <div key={index}>
                  <h3 className="uppercase font-semibold text-sm dark:text-neutral-200 tracking-wider">
                    {item.title}
                  </h3>
                  <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
                    {item.desc}
                  </span>
                </div>
              ))}
              <div>
                <h3 className="uppercase font-semibold text-sm dark:text-neutral-200 tracking-wider">
                  🌏 SOCIALS
                </h3>
                <SocialsList className="mt-2" />
              </div>
            </div>
            <div>
              <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
                <label className="block">
                  <Label>Full name</Label>
                  <Input
                    name="name"
                    placeholder="Example Doe"
                    type="text"
                    className="mt-1"
                    required
                  />
                </label>
                <label className="block">
                  <Label>Email address</Label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="example@example.com"
                    className="mt-1"
                    required
                  />
                </label>
                <label className="block">
                  <Label>Message</Label>
                  <Textarea name="message" className="mt-1" rows={6} required />
                </label>
                
                {success && (
                  <div className="p-4 bg-green-100 text-green-800 rounded-2xl text-center text-sm">
                    Thank you! Your message has been sent successfully. We will get back to you soon.
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-100 text-red-800 rounded-2xl text-center text-sm">
                    Oops! Something went wrong. Please try again later.
                  </div>
                )}

                <div>
                  <ButtonPrimary type="submit" loading={loading}>Send Message</ButtonPrimary>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <SectionSubscribe2 className="pb-24 lg:pb-32" />
      </div>
    </div>
  );
};

export default PageContact;
