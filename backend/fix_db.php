<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Cleaning up DB...\n";

// Drop columns from bookings
Schema::table('bookings', function ($table) {
    if (Schema::hasColumn('bookings', 'rescheduled_at')) {
        $table->dropColumn('rescheduled_at');
        echo "- Dropped rescheduled_at\n";
    }
    if (Schema::hasColumn('bookings', 'cancellation_reason')) {
        $table->dropColumn('cancellation_reason');
        echo "- Dropped cancellation_reason\n";
    }
});

// Drop verification_documents table
Schema::dropIfExists('verification_documents');
echo "- Dropped verification_documents table\n";

// Remove migration entries
DB::table('migrations')
    ->whereIn('migration', [
        '2026_03_20_124146_create_verification_documents_table',
        '2026_03_20_124157_add_reschedule_and_cancel_fields_to_bookings_table'
    ])->delete();
echo "- Cleaned migrations table\n";

echo "Done.\n";
