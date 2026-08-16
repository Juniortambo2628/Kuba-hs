/**
 * Centralized API endpoint registry.
 * Replace hardcoded URL strings across the codebase with these constants.
 */

export const API = {
  // Auth
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    logout: "/api/auth/logout",
    forgotPassword: "/api/auth/forgot-password",
    resetPassword: "/api/auth/reset-password",
    completeProfile: "/api/auth/complete-profile",
    registerProvider: "/api/auth/register-provider",

    // Email code login
    emailCodeRequest: "/api/auth/email-code/request",
    emailCodeVerify: "/api/auth/email-code/verify",
    emailCodeLogin: "/api/auth/email-code/login",

    // Passkeys
    passkeys: "/api/auth/passkeys",
    passkeyRegisterOptions: "/api/auth/passkey/register/options",
    passkeyRegisterVerify: "/api/auth/passkey/register/verify",
    passkeyAuthenticateOptions: "/api/auth/passkey/authenticate/options",
    passkeyAuthenticateVerify: "/api/auth/passkey/authenticate/verify",

    // Two-factor authentication
    twoFactor: "/api/auth/two-factor",
    twoFactorConfirm: "/api/auth/two-factor/confirm",
    twoFactorRecoveryCodes: "/api/auth/two-factor/recovery-codes",
    twoFactorChallenge: "/api/auth/two-factor/challenge",
  },

  // Public marketplace
  marketplace: {
    settings: "/api/settings",
    categories: "/api/categories",
    featuredServices: "/api/featured-services",
    search: "/api/search",
    providers: "/api/providers",
    topProviders: "/api/top-providers",
    faqs: "/api/faqs",
    testimonials: "/api/testimonials",
    trustPartners: "/api/trust-partners",
    blog: "/api/blog",
    contact: "/api/contact",
    promoValidate: "/api/promo-codes/validate",
    geocode: "/api/geocode/search",
  },

  // Client dashboard
  client: {
    dashboard: "/api/client/dashboard",
    bookings: "/api/client/bookings",
    addresses: "/api/client/addresses",
    loyalty: "/api/client/loyalty",
    profile: "/api/client/profile",
    password: "/api/client/password",
  },

  // Provider dashboard
  provider: {
    dashboard: "/api/provider/dashboard",
    bookings: "/api/provider/bookings",
    services: "/api/provider/services",
    availability: "/api/provider/availability",
    profile: "/api/provider/profile",
    verification: "/api/provider/verification",
    reviews: "/api/provider/reviews",
  },

  // Chat
  chat: {
    conversations: "/api/chat/conversations",
    messages: "/api/chat/messages",
  },

  // Admin — CMS
  admin: {
    dashboard: "/api/admin/dashboard",
    analytics: "/api/admin/analytics",
    settings: "/api/admin/settings",
    messagesSummary: "/api/admin/messages-summary",

    // Content management
    categories: "/api/admin/categories",
    services: "/api/admin/services",
    blog: "/api/admin/blog",
    faqs: "/api/admin/faqs",
    testimonials: "/api/admin/testimonials",
    trustPartners: "/api/admin/trust-partners",
    pageFeatures: "/api/admin/page-features",

    // Users & providers
    users: "/api/admin/users",
    providers: "/api/admin/providers",

    // Bookings & payments
    bookings: "/api/admin/bookings",
    payments: "/api/admin/payments",
    finance: "/api/admin/finance",
    financialsOverview: "/api/admin/financials/overview",
    financialsPayouts: "/api/admin/financials/payouts",

    // Operations
    quotes: "/api/admin/quotes",
    investors: "/api/admin/investors",
    contact: "/api/admin/contact",
    feedback: "/api/admin/feedback",
    emailTemplates: "/api/admin/email-templates",
    promoCodes: "/api/admin/promo-codes",
    loyaltyTiers: "/api/admin/loyalty/tiers",
    loyaltyTransactions: "/api/admin/loyalty/transactions",

    // Compliance & reports
    complianceOverview: "/api/admin/compliance/overview",
    complianceProviders: "/api/admin/compliance/providers",
    reports: "/api/admin/reports",

    // Email testing
    emailTestSend: "/api/admin/email-test/send",
    emailTestTemplates: "/api/admin/email-test/templates",

    // Chat moderation
    chatConversations: "/api/admin/chat/conversations",
  },

  // Media
  media: {
    upload: "/api/media/upload",
    adminUpload: "/api/admin/media/upload",
  },

  // Payments
  payments: {
    mpesaCallback: "/api/payments/mpesa/callback",
    mpesaStkPush: "/api/payments/mpesa/stk-push",
    mpesaCheckStatus: "/api/payments/mpesa/check-status",
    paystackInit: "/api/payments/paystack/initialize",
    paystackVerify: "/api/payments/paystack/verify",
    receipt: "/api/payments/receipt",
    providerTransactions: "/api/payments/provider/transactions",
    clientTransactions: "/api/payments/client/transactions",
  },
} as const;
