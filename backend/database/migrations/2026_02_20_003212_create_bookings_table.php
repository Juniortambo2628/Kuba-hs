<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('customer_id')->constrained('users')->onDelete('cascade');
            $table->uuid('provider_id');
            $table->uuid('service_id');
            $table->string('booking_number', 50)->unique();
            $table->timestamp('scheduled_date');
            $table->timestamp('scheduled_end_date')->nullable();
            $table->string('status', 20)->default('pending'); // pending, confirmed, in_progress, completed, cancelled
            $table->uuid('address_id');
            $table->text('description')->nullable();
            $table->decimal('estimated_price', 10, 2)->nullable();
            $table->decimal('final_price', 10, 2)->nullable();
            $table->string('payment_status', 20)->default('pending'); // pending, paid, refunded
            $table->text('cancellation_reason')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('provider_id')->references('id')->on('providers')->onDelete('cascade');
            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade');
            $table->foreign('address_id')->references('id')->on('addresses')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
