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
        Schema::table('shelters', function (Blueprint $table) {
            $table->string('akta_yayasan')->nullable()->after('status');
            $table->string('sk_kemenkumham')->nullable()->after('akta_yayasan');
            $table->string('izin_operasional')->nullable()->after('sk_kemenkumham');
            $table->string('npwp_yayasan')->nullable()->after('izin_operasional');
        });

        // Migrate existing data from dokumen_legalitas_panti to akta_yayasan (as a fallback)
        \Illuminate\Support\Facades\DB::table('shelters')->update([
            'akta_yayasan' => \Illuminate\Support\Facades\DB::raw('dokumen_legalitas_panti')
        ]);

        Schema::table('shelters', function (Blueprint $table) {
            $table->dropColumn('dokumen_legalitas_panti');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shelters', function (Blueprint $table) {
            $table->string('dokumen_legalitas_panti')->nullable()->after('status');
        });

        \Illuminate\Support\Facades\DB::table('shelters')->update([
            'dokumen_legalitas_panti' => \Illuminate\Support\Facades\DB::raw('akta_yayasan')
        ]);

        Schema::table('shelters', function (Blueprint $table) {
            $table->dropColumn(['akta_yayasan', 'sk_kemenkumham', 'izin_operasional', 'npwp_yayasan']);
        });
    }
};
