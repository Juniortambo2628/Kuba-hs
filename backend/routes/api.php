<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Broadcast;
use App\Http\Controllers\Api\MarketplaceController;
use Illuminate\Http\Request;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



Route::get('/faqs', [MarketplaceController::class, 'faqs']);
Route::get('/testimonials', [MarketplaceController::class, 'testimonials']);
Route::get('/page-features', [\App\Http\Controllers\Api\PageFeatureController::class, 'index']);

Route::get('/categories', [MarketplaceController::class, 'categories']);
Route::get('/featured-services', [MarketplaceController::class, 'featured']);
Route::get('/featured-services/{providerService}', [MarketplaceController::class, 'showService']);
Route::get('/top-providers', [MarketplaceController::class, 'topProviders']);
Route::get('/featured-services/{providerService}/similar', [MarketplaceController::class, 'similarProviders']);
Route::get('/categories/{category}', [MarketplaceController::class, 'showCategory']);
Route::get('/search', [MarketplaceController::class, 'search']);
Route::get('/trust-partners', [MarketplaceController::class, 'trustPartners']);
Route::get('/providers', [MarketplaceController::class, 'providers']);
Route::get('/providers/{provider}', [MarketplaceController::class, 'show']);
Route::get('/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'index']);
Route::post('/contact', [\App\Http\Controllers\Api\ContactController::class, 'store']);
Route::post('/investors/inquire', [\App\Http\Controllers\Api\InvestorInquiryController::class, 'store']);
Route::post('/auth/register-provider', [\App\Http\Controllers\Api\ProviderApplicationController::class, 'register']);
Route::post('/quotes', [\App\Http\Controllers\Api\QuoteController::class, 'store']);
Route::get('/unsubscribe', [\App\Http\Controllers\Api\UnsubscribeController::class, 'unsubscribe'])->name('api.unsubscribe');
Route::post('/auth/complete-profile', [\App\Http\Controllers\Auth\ProfileCompletionController::class, 'store']);

// Public Blog Routes
Route::get('/blog', [\App\Http\Controllers\Api\BlogController::class, 'index']);
Route::get('/blog/{slug}', [\App\Http\Controllers\Api\BlogController::class, 'show']);
// Authenticated dashboard routes
Route::middleware('auth:sanctum')->group(function () {
    // Client/Provider Dashboard
    Route::get('/dashboard', function (Request $request) {
        $user = $request->user();
        
        if ($user->role === 'provider' && $user->provider) {
            $bookings = \App\Models\Booking::where('provider_id', $user->provider->id)
                ->with(['customer', 'service', 'address', 'review', 'payment'])
                ->latest()
                ->get();
        } else {
            $bookings = \App\Models\Booking::where('customer_id', $user->id)
                ->with(['provider.user', 'service', 'address', 'review', 'payment'])
                ->latest()
                ->get();
        }

        return response()->json([
            'bookings' => $bookings,
            'userRole' => $user->role,
        ]);
    });

    // Booking management
    Route::get('/bookings/{booking}', [\App\Http\Controllers\Api\BookingController::class, 'show']);
    Route::patch('/bookings/{booking}/status', [\App\Http\Controllers\Api\BookingController::class, 'updateStatus']);
    Route::patch('/bookings/{booking}/reschedule', [\App\Http\Controllers\Api\BookingController::class, 'reschedule']);

    Route::post('/media/upload', [\App\Http\Controllers\MediaController::class, 'upload']);
    Route::delete('/media/{id}', [\App\Http\Controllers\MediaController::class, 'destroy']);
    Route::get('/notifications', [\App\Http\Controllers\Api\NotificationController::class, 'index']);
    Route::post('/notifications/read-all', [\App\Http\Controllers\Api\NotificationController::class, 'markAllAsRead']);
    Route::post('/notifications/{id}/read', [\App\Http\Controllers\Api\NotificationController::class, 'markAsRead']);

    // Verification Routes
    Route::get('/provider/verification', [\App\Http\Controllers\Api\VerificationController::class, 'index']);
    Route::post('/provider/verification', [\App\Http\Controllers\Api\VerificationController::class, 'store']);
    Route::get('/admin/workforce/verification', [\App\Http\Controllers\Api\VerificationController::class, 'index']);
    Route::patch('/admin/workforce/verification/{id}', [\App\Http\Controllers\Api\VerificationController::class, 'update']);

    // Provider Management
    Route::group(['prefix' => 'provider'], function () {
        Route::get('/dashboard', [\App\Http\Controllers\Provider\DashboardController::class, 'index']);
        
        // Services CRUD
        Route::get('/services', [\App\Http\Controllers\Api\ProviderServiceController::class, 'index']);
        Route::post('/services', [\App\Http\Controllers\Api\ProviderServiceController::class, 'store']);
        Route::put('/services/{id}', [\App\Http\Controllers\Api\ProviderServiceController::class, 'update']);
        Route::delete('/services/{id}', [\App\Http\Controllers\Api\ProviderServiceController::class, 'destroy']);

        // Availability CRUD
        Route::get('/availability', [\App\Http\Controllers\Api\ProviderAvailabilityController::class, 'index']);
        Route::put('/availability', [\App\Http\Controllers\Api\ProviderAvailabilityController::class, 'update']);
        Route::put('/availability/exceptions', [\App\Http\Controllers\Api\ProviderAvailabilityController::class, 'updateExceptions']);

        // Profile Update
        Route::post('/profile', [\App\Http\Controllers\Api\ProviderProfileController::class, 'update']);

        // Reviews
        Route::get('/reviews', [\App\Http\Controllers\Provider\ReviewController::class, 'index']);
    });

    Route::get('/client/dashboard', [\App\Http\Controllers\Client\DashboardController::class, 'index']);
    Route::get('/client/bookings', [\App\Http\Controllers\Client\BookingController::class, 'index']);
    Route::post('/client/bookings', [\App\Http\Controllers\Client\BookingController::class, 'store']);
    Route::apiResource('/client/addresses', \App\Http\Controllers\Client\AddressController::class);
    Route::get('/client/loyalty', [\App\Http\Controllers\Client\LoyaltyController::class, 'index']);
    Route::post('/client/loyalty/redeem', [\App\Http\Controllers\Client\LoyaltyController::class, 'redeem']);
    Route::put('/client/profile', [\App\Http\Controllers\Client\ProfileController::class, 'update']);
    Route::patch('/client/password', [\App\Http\Controllers\Client\ProfileController::class, 'changePassword']);
    Route::patch('/client/addresses/{address}/default', [\App\Http\Controllers\Client\AddressController::class, 'setDefault']);

    // Payments (Paystack)
    Route::post('/payments/paystack/initialize', [\App\Http\Controllers\Api\PaystackController::class, 'initialize']);
    Route::post('/payments/paystack/verify', [\App\Http\Controllers\Api\PaystackController::class, 'verify']);
    Route::get('/payments/provider/transactions', [\App\Http\Controllers\Api\PaystackController::class, 'providerTransactions']);

    // Reviews
    Route::post('/reviews', [\App\Http\Controllers\Api\ReviewController::class, 'store']);
    Route::get('/providers/{provider}/reviews', [\App\Http\Controllers\Api\ReviewController::class, 'providerReviews']);

    // Invoices
    Route::get('/invoices/{bookingId}/download', [\App\Http\Controllers\Api\InvoiceController::class, 'download']);

    // Admin routes
    Route::group(['prefix' => 'admin', 'as' => 'api.admin.'], function () {
        Route::get('/analytics', [\App\Http\Controllers\Admin\AnalyticsController::class, 'index']);
        Route::get('/bookings', [\App\Http\Controllers\Admin\BookingController::class, 'index']);
        Route::get('/payments', [\App\Http\Controllers\Admin\PaymentController::class, 'index']);
        Route::get('/finance', [\App\Http\Controllers\Admin\FinanceController::class, 'index']);
        Route::get('/finance/transactions', [\App\Http\Controllers\Admin\FinanceController::class, 'transactions']);
        
        // Configuration & Content
        Route::get('/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'index']);
        Route::post('/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'update']);
        Route::get('/feedback', [\App\Http\Controllers\Admin\FeedbackController::class, 'index']);
        Route::put('/feedback/{id}', [\App\Http\Controllers\Admin\FeedbackController::class, 'update']);

        Route::apiResource('users', \App\Http\Controllers\Admin\UserController::class);
        Route::patch('users/{user}/toggle-status', [\App\Http\Controllers\Admin\UserController::class, 'toggleStatus']);

        // Loyalty routes
        Route::get('/loyalty/tiers', [\App\Http\Controllers\Admin\LoyaltyController::class, 'index']);
        Route::post('/loyalty/tiers', [\App\Http\Controllers\Admin\LoyaltyController::class, 'storeTier']);
        Route::put('/loyalty/tiers/{tier}', [\App\Http\Controllers\Admin\LoyaltyController::class, 'updateTier']);
        Route::delete('/loyalty/tiers/{tier}', [\App\Http\Controllers\Admin\LoyaltyController::class, 'destroyTier']);
        Route::get('/loyalty/transactions', [\App\Http\Controllers\Admin\LoyaltyController::class, 'transactions']);
        Route::post('/loyalty/reward', [\App\Http\Controllers\Admin\LoyaltyController::class, 'awardPoints']);

        // Categories & Services
        Route::apiResource('categories', \App\Http\Controllers\Admin\CategoryController::class);
        Route::apiResource('services', \App\Http\Controllers\Admin\ServiceController::class)->except(['index', 'show']);
        Route::apiResource('blog', \App\Http\Controllers\Admin\BlogController::class);

        // CMS Features
        Route::apiResource('faqs', \App\Http\Controllers\Admin\FAQController::class);
        Route::post('faqs/reorder', [\App\Http\Controllers\Admin\FAQController::class, 'reorder']);
        Route::apiResource('testimonials', \App\Http\Controllers\Admin\TestimonialController::class);
        Route::post('testimonials/reorder', [\App\Http\Controllers\Admin\TestimonialController::class, 'reorder']);

        // Reports
        Route::get('/reports/generate', [\App\Http\Controllers\Admin\ReportController::class, 'generate']);

        // Investor Inquiries
        Route::get('/investors', [\App\Http\Controllers\Admin\InvestorInquiryController::class, 'index']);
        Route::get('/investors/{investorInquiry}', [\App\Http\Controllers\Admin\InvestorInquiryController::class, 'show']);
        Route::patch('/investors/{investorInquiry}/status', [\App\Http\Controllers\Admin\InvestorInquiryController::class, 'updateStatus']);

        // Custom Quotes (Commercial/Cooperatives)
        Route::apiResource('quotes', \App\Http\Controllers\Admin\QuoteController::class)->except(['store']);
        Route::patch('/quotes/{quote}/status', [\App\Http\Controllers\Admin\QuoteController::class, 'updateStatus']);

        // Email Templates
        Route::get('/email-templates', [\App\Http\Controllers\Admin\EmailTemplateController::class, 'index']);
        Route::get('/email-templates/{emailTemplate}', [\App\Http\Controllers\Admin\EmailTemplateController::class, 'show']);
        Route::put('/email-templates/{emailTemplate}', [\App\Http\Controllers\Admin\EmailTemplateController::class, 'update']);

        // Contact Messages
        Route::get('/contact', [\App\Http\Controllers\Admin\ContactController::class, 'index']);
        Route::get('/contact/{contactMessage}', [\App\Http\Controllers\Admin\ContactController::class, 'show']);
        Route::patch('/contact/{contactMessage}/status', [\App\Http\Controllers\Admin\ContactController::class, 'updateStatus']);
        Route::delete('/contact/{contactMessage}', [\App\Http\Controllers\Admin\ContactController::class, 'destroy']);
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

