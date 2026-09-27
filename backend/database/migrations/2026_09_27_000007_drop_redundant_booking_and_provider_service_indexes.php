<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * The three indexes this drops are all covered by something else:
     *
     *  - bookings.customer_id+status and provider_id+status are strict
     *    prefixes of idx_bookings_cust_status / idx_bookings_prov_status,
     *    added later in 2026_07_22_000000 with created_at appended.
     *  - provider_services.provider_id is a prefix of
     *    provider_services_provider_id_service_id_unique, and of the
     *    provider_id FK's own needs, so the FK stays served after the drop.
     *
     * Every one of them also has a single-column sibling
     * (bookings_customer_id_index, bookings_provider_id_index) for the
     * plain "where this customer" case.
     */
    public function up(): void
    {
        $this->dropIfExists('bookings', ['customer_id', 'status']);
        $this->dropIfExists('bookings', ['provider_id', 'status']);
        $this->dropIfExists('provider_services', ['provider_id']);
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            if (! Schema::hasIndex('bookings', ['customer_id', 'status'])) {
                $table->index(['customer_id', 'status']);
            }
            if (! Schema::hasIndex('bookings', ['provider_id', 'status'])) {
                $table->index(['provider_id', 'status']);
            }
        });

        Schema::table('provider_services', function (Blueprint $table) {
            if (! Schema::hasIndex('provider_services', ['provider_id'])) {
                $table->index('provider_id');
            }
        });
    }

    private function dropIfExists(string $table, array $columns): void
    {
        if (! Schema::hasIndex($table, $columns)) {
            return;
        }

        Schema::table($table, function (Blueprint $blueprint) use ($columns) {
            $blueprint->dropIndex($columns);
        });
    }
};
