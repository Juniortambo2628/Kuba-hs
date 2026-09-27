<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * providers.experience_years and providers.service_radius were created
     * nullable with no default, while User already defaulted them to 0 and 10
     * and the Provider accessors coerce to exactly those. The columns now
     * say the same thing out loud: NULL stops being what a raw insert
     * leaves behind, and reads do not change (the accessors still fall back
     * to 0 and 10 for rows that already hold NULL).
     *
     * Nullable is kept, and no existing row is rewritten - only the default
     * is added, so nothing here has to be undone by hand.
     */
    public function up(): void
    {
        $this->alterColumn('experience_years', 0);
        $this->alterColumn('service_radius', 10);
    }

    /**
     * Reverse the migrations.
     *
     * MySQL keeps a default that the MODIFY statement does not mention, so
     * the default has to be dropped explicitly there. SQLite rebuilds the
     * table from the definition it is given, so a definition without a
     * default is enough.
     */
    public function down(): void
    {
        foreach (['experience_years', 'service_radius'] as $column) {
            if (! $this->hasColumn($column)) {
                continue;
            }

            $driver = Schema::getConnection()->getDriverName();

            if (in_array($driver, ['mysql', 'mariadb'], true)) {
                DB::statement("alter table `providers` alter `{$column}` drop default");

                continue;
            }

            Schema::table('providers', function (Blueprint $table) use ($column) {
                $table->integer($column)->nullable()->change();
            });
        }
    }

    private function alterColumn(string $column, int $default): void
    {
        if (! $this->hasColumn($column)) {
            return;
        }

        Schema::table('providers', function (Blueprint $table) use ($column, $default) {
            $table->integer($column)->nullable()->default($default)->change();
        });
    }

    private function hasColumn(string $column): bool
    {
        return Schema::hasTable('providers') && Schema::hasColumn('providers', $column);
    }
};
