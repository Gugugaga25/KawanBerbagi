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
            $table->string('foto_banner')->nullable();
            $table->string('foto_profil')->nullable();
            $table->text('deskripsi')->nullable();
            $table->string('website')->nullable();
            $table->string('tahun_berdiri')->nullable();
            $table->json('posts')->nullable();
            $table->json('pengurus')->nullable();
            $table->json('laporan_audits')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shelters', function (Blueprint $table) {
            $table->dropColumn([
                'foto_banner',
                'foto_profil',
                'deskripsi',
                'website',
                'tahun_berdiri',
                'posts',
                'pengurus',
                'laporan_audits',
            ]);
        });
    }
};
