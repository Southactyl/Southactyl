<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('server_group_servers', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('server_group_id');
            $table->unsignedInteger('server_id');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->foreign('server_group_id')->references('id')->on('server_groups')->cascadeOnDelete();
            $table->foreign('server_id')->references('id')->on('servers')->cascadeOnDelete();
            $table->unique(['server_group_id', 'server_id']);
            $table->index(['server_group_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('server_group_servers');
    }
};

