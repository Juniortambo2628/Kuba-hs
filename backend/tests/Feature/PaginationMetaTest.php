<?php

use App\Models\BlogPost;
use App\Models\Review;

test('every hand-rolled list endpoint returns the same pagination meta keys', function () {
    BlogPost::factory()->create(['is_published' => true]);
    Review::factory()->create();

    $public = $this->getJson('/api/blog');
    $public->assertOk();

    $admin = $this->actingAs(createAdmin());
    $internal = $admin->getJson('/api/admin/feedback');
    $internal->assertOk();

    $expected = ['current_page', 'last_page', 'per_page', 'total'];

    $this->assertSame($expected, array_keys($public->json('meta')));
    $this->assertSame($expected, array_keys($internal->json('meta')));
});
