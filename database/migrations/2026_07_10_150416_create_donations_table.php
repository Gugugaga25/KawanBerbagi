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
        Schema::create('donations', function (Blueprint $table) {
            $table->id('id_donation');
            $table->unsignedBigInteger('id_needs');
            $table->unsignedBigInteger('id_donor');
            $table->integer('jumlah_donasi');
            $table->string('status')->default('Pending'); // Pending, Sukses, Gagal
            $table->timestamps();

            $table->foreign('id_needs')->references('id_needs')->on('needs')->onDelete('cascade');
            $table->foreign('id_donor')->references('id_donor')->on('donors')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};
