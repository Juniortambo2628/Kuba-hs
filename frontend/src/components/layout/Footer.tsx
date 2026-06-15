"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { openLegalModal } from "@/components/shared/LegalModals";
import { useCMS } from "@/contexts/CMSContext";
import { footerUi } from "@/lib/footer-ui";
import { uiPrimitives } from "@/lib/ui-primitives";
import { cn } from "@/lib/utils";

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href?: string; onClick?: () => void }[];
}) {
  return (
    <div>
      <h3 className={footerUi.sectionTitle}>{title}</h3>
      <ul className={footerUi.linkList}>
        {links.map((item) => (
          <li key={item.label}>
            {item.href ? (
              <Link href={item.href} className={footerUi.link}>
                {item.label}
              </Link>
            ) : (
              <button
                type="button"
                onClick={item.onClick}
                className={cn(footerUi.link, "text-left")}
              >
                {item.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const { getS, getImg } = useCMS();
  const logoLight = getImg(
    "identity",
    "logo_light",
    "/assets/Kuba-Header-footter-Logo-for-Light-Mode.png"
  );
  const logoDark = getImg(
    "identity",
    "logo_dark",
    "/assets/Kuba-Header-Footer-Logo-for-Dark-Mode.png"
  );

  const year = new Date().getFullYear();

  return (
    <footer className={footerUi.root}>
      <div className={cn(uiPrimitives.layout.page, footerUi.inner)}>
        <div className={footerUi.grid}>
          <div className={footerUi.brandCol}>
            <Link href="/" className="inline-flex">
              <span className={footerUi.logo}>
                <Image
                  src={logoLight}
                  alt="Kuba"
                  fill
                  sizes="180px"
                  className="object-contain object-left dark:hidden"
                />
                <Image
                  src={logoDark}
                  alt="Kuba"
                  fill
                  sizes="180px"
                  className="object-contain object-left hidden dark:block"
                />
              </span>
            </Link>
            <p className={footerUi.tagline}>
              {getS(
                "identity",
                "footer_description",
                "Kuba is Kenya's marketplace for trusted home and business services — book verified professionals in minutes."
              )}
            </p>
          </div>

          <div className={cn(footerUi.linkCol, footerUi.stackedSection)}>
            <FooterLinkColumn
              title="Services"
              links={[
                { label: "Browse services", href: "/services" },
                { label: "Categories", href: "/categories" },
                { label: "Find professionals", href: "/providers" },
              ]}
            />
            <FooterLinkColumn
              title="Partner"
              links={[
                { label: "Join as a pro", href: "/register/provider" },
                { label: "Provider sign in", href: "/login/provider" },
              ]}
            />
          </div>

          <div className={cn(footerUi.linkCol, footerUi.stackedSection)}>
            <FooterLinkColumn
              title="Company"
              links={[
                { label: "About us", href: "/about" },
                { label: "Journal", href: "/blog" },
                { label: "Contact", href: "/contact" },
              ]}
            />
            <FooterLinkColumn
              title="Explore"
              links={[
                { label: "Commercial", href: "/commercial" },
                { label: "Cooperatives", href: "/cooperatives" },
                { label: "Investors", href: "/investors" },
              ]}
            />
          </div>

          <div className={footerUi.socialCol}>
            <h3 className={footerUi.sectionTitle}>Follow us</h3>
            <div className={footerUi.socialRow}>
              <a
                href={getS("social_links", "social_instagram", "#")}
                className={footerUi.socialIcon}
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={getS("social_links", "social_linkedin", "#")}
                className={footerUi.socialIcon}
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={getS("social_links", "social_facebook", "#")}
                className={footerUi.socialIcon}
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={getS("social_links", "social_twitter", "#")}
                className={footerUi.socialIcon}
                aria-label="X (Twitter)"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className={cn(footerUi.bottomBar, "flex flex-col md:flex-row items-center justify-between gap-4")}>
          <p className="text-center md:text-left">Copyright © {year} Kuba Platform Inc. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-center">
            <a
              href="/policies/Kuba_Comprehensive_Service_Provider_Policy.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={footerUi.bottomLink}
            >
              Comprehensive Service Provider Policy
            </a>
            <span className="hidden xl:inline text-muted-foreground/40">|</span>
            <a
              href="/policies/Kuba_Risk_Management_and_Professional_Conduct_Policy.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={footerUi.bottomLink}
            >
              Risk Management & Professional Conduct
            </a>
            <span className="hidden xl:inline text-muted-foreground/40">|</span>
            <a
              href="/policies/Kuba_Service_Provider_Code_of_Conduct_and_Accountability_Policy.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={footerUi.bottomLink}
            >
              Code of Conduct & Accountability
            </a>
            <span className="hidden xl:inline text-muted-foreground/40">|</span>
            <a
              href="/policies/Kuba_Legal_Pack_(Dated-130626).pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={footerUi.bottomLink}
            >
              Legal Pack
            </a>
            <span className="hidden xl:inline text-muted-foreground/40">|</span>
            <a
              href="/policies/Kuba_Service_Provider_Agreement_(Dated-130626).pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={footerUi.bottomLink}
            >
              Service Provider Agreement
            </a>
            <span className="hidden xl:inline text-muted-foreground/40">|</span>
            <a
              href="/policies/Kuba_User_Terms_and_Conditions_(Dated-130626).pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={footerUi.bottomLink}
            >
              User Terms & Conditions
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground/80 mt-6">
          Made with care by{" "}
          <a
            href="https://okjtech.co.ke"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:text-foreground transition-colors"
          >
            OKJ Technologies
          </a>
        </p>
      </div>
    </footer>
  );
}
