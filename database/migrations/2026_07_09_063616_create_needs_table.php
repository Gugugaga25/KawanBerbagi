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
        Schema::create('needs', function (Blueprint $table) {
            $table->id('id_needs');
            $table->unsignedBigInteger('id_shelter');
            $table->string('nama_kebutuhan');
            $table->integer('jumlah');
            $table->timestamps();

            $table->foreign('id_shelter')->references('id_shelter')->on('shelters')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('needs');
    }
};
