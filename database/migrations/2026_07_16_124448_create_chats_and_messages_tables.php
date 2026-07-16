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
        Schema::create('chats', function (Blueprint $table) {
            $table->id('id_chat');
            $table->unsignedBigInteger('id_donor');
            $table->unsignedBigInteger('id_shelter');
            $table->timestamps();

            $table->foreign('id_donor')->references('id_donor')->on('donors')->onDelete('cascade');
            $table->foreign('id_shelter')->references('id_shelter')->on('shelters')->onDelete('cascade');
        });

        Schema::create('messages', function (Blueprint $table) {
            $table->id('id_message');
            $table->unsignedBigInteger('id_chat');
            $table->unsignedBigInteger('id_sender');
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->timestamps();

            $table->foreign('id_chat')->references('id_chat')->on('chats')->onDelete('cascade');
            $table->foreign('id_sender')->references('id_user')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
        Schema::dropIfExists('chats');
    }
};
