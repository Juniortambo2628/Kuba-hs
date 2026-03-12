<?php

use App\Http\Controllers\Admin\Auth\AdminLoginController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'categories' => \App\Models\ServiceCategory::with('services')->orderBy('sort_order')->get(),
        'featuredServices' => \App\Models\ProviderService::with(['provider.user', 'service'])
            ->where('is_available', true)
            ->take(6)
            ->get(),
    ]);
});

Route::get('/search', [\App\Http\Controllers\MarketplaceController::class, 'search'])->name('marketplace.search');

// Public Pages
Route::get('/about', [\App\Http\Controllers\PageController::class, 'about'])->name('about');
Route::get('/services', [\App\Http\Controllers\PageController::class, 'services'])->name('services');
Route::get('/contact', [\App\Http\Controllers\PageController::class, 'contact'])->name('contact');
Route::post('/contact', [\App\Http\Controllers\PageController::class, 'submitContact'])->name('contact.submit');

// Public Blog
Route::get('/blog', [\App\Http\Controllers\BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{slug}', [\App\Http\Controllers\BlogController::class, 'show'])->name('blog.show');

// Admin Auth
Route::get('/admin/login', [AdminLoginController::class, 'create'])->name('admin.login');
Route::post('/admin/login', [AdminLoginController::class, 'store']);
Route::post('/admin/logout', [AdminLoginController::class, 'destroy'])->name('admin.logout');

// Specific /provider/setup and /provider/edit must come before /provider/{id} so they are not matched as provider id "setup" or "edit"
Route::middleware('auth')->group(function () {
    Route::get('/provider/setup', [\App\Http\Controllers\ProviderController::class, 'create'])->name('provider.setup');
    Route::post('/provider/setup', [\App\Http\Controllers\ProviderController::class, 'store'])->name('provider.store');
    Route::get('/provider/edit', [\App\Http\Controllers\ProviderController::class, 'edit'])->name('provider.edit');
    Route::put('/provider/edit', [\App\Http\Controllers\ProviderController::class, 'update'])->name('provider.update');
});
Route::get('/provider/{id}', [\App\Http\Controllers\MarketplaceController::class, 'show'])->name('marketplace.provider');
Route::post('/booking', [\App\Http\Controllers\BookingController::class, 'store'])->name('booking.store')->middleware('auth');
Route::patch('/booking/{booking}/status', [\App\Http\Controllers\BookingController::class, 'updateStatus'])->name('booking.update-status')->middleware('auth');

Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/bookings', [\App\Http\Controllers\BookingController::class, 'index'])->name('bookings.index');

    Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');

    Route::get('/reviews', [\App\Http\Controllers\ReviewController::class, 'index'])->name('reviews.index');
    Route::post('/reviews', [\App\Http\Controllers\ReviewController::class, 'store'])->name('reviews.store');

    // Provider schedule (availability)
    Route::get('/schedule', [\App\Http\Controllers\ScheduleController::class, 'index'])->name('schedule.index');
    Route::put('/schedule', [\App\Http\Controllers\ScheduleController::class, 'update'])->name('schedule.update');

    // Payments
    Route::get('/payment/{booking}', [\App\Http\Controllers\PaymentController::class, 'show'])->name('payment.show');
    Route::post('/payment/{booking}/intent', [\App\Http\Controllers\PaymentController::class, 'createIntent'])->name('payment.intent');
    Route::post('/payment/{booking}/confirm', [\App\Http\Controllers\PaymentController::class, 'confirm'])->name('payment.confirm');

    // Chat
    Route::get('/chat', [\App\Http\Controllers\ChatController::class, 'index'])->name('chat.index');
    Route::get('/chat/{conversation}', [\App\Http\Controllers\ChatController::class, 'show'])->name('chat.show');
    Route::post('/chat/{conversation}/send', [\App\Http\Controllers\ChatController::class, 'sendMessage'])->name('chat.send');
    Route::get('/chat/{conversation}/poll', [\App\Http\Controllers\ChatController::class, 'poll'])->name('chat.poll');
    Route::post('/chat/start/{booking}', [\App\Http\Controllers\ChatController::class, 'startConversation'])->name('chat.start');

    // Admin (admin role only)
    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
        
        // Modules
        Route::resource('/users', \App\Http\Controllers\Admin\UserController::class)->names('users');
        Route::patch('/users/{user}/toggle-status', [\App\Http\Controllers\Admin\UserController::class, 'toggleStatus'])->name('users.toggle-status');
        Route::get('/payments', [\App\Http\Controllers\Admin\PaymentController::class, 'index'])->name('payments.index');
        Route::get('/analytics', [\App\Http\Controllers\Admin\AnalyticsController::class, 'index'])->name('analytics.index');
        Route::get('/feedback', [\App\Http\Controllers\Admin\FeedbackController::class, 'index'])->name('feedback.index');

        // CMS
        Route::get('/cms', [\App\Http\Controllers\Admin\CMSController::class, 'index'])->name('cms.index');
        Route::post('/cms', [\App\Http\Controllers\Admin\CMSController::class, 'update'])->name('cms.update');
        
        // Blog
        Route::resource('/blog', \App\Http\Controllers\Admin\BlogController::class);
        Route::resource('/categories', \App\Http\Controllers\Admin\CategoryController::class);
        Route::resource('/services', \App\Http\Controllers\Admin\ServiceController::class);
        
        // Contact Messages
        Route::get('/bookings', [\App\Http\Controllers\Admin\BookingController::class, 'index'])->name('bookings.index');
        Route::get('/contact', [\App\Http\Controllers\Admin\ContactController::class, 'index'])->name('contact.index');
        Route::get('/contact/{contactMessage}', [\App\Http\Controllers\Admin\ContactController::class, 'show'])->name('contact.show');
        Route::patch('/contact/{contactMessage}/status', [\App\Http\Controllers\Admin\ContactController::class, 'updateStatus'])->name('contact.update-status');
        Route::delete('/contact/{contactMessage}', [\App\Http\Controllers\Admin\ContactController::class, 'destroy'])->name('contact.destroy');

        // Media (FilePond)
        Route::post('/media/upload', [\App\Http\Controllers\Admin\MediaController::class, 'upload'])->name('media.upload');
        Route::delete('/media/delete', [\App\Http\Controllers\Admin\MediaController::class, 'delete'])->name('media.delete');
    });
});

require __DIR__.'/auth.php';
