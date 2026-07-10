<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('needs', 'terkumpul')) {
            Schema::table('needs', function (Blueprint $table) {
                $table->integer('terkumpul')->default(0);
                $table->string('satuan')->default('Pcs');
                $table->boolean('is_mendesak')->default(false);
            });
        }
    }

    public function down(): void
    {
        Schema::table('needs', function (Blueprint $table) {
            $table->dropColumn(['terkumpul', 'satuan', 'is_mendesak']);
        });
    }
};
