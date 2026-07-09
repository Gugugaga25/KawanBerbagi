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
        Schema::create('shelters', function (Blueprint $table) {
            $table->id('id_shelter');
            $table->unsignedBigInteger('id_user');
            $table->string('nama_yayasan');
            $table->string('nama_penanggung_jawab');
            $table->text('alamat');
            $table->string('dokumen_legalitas_panti')->nullable();
            $table->string('dokumentasi_panti')->nullable();
            $table->timestamps();

            $table->foreign('id_user')->references('id_user')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shelters');
    }
};
