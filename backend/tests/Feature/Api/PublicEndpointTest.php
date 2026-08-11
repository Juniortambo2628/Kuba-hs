<?php

use App\Models\ContactMessage;
use App\Models\BlogPost;
use App\Models\CustomQuote;
use App\Models\InvestorInquiry;
use App\Models\User;

test('can submit contact form', function () {
    $response = $this->postJson('/api/contact', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'message' => 'Hello there',
        'subject' => 'Inquiry',
    ]);

    $response->assertOk();
    $this->assertDatabaseHas('contact_messages', ['email' => 'test@example.com']);
});

test('can submit investor inquiry', function () {
    $response = $this->postJson('/api/investors/inquire', [
        'name' => 'Investor',
        'email' => 'investor@example.com',
        'company' => 'InvestCo',
        'investment_range' => '$100k+',
        'message' => 'Interested',
    ]);

    $response->assertOk();
    $this->assertDatabaseHas('investor_inquiries', ['email' => 'investor@example.com']);
});

test('can request custom quote', function () {
    $response = $this->postJson('/api/quotes', [
        'organization_name' => 'Org',
        'contact_person' => 'Person',
        'email' => 'quote@example.com',
        'phone' => '1234567890',
        'organization_type' => 'commercial',
        'service_category' => 'Cleaning',
        'estimated_volume' => 10,
        'description' => 'Need quote',
    ]);

    $response->assertOk();
    $this->assertDatabaseHas('custom_quotes', ['email' => 'quote@example.com']);
});

test('can unsubscribe from emails', function () {
    $user = createCustomer(['unsubscribed_at' => null]);

    // Usually unsubscribe is a GET with a signed route or token, mock basic if simple
    // Just testing the endpoint exists
    $response = $this->getJson(route('api.unsubscribe', ['email' => $user->email]));

    $response->assertOk();
});

test('geocoding endpoint responds', function () {
    // Might need mocking if calling external API
    $response = $this->getJson('/api/geocode/search?q=Nairobi');

    $response->assertOk();
});

test('blog endpoints return posts', function () {
    $post = BlogPost::factory()->create(['is_published' => true]);

    $this->getJson('/api/blog')->assertOk();
    $this->getJson('/api/blog/' . $post->slug)->assertOk();
});
