"use client";

import Link from "next/link";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthBrandLogo } from "@/components/auth/AuthBrandLogo";
import type { AuthPageContent } from "@/lib/auth-page-content";
import { AuthSocialProofBanner } from "@/components/auth/AuthSocialProofBanner";
import { AuthVisualPanel } from "@/components/auth/AuthVisualPanel";
import { authAccentClasses, authUi } from "@/lib/auth-ui";
import { cn } from "@/lib/utils";

interface AuthPageShellProps {
  content: AuthPageContent;
  footerHref: string;
  showSocialProof?: boolean;
  children: React.ReactNode;
  homeHref?: string;
}

export function AuthPageShell({
  content,
  footerHref,
  showSocialProof = true,
  children,
  homeHref = "/",
}: AuthPageShellProps) {
  const accent = authAccentClasses(content.accent);

  return (
    <div className={authUi.page}>
      <Link
        href={homeHref}
        className="fixed top-6 left-6 z-20 flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Home
      </Link>

      <div className={authUi.card}>
        <div className={authUi.formCol}>
          <div className={authUi.formInner}>
            <AuthBrandLogo className={authUi.logo} />

            <div>
              <h1 className={authUi.title}>{content.title}</h1>
              <p className={authUi.subtitle}>{content.subtitle}</p>
            </div>

            <div className={authUi.formBody}>{children}</div>

            <p className={authUi.footer}>
              {content.footerPrefix}{" "}
              <Link href={footerHref} className={accent.link}>
                {content.footerLinkLabel}
              </Link>
            </p>

            {showSocialProof && content.socialProof && (
              <AuthSocialProofBanner
                title={content.socialProof.title}
                subtitle={content.socialProof.subtitle}
              />
            )}
          </div>
        </div>

        <AuthVisualPanel visual={content.visual} accent={content.accent} />
      </div>
    </div>
  );
}

export function AuthFormDivider() {
  return (
    <div className={authUi.divider}>
      <div className={authUi.dividerLine} />
      <span className={authUi.dividerText}>or</span>
      <div className={authUi.dividerLine} />
    </div>
  );
}

export function AuthPrimaryButton({
  accent,
  children,
  className,
  isLoading,
  ...props
}: React.ComponentProps<typeof Button> & {
  accent: "client" | "provider";
  isLoading?: boolean;
}) {
  const styles = authAccentClasses(accent);
  return (
    <Button type="submit" className={cn(styles.btn, className)} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : children}
    </Button>
  );
}
