"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, User, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/axios";
import { Post } from "@/types";

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [meta, setMeta] = useState<any>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (search = "") => {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.get(`/api/blog?search=${search}`);
      setPosts(data.data);
      setMeta(data.meta);
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts(searchTerm);
  };

  const getImageUrl = (url?: string) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${url}`;
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      {/* Header */}
      <div className="max-w-[1400px] mx-auto px-6 mb-16">
        <div className="max-w-3xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Official Journal</span>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tighter leading-[1.1]">
              Industry <span className="text-muted-foreground">Insights</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mt-6">
              Expert advice, marketplace updates, and professional strategies for the modern service economy.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search articles..." 
              className="pl-12 h-14 bg-muted/50 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
            />
          </form>
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <div className="h-64 bg-muted rounded-[2.5rem]"></div>
                <div className="h-6 w-3/4 bg-muted rounded-md tracking-tight"></div>
                <div className="h-4 w-1/2 bg-muted rounded-md text-muted-foreground"></div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.article 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex flex-col items-start justify-between h-full space-y-4"
              >
                <Link href={`/blog/${post.slug}`} className="w-full flex-1">
                  <div className="relative w-full h-[280px] rounded-[2.5rem] overflow-hidden bg-muted mb-6">
                    {post.image_url ? (
                      <img 
                        src={getImageUrl(post.image_url) || ""} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 group-hover:text-primary transition-colors">
                        <span className="text-xs font-bold uppercase tracking-widest">Kuba Journal</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-700"></div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/30"></span>
                    <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {post.author?.name || 'Kuba Team'}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight leading-tight mb-3">
                    {post.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </Link>
                
                <div className="pt-4 mt-auto w-full border-t border-border/50">
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest group/btn">
                    Read Narrative <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-6">
            <div className="w-24 h-24 bg-muted rounded-[2.5rem] flex items-center justify-center text-muted-foreground/50 border border-border/50">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-foreground">No articles discovered</h3>
            <p className="text-muted-foreground">Adjust your search parameters. Our editorial team is constantly publishing new market insights.</p>
            <Button onClick={() => { setSearchTerm(""); fetchPosts(""); }} className="bg-foreground text-background hover:bg-muted hover:text-foreground rounded-xl h-12 px-8 font-bold uppercase tracking-widest text-[10px] shadow-xl">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
