<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Broadcast;
use App\Http\Controllers\Api\Marketplace\MarketplaceCatalogController;
use App\Http\Controllers\Api\Marketplace\MarketplaceContentController;
use App\Http\Controllers\Api\Marketplace\MarketplaceDiscoveryController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;

Route::get('/user', function (Request $request) {
    return new UserResource($request->user());
})->middleware('auth:sanctum');

Route::get('/dashboard/search', \App\Http\Controllers\Api\DashboardSearchController::class)
    ->middleware('auth:sanctum');

/** SPA session auth — must live under /api so Next.js rewrites reach Laravel */
Route::prefix('auth')->group(function () {
    Route::middleware('guest')->group(function () {
        Route::post('/login', [AuthenticatedSessionController::class, 'store'])->middleware('throttle:10,1');
        Route::post('/register', [RegisteredUserController::class, 'store'])->middleware('throttle:5,1');
        Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])->middleware('throttle:5,1');
        Route::post('/reset-password', [NewPasswordController::class, 'store']);
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);

        // Passkey management
        Route::get('/passkeys', [\App\Http\Controllers\Auth\PasskeyController::class, 'index']);
        Route::post('/passkey/register/options', [\App\Http\Controllers\Auth\PasskeyController::class, 'registerOptions']);
        Route::post('/passkey/register/verify', [\App\Http\Controllers\Auth\PasskeyController::class, 'registerVerify']);
        Route::delete('/passkey/{id}', [\App\Http\Controllers\Auth\PasskeyController::class, 'destroy']);

        // Two-factor authentication
        Route::get('/two-factor', [\App\Http\Controllers\Auth\TwoFactorController::class, 'show']);
        Route::post('/two-factor', [\App\Http\Controllers\Auth\TwoFactorController::class, 'store']);
        Route::post('/two-factor/confirm', [\App\Http\Controllers\Auth\TwoFactorController::class, 'confirm']);
        Route::delete('/two-factor', [\App\Http\Controllers\Auth\TwoFactorController::class, 'destroy']);
        Route::get('/two-factor/recovery-codes', [\App\Http\Controllers\Auth\TwoFactorController::class, 'recoveryCodes']);
    });

    // Passkey authentication (public — user not yet logged in)
    Route::post('/passkey/authenticate/options', [\App\Http\Controllers\Auth\PasskeyController::class, 'authenticateOptions']);
    Route::post('/passkey/authenticate/verify', [\App\Http\Controllers\Auth\PasskeyController::class, 'authenticateVerify']);

    // Two-factor challenge (public — during login flow)
    Route::post('/two-factor/challenge', [\App\Http\Controllers\Auth\TwoFactorChallengeController::class, 'verify']);
});



Route::get('/faqs', [MarketplaceContentController::class, 'faqs']);
Route::get('/testimonials', [MarketplaceContentController::class, 'testimonials']);
Route::get('/page-features', [\App\Http\Controllers\Api\PageFeatureController::class, 'index']);

