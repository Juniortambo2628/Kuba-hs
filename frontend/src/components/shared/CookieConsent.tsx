"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Info, Settings, ShieldAlert, X, CheckCircle2, BarChart3 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setTimeout(() => setIsVisible(true), 2000);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem("cookie-consent", "all");
    setIsVisible(false);
  };

  const acceptNecessary = () => {
    localStorage.setItem("cookie-consent", "necessary");
    setIsVisible(false);
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[45] w-[calc(100%-2rem)] max-w-lg"
            role="region"
            aria-label="Cookie consent banner"
          >
            <div className="bg-card/95 backdrop-blur-md border border-border/60 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 text-primary font-semibold text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  Your Privacy Choice
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We use cookies to enhance your experience, serve personalized content, and analyze our traffic.
                  By clicking &quot;Accept All&quot;, you consent to our use of cookies.
                </p>
              </div>

              <div className="flex flex-col gap-2 w-full md:w-auto shrink-0">
                <Button
                  onClick={acceptAll}
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold h-10 px-6 rounded-xl"
                >
                  ACCEPT ALL
                </Button>
                <div className="flex gap-2">
                   <Button
                    onClick={() => setIsModalOpen(true)}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground text-[10px] tracking-tighter shrink-0"
                  >
                    LEARN MORE
                  </Button>
                  <Button
                    onClick={acceptNecessary}
                    variant="outline"
                    size="sm"
                    className="border-border/60 text-muted-foreground hover:text-foreground text-[10px] tracking-tighter"
                  >
                    ESSENTIAL ONLY
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card border-border/60 text-foreground max-w-2xl rounded-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <Info className="w-6 h-6 text-primary" />
              Cookie Policy &amp; Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 pt-4 text-muted-foreground text-sm leading-relaxed">
            <section className="space-y-3">
              <h4 className="text-foreground font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Strictly Necessary Cookies
              </h4>
              <p>
                These cookies are essential for the website to function properly. They handle security,
                authentication, and session management. You cannot disable these.
              </p>
              <div className="bg-muted/50 p-3 rounded-xl border border-border/50 font-mono text-[10px]">
                XSRF-TOKEN, kuba_session, remember_web
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="text-foreground font-medium flex items-center gap-2 text-yellow-500">
                <BarChart3 className="w-4 h-4" />
                Performance &amp; Analytics
              </h4>
              <p>
                We use these to understand how visitors interact with our platform, identifying area for improvement
                and monitoring system performance.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-foreground font-medium flex items-center gap-2 text-primary">
                <Settings className="w-4 h-4" />
                Functional Cookies
              </h4>
              <p>
                These allow our platform to remember choices you make (such as your username or language)
                and provide enhanced, more personal features.
              </p>
            </section>

            <div className="pt-6 border-t border-border/50 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="border-border/60 hover:bg-muted rounded-xl"
              >
                CLOSE
              </Button>
              <Button
                onClick={acceptAll}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
              >
                ACCEPT ALL
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

