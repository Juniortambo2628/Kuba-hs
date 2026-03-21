"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Loader2, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios";
import { Post } from "@/types";
import { getMediaUrl } from "@/lib/utils";

export default function BlogPostDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/blog/${slug}`);
      setPost(data.data);
    } catch (error) {
      console.error("Failed to fetch post:", error);
      router.push('/blog');
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = (url?: string) => {
    return getMediaUrl(url, 'service');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-24 max-w-[900px] mx-auto px-6 space-y-8 animate-pulse">
        <div className="h-10 w-32 bg-muted rounded-2xl mb-8"></div>
        <div className="h-16 w-3/4 bg-muted rounded-2xl"></div>
        <div className="flex gap-4">
            <div className="h-6 w-32 bg-muted rounded-lg"></div>
            <div className="h-6 w-32 bg-muted rounded-lg"></div>
        </div>
        <div className="h-[400px] w-full bg-muted rounded-[2.5rem]"></div>
        <div className="space-y-4">
            <div className="h-6 w-full bg-muted rounded-lg"></div>
            <div className="h-6 w-full bg-muted rounded-lg"></div>
            <div className="h-6 w-3/4 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
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
            <div className="w-full h-[300px] md:h-[500px] bg-muted rounded-[2.5rem] overflow-hidden my-12">
               <img 
                 src={getImageUrl(post.image_url) || ""} 
                 alt={post.title} 
                 className="w-full h-full object-cover"
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
                <Button className="bg-foreground text-background hover:bg-muted hover:text-foreground h-12 px-8 font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-xl mt-4">
                  Browse Marketplace
                </Button>
              </Link>
          </div>
      </div>
    </div>
  );
}
