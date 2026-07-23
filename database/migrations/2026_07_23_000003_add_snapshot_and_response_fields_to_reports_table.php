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
        Schema::table('reports', function (Blueprint $table) {
            $table->string('target_image')->nullable()->after('judul_target');
            $table->text('target_content')->nullable()->after('target_image');
            $table->unsignedBigInteger('id_shelter')->nullable()->after('target_content');
            $table->string('tindakan_admin')->nullable()->after('status'); // peringatan | takedown | ditolak
            $table->text('catatan_admin')->nullable()->after('tindakan_admin');

            $table->foreign('id_shelter')->references('id_shelter')->on('shelters')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->dropForeign(['id_shelter']);
            $table->dropColumn(['target_image', 'target_content', 'id_shelter', 'tindakan_admin', 'catatan_admin']);
        });
    }
};
