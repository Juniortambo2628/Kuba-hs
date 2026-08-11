<?php

use App\Models\EmailTemplate;

test('admin can manage email templates', function () {
    $admin = createAdmin();
    $template = EmailTemplate::factory()->create();

    // List
    $this->actingAs($admin)->getJson('/api/admin/email-templates')->assertOk();

    // Show
    $this->actingAs($admin)->getJson("/api/admin/email-templates/{$template->id}")->assertOk();

    // Create
    $this->actingAs($admin)->postJson('/api/admin/email-templates', [
        'key' => 'welcome_email',
        'name' => 'Welcome Email',
        'subject' => 'Welcome to Kuba',
        'body' => '<p>Hello {{name}}</p>',
        'variables' => ['name']
    ])->assertCreated();

    // Update
    $this->actingAs($admin)->putJson("/api/admin/email-templates/{$template->id}", [
        'key' => $template->key,
        'name' => 'Updated Name',
        'subject' => 'Updated Subject',
        'body' => '<p>Updated</p>',
        'variables' => ['test']
    ])->assertOk();

    // Delete
    $this->actingAs($admin)->deleteJson("/api/admin/email-templates/{$template->id}")->assertOk();
});
