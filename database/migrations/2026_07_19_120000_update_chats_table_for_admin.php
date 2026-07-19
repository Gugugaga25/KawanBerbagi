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
        Schema::table('chats', function (Blueprint $table) {
            $table->unsignedBigInteger('id_donor')->nullable()->change();
            $table->unsignedBigInteger('id_shelter')->nullable()->change();
            $table->unsignedBigInteger('id_admin')->nullable()->after('id_chat');

            $table->foreign('id_admin')->references('id_user')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('chats', function (Blueprint $table) {
            $table->dropForeign(['id_admin']);
            $table->dropColumn('id_admin');
            $table->unsignedBigInteger('id_donor')->nullable(false)->change();
            $table->unsignedBigInteger('id_shelter')->nullable(false)->change();
        });
    }
};
