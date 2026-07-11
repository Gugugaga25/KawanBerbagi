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
        Schema::table('donations', function (Blueprint $table) {
            $table->string('kurir')->nullable();
            $table->string('resi')->nullable();
            $table->text('pesan')->nullable();
            $table->string('bukti_penerimaan')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('donations', function (Blueprint $table) {
            $table->dropColumn(['kurir', 'resi', 'pesan', 'bukti_penerimaan']);
        });
    }
};
