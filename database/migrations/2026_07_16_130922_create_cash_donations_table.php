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
        Schema::create('cash_donations', function (Blueprint $table) {
            $table->id('id_cash_donation');
            $table->unsignedBigInteger('id_donor');
            $table->unsignedBigInteger('id_shelter');
            $table->bigInteger('nominal');
            $table->string('metode_pembayaran');
            $table->text('pesan')->nullable();
            $table->boolean('is_anonim')->default(false);
            $table->boolean('developer_tip')->default(false);
            $table->string('status')->default('Pending'); // Pending, Sukses, Batal
            $table->timestamps();

            $table->foreign('id_donor')->references('id_donor')->on('donors')->onDelete('cascade');
            $table->foreign('id_shelter')->references('id_shelter')->on('shelters')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cash_donations');
    }
};
