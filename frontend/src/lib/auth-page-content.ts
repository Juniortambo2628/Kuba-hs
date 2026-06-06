export type AuthPageVariant =
  | "client_login"
  | "client_register"
  | "provider_login"
  | "provider_register"
  | "forgot_password"
  | "reset_password";

export interface AuthPageContent {
  title: string;
  subtitle: string;
  submitLabel: string;
  footerPrefix: string;
  footerLinkLabel: string;
  visual: {
    headline: string;
    caption: string;
    status: string;
    imageUrl?: string;
  };
  socialProof?: {
    title: string;
    subtitle: string;
  };
  accent: "client" | "provider";
}

const PREFIX: Record<AuthPageVariant, string> = {
  client_login: "auth_client_login",
  client_register: "auth_client_register",
  provider_login: "auth_provider_login",
  provider_register: "auth_provider_register",
  forgot_password: "auth_forgot",
  reset_password: "auth_reset",
};

export const AUTH_PAGE_DEFAULTS: Record<AuthPageVariant, AuthPageContent> = {
  client_login: {
    title: "Welcome to Kuba",
    subtitle: "Sign in to book trusted home and business services across Kenya.",
    submitLabel: "Sign in",
    footerPrefix: "Don't have an account?",
    footerLinkLabel: "Sign up",
    visual: {
      headline: "Trusted pros for every job — book, track, and pay in one place.",
      caption: "Verified providers, secure payments, and real-time booking updates on Kuba.",
      status: "Booking",
    },
    socialProof: {
      title: "Join 10k+ customers",
      subtitle: "See why households and businesses trust Kuba for everyday services.",
    },
    accent: "client",
  },
  client_register: {
    title: "Create your Kuba account",
    subtitle: "Book verified professionals for home and office services in minutes.",
    submitLabel: "Sign up",
    footerPrefix: "Already have an account?",
    footerLinkLabel: "Sign in",
    visual: {
      headline: "Your marketplace for reliable home and business services.",
      caption: "Compare pros, message securely, and manage every booking from your dashboard.",
      status: "Joining",
    },
    socialProof: {
      title: "Join 10k+ customers",
      subtitle: "Start booking cleaners, electricians, wellness pros, and more today.",
    },
    accent: "client",
  },
  provider_login: {
    title: "Provider sign in",
    subtitle: "Manage bookings, earnings, and your service profile on Kuba.",
    submitLabel: "Sign in",
    footerPrefix: "New provider?",
    footerLinkLabel: "Create account",
    visual: {
      headline: "Grow your business with daily service requests on Kuba.",
      caption: "Track jobs, chat with clients, and get paid when work is complete.",
      status: "Earning",
    },
    socialProof: {
      title: "2,500+ active pros",
      subtitle: "Join verified professionals earning on the Kuba marketplace.",
    },
    accent: "provider",
  },
  provider_register: {
    title: "Become a Kuba pro",
    subtitle: "List your services, receive bookings, and get paid securely.",
    submitLabel: "Sign up",
    footerPrefix: "Already registered?",
    footerLinkLabel: "Sign in",
    visual: {
      headline: "Reach customers looking for your skills every day.",
      caption: "Complete your profile after signup to start accepting bookings.",
      status: "Onboarding",
    },
    socialProof: {
      title: "Grow with Kuba",
      subtitle: "Zero listing fees for your first month when you join today.",
    },
    accent: "provider",
  },
  forgot_password: {
    title: "Reset your password",
    subtitle: "Enter the email on your account and we will send you a reset link.",
    submitLabel: "Send reset link",
    footerPrefix: "Remember your password?",
    footerLinkLabel: "Back to sign in",
    visual: {
      headline: "Secure access to your Kuba account.",
      caption: "Reset links expire after 60 minutes for your security.",
      status: "Securing",
    },
    accent: "client",
  },
  reset_password: {
    title: "Choose a new password",
    subtitle: "Enter a strong password you have not used on Kuba before.",
    submitLabel: "Update password",
    footerPrefix: "Back to",
    footerLinkLabel: "Sign in",
    visual: {
      headline: "Almost there — set your new password.",
      caption: "Use at least 8 characters with letters and numbers.",
      status: "Updating",
    },
    accent: "client",
  },
};

export function buildAuthPageContent(
  variant: AuthPageVariant,
  getS: (key: string, fallback?: string) => string,
  getImg: (key: string, fallback?: string) => string
): AuthPageContent {
  const defaults = AUTH_PAGE_DEFAULTS[variant];
  const p = PREFIX[variant];

  const imageUrl = getImg(`${p}_visual_image`, "") || undefined;

  return {
    title: getS(`${p}_title`, defaults.title),
    subtitle: getS(`${p}_subtitle`, defaults.subtitle),
    submitLabel: getS(`${p}_submit`, defaults.submitLabel),
    footerPrefix: getS(`${p}_footer`, defaults.footerPrefix),
    footerLinkLabel: getS(`${p}_footer_link`, defaults.footerLinkLabel),
    visual: {
      headline: getS(`${p}_visual_headline`, defaults.visual.headline),
      caption: getS(`${p}_visual_caption`, defaults.visual.caption),
      status: getS(`${p}_visual_status`, defaults.visual.status),
      imageUrl,
    },
    socialProof: defaults.socialProof
      ? {
          title: getS(`${p}_social_title`, defaults.socialProof.title),
          subtitle: getS(`${p}_social_subtitle`, defaults.socialProof.subtitle),
        }
      : undefined,
    accent: defaults.accent,
  };
}

export const AUTH_PAGE_LINKS: Record<
  AuthPageVariant,
  { href: string; showSocialProof: boolean }
> = {
  client_login: { href: "/register/client", showSocialProof: true },
  client_register: { href: "/login", showSocialProof: true },
  provider_login: { href: "/register/provider", showSocialProof: true },
  provider_register: { href: "/login/provider", showSocialProof: true },
  forgot_password: { href: "/login", showSocialProof: false },
  reset_password: { href: "/login", showSocialProof: false },
};
