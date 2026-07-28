<?php

use App\Models\BlogPost;
use App\Models\User;

describe('blog API', function () {
    it('returns published blog posts', function () {
        BlogPost::factory()->create(['is_published' => true, 'title' => 'Published Post']);
        BlogPost::factory()->create(['is_published' => false, 'title' => 'Draft Post']);

        $response = $this->getJson('/api/blog');

        $response->assertOk();
        $response->assertJson([
            'success' => true,
        ]);
        $response->assertJsonCount(1, 'data');
    });

    it('supports search filter', function () {
        BlogPost::factory()->create(['is_published' => true, 'title' => 'Guide to Cleaning']);
        BlogPost::factory()->create(['is_published' => true, 'title' => 'Plumbing Tips']);

        $response = $this->getJson('/api/blog?search=cleaning');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
    });

    it('returns a single blog post by slug', function () {
        BlogPost::factory()->create([
            'is_published' => true,
            'title' => 'My Blog Post',
            'slug' => 'my-blog-post',
        ]);

        $response = $this->getJson('/api/blog/my-blog-post');

        $response->assertOk();
        $response->assertJson([
            'success' => true,
            'data' => ['slug' => 'my-blog-post'],
        ]);
    });

    it('returns 404 for non-existent slug', function () {
        $response = $this->getJson('/api/blog/does-not-exist');

        $response->assertNotFound();
    });

    it('does not return unpublished posts', function () {
        BlogPost::factory()->create([
            'is_published' => false,
            'slug' => 'draft-post',
        ]);

        $response = $this->getJson('/api/blog/draft-post');

        $response->assertNotFound();
    });
});
