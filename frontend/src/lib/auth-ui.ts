import { cn } from "@/lib/utils";

export const authUi = {
  page: "min-h-screen bg-[#eef1f4] dark:bg-background flex items-center justify-center p-4 sm:p-6 md:p-10",
  card: "w-full max-w-[1080px] bg-card rounded-[1.75rem] sm:rounded-[2rem] shadow-[0_24px_80px_-24px_rgba(15,23,42,0.18)] overflow-hidden flex flex-col lg:flex-row min-h-[min(720px,92dvh)]",
  formCol: "flex flex-1 flex-col min-w-0 lg:max-w-[52%]",
  formInner: "flex flex-1 flex-col px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12",
  logo: "h-9 w-auto",
  title: "text-2xl sm:text-[1.65rem] font-bold tracking-tight text-foreground mt-8",
  subtitle: "text-sm text-muted-foreground mt-2 leading-relaxed max-w-md",
  formBody: "mt-8 flex-1 flex flex-col gap-5",
  divider: "relative flex items-center gap-3 py-1",
  dividerLine: "flex-1 h-px bg-border/70",
  dividerText: "text-xs text-muted-foreground font-medium",
  primaryBtn:
    "w-full h-12 rounded-xl font-semibold text-sm shadow-md transition-all",
  footer: "text-sm text-muted-foreground text-center mt-6",
  footerLink: "font-semibold text-[#0d9488] hover:underline underline-offset-2",
  socialStrip:
    "mt-auto pt-6 border-t border-border/50 flex items-center gap-3 sm:gap-4",
  visualCol: "hidden lg:flex lg:flex-1 relative overflow-hidden",
  visualClient: "bg-gradient-to-br from-[#5eead4] via-[#2dd4bf] to-[#0d9488]",
  visualProvider: "bg-gradient-to-br from-[#6ee7b7] via-[#34d399] to-[#059669]",
  visualHeadline: "text-2xl xl:text-3xl font-semibold text-white leading-snug max-w-md",
  visualPanel:
    "absolute bottom-6 left-6 right-6 rounded-2xl bg-black/45 backdrop-blur-md p-4 text-white border border-white/10",
  input:
    "h-12 pl-11 pr-11 rounded-xl border-border/70 bg-muted/30 text-sm font-medium focus-visible:ring-2 focus-visible:ring-[#0d9488]/25",
  inputIcon: "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground",
} as const;

export function authAccentClasses(accent: "client" | "provider") {
  return {
    btn: cn(
      authUi.primaryBtn,
      accent === "provider"
        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
        : "bg-[#0d9488] hover:bg-[#0f766e] text-white shadow-[#0d9488]/25"
    ),
    link: accent === "provider" ? "text-emerald-600" : authUi.footerLink,
  };
}
