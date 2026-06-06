"use client";

import { use, useState, useEffect } from "react";
import { useScroll, useSpring } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, User, Calendar, Share2, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Post } from "@/types";
import { getMediaUrl } from "@/lib/utils";
import Image from "next/image";
import { useData } from "@/hooks/useData";
import { HeroSkeleton } from "@/components/shared/AdvancedSkeleton";
import { MarketingShell } from "@/components/layout/MarketingShell";

export default function BlogClient({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { data: post, isLoading, isError } = useData<Post>(slug ? `/api/blog/${slug}` : null);

  if (isLoading) {
    return (
      <MarketingShell>
        <HeroSkeleton />
      </MarketingShell>
    );
  }

  if (isError || !post) {
      if (typeof window !== 'undefined') router.push('/blog');
      return null;
  }

  const getImageUrl = (url?: string) => {
    return getMediaUrl(url, 'service');
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <MarketingShell>
      <div className="min-h-screen bg-background pt-32 pb-24">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[100] origin-left"
        style={{ scaleX }}
      />
      <article className="max-w-[900px] mx-auto px-6">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className="space-y-8"
        >
          {/* Back Button */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Journal
          </Link>

          {/* Header */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight leading-[1.1]">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-border/50">
                <div className="flex items-center gap-6 text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4" /> 
                        {post.author?.name || 'Kuba Editorial'}
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> 
                        {new Date(post.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mr-2">Share</span>
                    <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-border" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${currentUrl}&text=${post.title}`, '_blank')}>
                        <Twitter className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-border" onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${currentUrl}&title=${post.title}`, '_blank')}>
                        <Linkedin className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>
          </div>

          {/* Hero Image */}
          {post.image_url && (
            <div className="w-full h-[300px] md:h-[500px] bg-muted rounded-[2.5rem] overflow-hidden my-12 relative border border-border/50">
               <Image 
                 src={getImageUrl(post.image_url) || ""} 
                 alt={post.title} 
                 fill
                 className="object-cover"
               />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg prose-gray max-w-none text-foreground leading-loose">
            <div dangerouslySetInnerHTML={{ __html: post.body }} />
          </div>

        </motion.div>
      </article>

      {/* CTA Section footer */}
      <div className="max-w-[900px] mx-auto px-6 mt-24 pt-16 border-t border-border">
          <div className="bg-muted rounded-[2.5rem] p-12 text-center space-y-6 border border-border">
              <h3 className="text-2xl font-bold text-foreground tracking-tight">Need expert services?</h3>
              <p className="text-muted-foreground max-w-md mx-auto">Skip the hassle and let Kuba's verified professionals handle your next project with precision.</p>
              <Link href="/services">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="bg-foreground text-background hover:bg-muted hover:text-foreground h-12 px-8 font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-xl mt-4">
                    Browse Marketplace
                  </Button>
                </motion.div>
              </Link>
          </div>
      </div>
    </div>
    </MarketingShell>
  );
}
