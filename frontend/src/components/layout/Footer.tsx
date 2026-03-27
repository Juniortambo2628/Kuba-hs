"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { openLegalModal } from "@/components/shared/LegalModals";
import { useCMS } from "@/contexts/CMSContext";
import Image from "next/image";

export function Footer() {
  const { getS } = useCMS();
  return (
    <footer className="bg-gray-50 dark:bg-[#0B0F19] text-gray-900 dark:text-white py-12 border-t border-gray-200 dark:border-white/10 relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            <div className="md:col-span-1">
                <Link href="/" className="inline-flex items-center gap-2">
                  <div className="relative h-8 w-32 dark:hidden">
                    <Image src={useCMS().getImg('identity', 'logo_light', '/assets/Kuba-Header-footter-Logo-for-Light-Mode.png')} alt="Kuba" fill sizes="128px" className="object-contain" priority />
                  </div>
                  <div className="relative h-8 w-32 hidden dark:block">
                    <Image src={useCMS().getImg('identity', 'logo_dark', '/assets/Kuba-Header-Footer-Logo-for-Dark-Mode.png')} alt="Kuba" fill sizes="128px" className="object-contain" priority />
                  </div>
                </Link>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                {getS('identity', 'footer_description', 'Connect with trusted home service professionals in your area. Quick, reliable, and secure.')}
                </p>
                <div className="flex gap-4">
                <a href={getS('social_links', 'social_facebook', '#')} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-colors">
                    <Facebook className="w-4 h-4" />
                </a>
                <a href={getS('social_links', 'social_twitter', '#')} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-400 transition-colors">
                    <Twitter className="w-4 h-4" />
                </a>
                <a href={getS('social_links', 'social_instagram', '#')} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-pink-600 transition-colors">
                    <Instagram className="w-4 h-4" />
                </a>
                <a href={getS('social_links', 'social_linkedin', '#')} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-700 transition-colors">
                    <Linkedin className="w-4 h-4" />
                </a>
                </div>
            </div>

            <div>
                <h3 className="text-label-caps text-foreground mb-4">For Customers</h3>
                <ul className="space-y-3">
                <li><Link href="/services" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">Browse Services</Link></li>
                <li><Link href="/providers" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">Find Professionals</Link></li>
                <li><Link href="/investors" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-medium transition-colors">Investors</Link></li>
                <li><Link href="/blog" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">Journal</Link></li>
                <li><Link href="/about" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">About Us</Link></li>
                <li><Link href="/commercial" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">Commercial</Link></li>
                <li><Link href="/cooperatives" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">Cooperatives</Link></li>
                </ul>
            </div>

            <div>
                <h3 className="text-label-caps text-foreground mb-4">For Providers</h3>
                <ul className="space-y-3">
                <li><Link href="/register?role=provider" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">Join as a Pro</Link></li>
                <li><Link href="/login" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">Provider Login</Link></li>
                </ul>
            </div>

            <div>
                <h3 className="text-label-caps text-foreground mb-4">Legal</h3>
                <ul className="space-y-3">
                <li><button suppressHydrationWarning onClick={() => openLegalModal('terms')} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors text-left w-full">Terms of Service</button></li>
                <li><button suppressHydrationWarning onClick={() => openLegalModal('privacy')} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors text-left w-full">Privacy Policy</button></li>
                <li><Link href="/contact" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">Contact Us</Link></li>
                </ul>
            </div>

            </div>

            <div className="pt-8 border-t border-gray-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 dark:text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} Kuba Platform. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
                <span className="text-gray-400 dark:text-gray-500">Made with ❤️ for Home Services</span>
            </div>
            </div>
        </div>
    </footer>
  );
}