Route::get('/categories', [MarketplaceCatalogController::class, 'categories']);
Route::get('/featured-services', [MarketplaceCatalogController::class, 'featured']);
Route::get('/featured-services/{providerService}', [MarketplaceCatalogController::class, 'showService']);
Route::get('/services/{service}', [MarketplaceCatalogController::class, 'showGeneralService']);
Route::get('/featured-services/{providerService}/similar', [MarketplaceCatalogController::class, 'similarProviders']);
Route::get('/categories/{category}', [MarketplaceCatalogController::class, 'showCategory']);
Route::get('/categories/{categorySlug}/{serviceSlug}', [MarketplaceCatalogController::class, 'showServiceBySlug']);
Route::get('/trust-partners', [MarketplaceContentController::class, 'trustPartners']);
Route::post('/promo-codes/validate', [MarketplaceDiscoveryController::class, 'validatePromoCode'])->middleware('throttle:10,1');
Route::get('/providers', [MarketplaceDiscoveryController::class, 'providers']);
Route::get('/providers/{provider}', [MarketplaceDiscoveryController::class, 'show']);
Route::get('/top-providers', [MarketplaceDiscoveryController::class, 'topProviders']);
Route::get('/search', [MarketplaceDiscoveryController::class, 'search']);
Route::get('/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'index']);
Route::get('/geocode/search', [\App\Http\Controllers\Api\GeocodingController::class, 'search']);
Route::post('/contact', [\App\Http\Controllers\Api\ContactController::class, 'store']);
Route::post('/investors/inquire', [\App\Http\Controllers\Api\InvestorInquiryController::class, 'store']);
Route::post('/auth/register-provider', [\App\Http\Controllers\Api\ProviderApplicationController::class, 'register'])->middleware('throttle:5,1');
Route::post('/quotes', [\App\Http\Controllers\Api\QuoteController::class, 'store']);
Route::get('/unsubscribe', [\App\Http\Controllers\Api\UnsubscribeController::class, 'unsubscribe'])->name('api.unsubscribe');

// M-Pesa Callback (public, no auth - called by Safaricom)
Route::post('/payments/mpesa/callback', [\App\Http\Controllers\Api\MpesaController::class, 'callback']);
Route::post('/auth/complete-profile', [\App\Http\Controllers\Auth\ProfileCompletionController::class, 'store'])
    ->middleware('auth:sanctum');

// Public Blog Routes
Route::get('/blog', [\App\Http\Controllers\Api\BlogController::class, 'index']);
Route::get('/blog/{slug}', [\App\Http\Controllers\Api\BlogController::class, 'show']);
// Authenticated dashboard routes
Route::middleware(['auth:sanctum', 'two-factor-setup'])->group(function () {
    // Client/Provider Dashboard — delegates to role-specific controllers
    Route::get('/dashboard', function (\Illuminate\Http\Request $request) {
        $user = $request->user();
        if ($user->role === \App\Enums\UserRole::Provider && $user->provider) {
            return app(\App\Http\Controllers\Provider\DashboardController::class)->index($request);
        }
        return app(\App\Http\Controllers\Client\DashboardController::class)->index($request);
    });

    // Booking management
    Route::get('/bookings/{booking}', [\App\Http\Controllers\Api\BookingController::class, 'show']);
    Route::get('/bookings/{booking}/activity', [\App\Http\Controllers\Api\BookingActivityController::class, 'index']);
    Route::patch('/bookings/{booking}/status', [\App\Http\Controllers\Api\BookingController::class, 'updateStatus']);
    Route::patch('/bookings/{booking}/reschedule', [\App\Http\Controllers\Api\BookingController::class, 'reschedule']);

    Route::post('/media/upload', [\App\Http\Controllers\MediaController::class, 'upload']);
    Route::delete('/media/{id}', [\App\Http\Controllers\MediaController::class, 'destroy']);
    Route::get('/notifications', [\App\Http\Controllers\Api\NotificationController::class, 'index']);
    Route::post('/notifications/read-all', [\App\Http\Controllers\Api\NotificationController::class, 'markAllAsRead']);
    Route::post('/notifications/{id}/read', [\App\Http\Controllers\Api\NotificationController::class, 'markAsRead']);

    Route::middleware('admin')->group(function () {
        Route::get('/admin/workforce/verification', [\App\Http\Controllers\Api\VerificationController::class, 'index']);
        Route::patch('/admin/workforce/verification/{id}', [\App\Http\Controllers\Api\VerificationController::class, 'update']);
    });

    // Provider routes (provider role required)
    Route::middleware('provider')->prefix('provider')->group(function () {
        Route::get('/bookings', [\App\Http\Controllers\Provider\BookingController::class, 'index']);
        Route::get('/bookings/{booking}', [\App\Http\Controllers\Provider\BookingController::class, 'show']);
        Route::get('/verification', [\App\Http\Controllers\Api\VerificationController::class, 'index']);
        Route::post('/verification', [\App\Http\Controllers\Api\VerificationController::class, 'store']);
        Route::get('/dashboard', [\App\Http\Controllers\Provider\DashboardController::class, 'index']);
        Route::get('/services', [\App\Http\Controllers\Api\ProviderServiceController::class, 'index']);
        Route::post('/services', [\App\Http\Controllers\Api\ProviderServiceController::class, 'store']);
        Route::put('/services/{id}', [\App\Http\Controllers\Api\ProviderServiceController::class, 'update']);
        Route::delete('/services/{id}', [\App\Http\Controllers\Api\ProviderServiceController::class, 'destroy']);
        Route::get('/availability', [\App\Http\Controllers\Api\ProviderAvailabilityController::class, 'index']);
        Route::put('/availability', [\App\Http\Controllers\Api\ProviderAvailabilityController::class, 'update']);
        Route::put('/availability/exceptions', [\App\Http\Controllers\Api\ProviderAvailabilityController::class, 'updateExceptions']);
        Route::post('/profile', [\App\Http\Controllers\Api\ProviderProfileController::class, 'update']);
        Route::get('/reviews', [\App\Http\Controllers\Provider\ReviewController::class, 'index']);
    });

    Route::middleware('provider')->get('/payments/provider/transactions', [\App\Http\Controllers\Api\PaystackController::class, 'providerTransactions']);

    // Client routes (customer role required)
    Route::middleware('customer')->group(function () {
        Route::get('/client/dashboard', [\App\Http\Controllers\Client\DashboardController::class, 'index']);
        Route::get('/client/bookings', [\App\Http\Controllers\Client\BookingController::class, 'index']);
        Route::get('/client/bookings/{booking}', [\App\Http\Controllers\Client\BookingController::class, 'show']);
        Route::post('/client/bookings', [\App\Http\Controllers\Client\BookingController::class, 'store']);
        Route::patch('/client/bookings/{booking}/cancel', [\App\Http\Controllers\Client\BookingController::class, 'cancel']);
        Route::apiResource('/client/addresses', \App\Http\Controllers\Client\AddressController::class);
        Route::get('/client/loyalty', [\App\Http\Controllers\Client\LoyaltyController::class, 'index']);
        Route::post('/client/loyalty/redeem', [\App\Http\Controllers\Client\LoyaltyController::class, 'redeem']);
        Route::put('/client/profile', [\App\Http\Controllers\Client\ProfileController::class, 'update']);
        Route::patch('/client/password', [\App\Http\Controllers\Client\ProfileController::class, 'changePassword']);
        Route::patch('/client/addresses/{address}/default', [\App\Http\Controllers\Client\AddressController::class, 'setDefault']);
        Route::post('/payments/paystack/initialize', [\App\Http\Controllers\Api\PaystackController::class, 'initialize']);
        Route::post('/payments/paystack/verify', [\App\Http\Controllers\Api\PaystackController::class, 'verify']);
        Route::get('/payments/client/transactions', [\App\Http\Controllers\Api\PaystackController::class, 'userTransactions']);
        Route::post('/payments/mpesa/stk-push', [\App\Http\Controllers\Api\MpesaController::class, 'stkPush']);
        Route::post('/payments/mpesa/check-status', [\App\Http\Controllers\Api\MpesaController::class, 'checkStatus']);
        Route::post('/reviews', [\App\Http\Controllers\Api\ReviewController::class, 'store']);
    });

    // Favorites (any authenticated user)
    Route::get('/favorites', [\App\Http\Controllers\Api\FavoriteController::class, 'index']);
    Route::post('/favorites/{provider}', [\App\Http\Controllers\Api\FavoriteController::class, 'toggle']);


    // Receipt
    Route::get('/payments/receipt/{booking}', function (\App\Models\Booking $booking, Request $request) {
        $user = $request->user();
        if ($user->id !== $booking->customer_id && $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $booking->load(['customer', 'provider.user', 'service', 'payment', 'address']);
        return response()->json(['booking' => $booking]);
    });

    Route::get('/providers/{provider}/reviews', [\App\Http\Controllers\Api\ReviewController::class, 'providerReviews']);

    // Invoices
    Route::get('/invoices/{bookingId}/download', [\App\Http\Controllers\Api\InvoiceController::class, 'download']);

    // Admin routes (admin role required)
    Route::group(['prefix' => 'admin', 'as' => 'api.admin.', 'middleware' => 'admin'], function () {
        Route::get('/analytics', [\App\Http\Controllers\Admin\AnalyticsController::class, 'index']);
        Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index']);
        Route::get('/messages-summary', [\App\Http\Controllers\Admin\DashboardController::class, 'messagesSummary']);
        Route::get('/bookings', [\App\Http\Controllers\Admin\BookingController::class, 'index']);
        Route::post('/bookings', [\App\Http\Controllers\Admin\BookingController::class, 'store']);
        Route::get('/bookings/{booking}', [\App\Http\Controllers\Admin\BookingController::class, 'show']);
        Route::patch('/bookings/{booking}/status', [\App\Http\Controllers\Admin\BookingController::class, 'updateStatus']);
        Route::delete('/bookings/{booking}', [\App\Http\Controllers\Admin\BookingController::class, 'destroy']);
        Route::get('/payments', [\App\Http\Controllers\Admin\PaymentController::class, 'index']);
        Route::get('/payments/{payment}', [\App\Http\Controllers\Admin\PaymentController::class, 'show']);
        Route::get('/finance', [\App\Http\Controllers\Admin\FinanceController::class, 'index']);
        Route::get('/finance/transactions', [\App\Http\Controllers\Admin\FinanceController::class, 'transactions']);
        
        // Configuration & Content
        Route::get('/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'index']);
        Route::post('/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'update']);
        Route::get('/feedback', [\App\Http\Controllers\Admin\FeedbackController::class, 'index']);
        Route::put('/feedback/{id}', [\App\Http\Controllers\Admin\FeedbackController::class, 'update']);
        Route::delete('/feedback/{id}', [\App\Http\Controllers\Admin\FeedbackController::class, 'destroy']);

        // CMS media (FilePond)
        Route::post('/media/upload', [\App\Http\Controllers\Admin\MediaController::class, 'upload']);
        Route::delete('/media/revert', [\App\Http\Controllers\Admin\MediaController::class, 'delete']);

        Route::apiResource('trust-partners', \App\Http\Controllers\Admin\TrustPartnerController::class);
        Route::apiResource('page-features', \App\Http\Controllers\Admin\PageFeatureController::class);

        Route::apiResource('users', \App\Http\Controllers\Admin\UserController::class);
        Route::patch('users/{user}/toggle-status', [\App\Http\Controllers\Admin\UserController::class, 'toggleStatus']);

        Route::apiResource('providers', \App\Http\Controllers\Admin\ProviderController::class);
        Route::patch('providers/{provider}/status', [\App\Http\Controllers\Admin\ProviderController::class, 'updateStatus']);


        // Loyalty routes
        Route::get('/loyalty/tiers', [\App\Http\Controllers\Admin\LoyaltyController::class, 'index']);
        Route::post('/loyalty/tiers', [\App\Http\Controllers\Admin\LoyaltyController::class, 'storeTier']);
        Route::put('/loyalty/tiers/{tier}', [\App\Http\Controllers\Admin\LoyaltyController::class, 'updateTier']);
        Route::delete('/loyalty/tiers/{tier}', [\App\Http\Controllers\Admin\LoyaltyController::class, 'destroyTier']);
        Route::get('/loyalty/transactions', [\App\Http\Controllers\Admin\LoyaltyController::class, 'transactions']);
        Route::post('/loyalty/reward', [\App\Http\Controllers\Admin\LoyaltyController::class, 'awardPoints']);

        // Categories & Services
        Route::apiResource('categories', \App\Http\Controllers\Admin\CategoryController::class);
        Route::apiResource('services', \App\Http\Controllers\Admin\ServiceController::class);
        Route::apiResource('blog', \App\Http\Controllers\Admin\BlogController::class);

        // CMS Features
        Route::apiResource('faqs', \App\Http\Controllers\Admin\FAQController::class);
        Route::post('faqs/reorder', [\App\Http\Controllers\Admin\FAQController::class, 'reorder']);
        Route::apiResource('testimonials', \App\Http\Controllers\Admin\TestimonialController::class);
        Route::post('testimonials/reorder', [\App\Http\Controllers\Admin\TestimonialController::class, 'reorder']);

        // Reports
        Route::get('/reports/generate', [\App\Http\Controllers\Admin\ReportController::class, 'generate']);
        Route::get('/reports/history', [\App\Http\Controllers\Admin\ReportController::class, 'history']);

        // Chat moderation
        Route::get('/chat/conversations', [\App\Http\Controllers\Admin\AdminChatController::class, 'index']);
        Route::get('/chat/conversations/{conversation}', [\App\Http\Controllers\Admin\AdminChatController::class, 'show']);
        Route::delete('/chat/messages/{message}', [\App\Http\Controllers\Admin\AdminChatController::class, 'destroyMessage']);

        // Investor Inquiries
        Route::apiResource('investors', \App\Http\Controllers\Admin\InvestorInquiryController::class)->except(['store', 'update']);
        Route::patch('investors/{investor_inquiry}/status', [\App\Http\Controllers\Admin\InvestorInquiryController::class, 'updateStatus']);

        // Custom Quotes (Commercial/Cooperatives)
        Route::apiResource('quotes', \App\Http\Controllers\Admin\QuoteController::class)->except(['store', 'update']);
        Route::patch('/quotes/{quote}/status', [\App\Http\Controllers\Admin\QuoteController::class, 'updateStatus']);

        // Promo Codes
        Route::apiResource('promo-codes', \App\Http\Controllers\Admin\PromoCodeController::class);
        Route::patch('promo-codes/{promo_code}/toggle-status', [\App\Http\Controllers\Admin\PromoCodeController::class, 'toggleStatus']);
        Route::post('promo-codes/validate', [\App\Http\Controllers\Admin\PromoCodeController::class, 'validateCode']);

        // Email Templates
        Route::get('/email-templates', [\App\Http\Controllers\Admin\EmailTemplateController::class, 'index']);
        Route::post('/email-templates', [\App\Http\Controllers\Admin\EmailTemplateController::class, 'store']);
        Route::get('/email-templates/{emailTemplate}', [\App\Http\Controllers\Admin\EmailTemplateController::class, 'show']);
        Route::put('/email-templates/{emailTemplate}', [\App\Http\Controllers\Admin\EmailTemplateController::class, 'update']);
        Route::delete('/email-templates/{emailTemplate}', [\App\Http\Controllers\Admin\EmailTemplateController::class, 'destroy']);

        // Contact Messages
        Route::get('/contact', [\App\Http\Controllers\Admin\ContactController::class, 'index']);
        Route::get('/contact/{contactMessage}', [\App\Http\Controllers\Admin\ContactController::class, 'show']);
        Route::patch('/contact/{contactMessage}/status', [\App\Http\Controllers\Admin\ContactController::class, 'updateStatus']);
        Route::delete('/contact/{contactMessage}', [\App\Http\Controllers\Admin\ContactController::class, 'destroy']);

        // Compliance & Verification Audits
        Route::get('/compliance/overview', [\App\Http\Controllers\Api\Admin\ComplianceController::class, 'overview']);
        Route::get('/compliance/providers', [\App\Http\Controllers\Api\Admin\ComplianceController::class, 'providers']);
        Route::get('/compliance/providers/{provider}/documents', [\App\Http\Controllers\Api\Admin\ComplianceController::class, 'providerDocuments']);
        Route::patch('/compliance/documents/{document}/review', [\App\Http\Controllers\Api\Admin\ComplianceController::class, 'reviewDocument']);

        // Financial Operations & Payouts
        Route::get('/financials/overview', [\App\Http\Controllers\Api\Admin\FinancialController::class, 'overview']);
        Route::get('/financials/payouts', [\App\Http\Controllers\Api\Admin\FinancialController::class, 'payouts']);
        Route::post('/financials/payouts/{payout}/process', [\App\Http\Controllers\Api\Admin\FinancialController::class, 'process']);

    });

    // Chat Routes
    Route::group(['prefix' => 'chat'], function () {
        Route::get('/conversations', [\App\Http\Controllers\Api\ChatController::class, 'index']);
        Route::get('/conversations/{bookingId}', [\App\Http\Controllers\Api\ChatController::class, 'getConversation']);
        Route::post('/conversations/{conversation}/messages', [\App\Http\Controllers\Api\ChatController::class, 'sendMessage']);
        Route::post('/messages', [\App\Http\Controllers\Api\ChatController::class, 'sendMessage']);
        Route::patch('/conversations/{id}/read', [\App\Http\Controllers\Api\ChatController::class, 'markAsRead']);
        Route::post('/bookings/{bookingId}/conversation', [\App\Http\Controllers\Api\ChatController::class, 'createConversation']);
    });
});

Broadcast::routes(['middleware' => ['auth:sanctum']]);
