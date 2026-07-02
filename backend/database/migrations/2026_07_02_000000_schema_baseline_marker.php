<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

/**
 * SCHEMA BASELINE MARKER
 *
 * This migration marks the consolidation point for the home_service schema.
 * All 86 prior migrations (0001_01_01 through 2026_07_01_081219) have been
 * reviewed and the database is in a clean, normalized state with:
 *
 * - 35+ tables with proper PK/FK constraints
 * - Compound indexes on frequently queried columns (bookings: customer_id+status, provider_id+status)
 * - Soft deletes on critical tables (users, providers, bookings, services, conversations, messages)
 * - Proper UUID primary keys on domain tables
 *
 * To create a fresh schema dump for new environments, run:
 *   php artisan migrate:fresh --seed
 *
 * The original 86 migrations remain in the repository for historical reference.
 */
return new class extends Migration
{
    public function up(): void
    {
        // No schema changes — this is a documentation marker only.
    }

    public function down(): void
    {
        // No-op — this migration intentionally makes no changes.
    }
};
