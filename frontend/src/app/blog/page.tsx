"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, User, Search, Loader2, BookOpen, CheckCircle2, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HighImpactHero } from "@/components/shared/HighImpactHero";
import axiosInstance from "@/lib/axios";
import { Post } from "@/types";
import { useCMS } from "@/hooks/useCMS";
import { getMediaUrl } from "@/lib/utils";

export default function BlogList() {
  const { getS, getImg, isLoading: cmsLoading } = useCMS();
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
    return getMediaUrl(url, 'service');
  };


  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white font-sans transition-colors duration-300">
      <Navbar />

      <HighImpactHero
        title={getS('hero_text', 'blog_hero_title', 'The Kuba Journal')}
        subtitle={getS('hero_text', 'blog_hero_subtitle', 'Insights, updates, and expert tips from the world of professional services.')}
        badge={getS('hero_text', 'blog_hero_badge', "Kuba Journal")}
        cmsKey="journal"
      />

      {/* Thesis / Featured Content Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">
                {getS('sections', 'journal_thesis_title', 'Redefining Service in the Digital Age')}
              </h2>
              <p className="text-gray-600 dark:text-muted-foreground leading-relaxed font-medium text-lg">
                {getS('sections', 'journal_thesis_body', 'In a rapidly evolving marketplace, knowledge is the ultimate currency. Our Journal is dedicated to documenting the shifts in how services are discovery, delivered, and experienced in Kenya.')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-border/40">
                <BookOpen className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold text-sm tracking-tight mb-1">Market Analysis</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">Deep dives into local service trends and economic impacts.</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-border/40">
                <Leaf className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm tracking-tight mb-1">Professional Growth</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">Resources for providers to scale their businesses and skills.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-[3rem] overflow-hidden bg-muted shadow-2xl">
              <img 
                src={getImg('market_narratives', 'journal_featured_image', 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80')} 
                className="w-full h-full object-cover" 
                alt="Journal Featured" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-10">
                <div className="text-white space-y-2">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-400">Featured Article</span>
                  <h3 className="text-2xl font-bold tracking-tight">The Evolution of the "Gig" Economy in Nairobi</h3>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Feed Section */}
      <section className="py-24 bg-slate-50 dark:bg-zinc-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Latest Narratives</h2>
            
            <form onSubmit={handleSearch} className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles..." 
                className="pl-11 h-12 bg-white dark:bg-black border border-border/60 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/10 transition-all text-foreground"
              />
            </form>
          </div>

          {/* Posts Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-6 animate-pulse">
                  <div className="aspect-[16/10] bg-muted rounded-[2.5rem]"></div>
                  <div className="h-6 w-3/4 bg-muted rounded-xl"></div>
                  <div className="h-4 w-1/2 bg-muted rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.map((post, index) => (
                <motion.article 
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex flex-col h-full bg-white dark:bg-black rounded-[2.5rem] border border-border/40 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                >
                  <Link href={`/blog/${post.slug}`} className="flex-1 flex flex-col">
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      {post.image_url ? (
                        <img 
                          src={getImageUrl(post.image_url) || ""} 
                          alt={post.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                          <BookOpen className="w-10 h-10" />
                        </div>
                      )}
                      <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-full text-[10px] font-bold tracking-widest uppercase text-primary border border-primary/10">
                        Article
                      </div>
                    </div>
                    
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground tracking-tight mb-4">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="w-1 h-1 rounded-full bg-border"></span>
                        <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {post.author?.name || 'Kuba Team'}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight leading-tight mb-4">
                        {post.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm leading-relaxed font-medium line-clamp-2">
                        {post.excerpt}
                      </p>
                      
                      <div className="pt-6 mt-auto flex items-center gap-2 text-primary font-bold text-xs tracking-tight group/btn">
                        Read Full Story <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="py-32 flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-6">
              <div className="w-24 h-24 bg-muted rounded-[2.5rem] flex items-center justify-center text-muted-foreground/50">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">No narratives discovered</h3>
              <p className="text-muted-foreground font-medium">Our editorial team is currently preparing new market insights. Please check back soon.</p>
              <Button onClick={() => { setSearchTerm(""); fetchPosts(""); }} className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-8 font-bold text-xs tracking-tight shadow-xl shadow-primary/20">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
