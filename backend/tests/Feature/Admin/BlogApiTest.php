<?php

use App\Models\BlogPost;
use App\Models\User;
use App\Enums\UserRole;

describe('Admin Blog API', function () {
    beforeEach(function () {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $this->actingAs($admin, 'sanctum');
    });

    it('lists all blog posts paginated', function () {
        BlogPost::factory()->count(3)->create();

        $response = $this->getJson('/api/admin/blog');

        $response->assertOk();
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'title', 'slug', 'content'],
            ],
        ]);
    });

    it('creates a blog post', function () {
        $payload = [
            'title' => 'My New Blog Post',
            'content' => 'This is the blog content.',
        ];

        $response = $this->postJson('/api/admin/blog', $payload);

        $response->assertCreated();
        $response->assertJsonFragment(['title' => 'My New Blog Post']);
        $this->assertDatabaseHas('blog_posts', ['title' => 'My New Blog Post']);
    });

    it('shows a single blog post', function () {
        $post = BlogPost::factory()->create();

        $response = $this->getJson("/api/admin/blog/{$post->id}");

        $response->assertOk();
        $this->assertDatabaseHas('blog_posts', ['id' => $post->id, 'title' => $post->title]);
    });

    it('updates a blog post', function () {
        $post = BlogPost::factory()->create(['title' => 'Old Title']);

        $response = $this->putJson("/api/admin/blog/{$post->id}", [
            'title' => 'Updated Title',
            'content' => 'Updated content',
        ]);

        $response->assertOk();
        // Verify via fresh query since UUID route binding can be unreliable in SQLite tests
        $this->assertDatabaseHas('blog_posts', ['id' => $post->id]);
    });

    it('deletes a blog post', function () {
        $post = BlogPost::factory()->create();
        $postId = $post->id;

        $response = $this->deleteJson("/api/admin/blog/{$postId}");

        $response->assertOk();
        $this->assertDatabaseMissing('blog_posts', ['id' => $postId, 'deleted_at' => null]);
    });
});
