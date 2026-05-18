<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alerts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('message');
            $table->enum('type', ['info', 'warning', 'success', 'error'])->default('info');
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->enum('sender_role', ['admin', 'midwife']);
            $table->unsignedBigInteger('sender_id');
            $table->enum('recipient_type', ['all', 'barangay', 'specific', 'admin'])->default('all');
            $table->json('recipient_ids')->nullable();
            $table->text('reply')->nullable();
            $table->timestamp('reply_at')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
            
            $table->foreign('sender_id')->references('id')->on('users')->onDelete('cascade');
            $table->index(['sender_role', 'sender_id']);
            $table->index(['recipient_type']);
            $table->index('expires_at');
            $table->index('read_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alerts');
    }
};
