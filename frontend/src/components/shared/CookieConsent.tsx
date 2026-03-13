"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Info, Settings, ShieldAlert, X } from "lucide-react";
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
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] max-w-lg"
          >
            <div className="bg-[#111]/95 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-400 font-semibold text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  Your Privacy Choice
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  We use cookies to enhance your experience, serve personalized content, and analyze our traffic. 
                  By clicking "Accept All", you consent to our use of cookies.
                </p>
              </div>

              <div className="flex flex-col gap-2 w-full md:w-auto shrink-0">
                <Button 
                  onClick={acceptAll}
                  size="sm" 
                  className="bg-white text-black hover:bg-gray-200 text-xs font-bold h-10 px-6 rounded-xl"
                >
                  ACCEPT ALL
                </Button>
                <div className="flex gap-2">
                   <Button 
                    onClick={() => setIsModalOpen(true)}
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-400 hover:text-white text-[10px] uppercase tracking-tighter shrink-0"
                  >
                    LEARN MORE
                  </Button>
                  <Button 
                    onClick={acceptNecessary}
                    variant="outline" 
                    size="sm" 
                    className="border-white/10 text-gray-400 hover:text-white text-[10px] uppercase tracking-tighter"
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
        <DialogContent className="bg-zinc-950 border-white/10 text-white max-w-2xl rounded-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <Info className="w-6 h-6 text-indigo-400" />
              Cookie Policy & Details
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 pt-4 text-gray-400 text-sm leading-relaxed">
            <section className="space-y-3">
              <h4 className="text-white font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Strictly Necessary Cookies
              </h4>
              <p>
                These cookies are essential for the website to function properly. They handle security,
                authentication, and session management. You cannot disable these.
              </p>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 font-mono text-[10px]">
                XSRF-TOKEN, kuba_session, remember_web
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="text-white font-medium flex items-center gap-2 text-yellow-500">
                <BarChart3 className="w-4 h-4" />
                Performance & Analytics
              </h4>
              <p>
                We use these to understand how visitors interact with our platform, identifying area for improvement 
                and monitoring system performance.
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-white font-medium flex items-center gap-2 text-indigo-400">
                <Settings className="w-4 h-4" />
                Functional Cookies
              </h4>
              <p>
                These allow our platform to remember choices you make (such as your username or language) 
                and provide enhanced, more personal features.
              </p>
            </section>

            <div className="pt-6 border-t border-white/5 flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
                className="border-white/10 hover:bg-white/5 rounded-xl"
              >
                CLOSE
              </Button>
              <Button 
                onClick={acceptAll}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
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

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function BarChart3(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}
