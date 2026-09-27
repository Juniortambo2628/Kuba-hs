<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::rename('provider_availability', 'provider_availabilities');
    }

    public function down(): void
    {
        Schema::rename('provider_availabilities', 'provider_availability');
    }
};
