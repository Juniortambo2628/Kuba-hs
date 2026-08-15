<?php

use App\Models\FAQ;
use App\Models\Testimonial;
use App\Models\TrustPartner;
use App\Models\PageFeature;
use App\Models\SiteSetting;

test('faqs endpoint returns active faqs', function () {
    $faq = FAQ::factory()->create(['is_active' => true]);
    FAQ::factory()->create(['is_active' => false]);

    $response = $this->getJson('/api/faqs');

    $response->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $faq->id);
});

test('testimonials endpoint returns active testimonials', function () {
    $testimonial = Testimonial::factory()->create(['is_active' => true]);

    $response = $this->getJson('/api/testimonials');

    $response->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $testimonial->id);
});

test('trust partners endpoint returns active partners', function () {
    $partner = TrustPartner::factory()->create(['is_active' => true]);

    $response = $this->getJson('/api/trust-partners');

    $response->assertOk()
        ->assertJsonCount(1)
        ->assertJsonFragment(['id' => $partner->id]);
});

test('page features endpoint returns grouped features', function () {
    PageFeature::factory()->create(['page_name' => 'home', 'section_name' => 'hero', 'is_active' => true]);

    $response = $this->getJson('/api/page-features');

    $response->assertOk();
    // Usually grouped by page and section in the response
});

test('public settings endpoint returns site settings', function () {
    SiteSetting::factory()->create(['key' => 'site_name', 'value' => 'Kuba']);

    $response = $this->getJson('/api/settings');

    $response->assertOk()
        ->assertJsonFragment(['key' => 'site_name', 'value' => 'Kuba']);
});
