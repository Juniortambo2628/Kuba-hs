<?php

use Illuminate\Support\Facades\Schema;

test('providers experience_years and service_radius carry a default', function () {
    $columns = collect(Schema::getColumns('providers'))->keyBy('name');

    expect($columns->has('experience_years'))->toBeTrue();
    expect($columns->has('service_radius'))->toBeTrue();

    // Matches what User::defaults() already declared and what the Provider
    // accessors coerce to, so a raw insert without the columns behaves the
    // same as a read of a NULL row did before.
    foreach (['experience_years' => 0, 'service_radius' => 10] as $name => $expected) {
        $raw = $columns[$name]['default'] ?? null;

        // SQLite hands back the SQL literal, quotes and all ("'0'"); MySQL
        // hands back "0". Either way "no default at all" is null.
        expect($raw)->not->toBeNull();

        $normalized = trim((string) $raw, "'");

        expect($normalized)->not->toBe('');
        expect((int) $normalized)->toBe($expected);
    }
});


test('providers columns stay nullable so existing NULL rows still read as before', function () {
    $columns = collect(Schema::getColumns('providers'))->keyBy('name');

    expect($columns['experience_years']['nullable'])->toBeTrue();
    expect($columns['service_radius']['nullable'])->toBeTrue();
});

test('the new defaults can be taken off again', function () {
    $migration = include database_path('migrations/2026_09_27_000001_add_providers_column_defaults.php');

    $migration->down();

    $columns = collect(Schema::getColumns('providers'))->keyBy('name');
    expect($columns['experience_years']['default'])->toBeNull();
    expect($columns['service_radius']['default'])->toBeNull();
    expect($columns['experience_years']['nullable'])->toBeTrue();

    $migration->up();

    $columns = collect(Schema::getColumns('providers'))->keyBy('name');
    foreach (['experience_years' => 0, 'service_radius' => 10] as $name => $expected) {
        expect((int) trim((string) $columns[$name]['default'], "'"))->toBe($expected);
    }
});


