<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('subdomain_domains', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 191)->unique();
            $table->string('cloudflare_zone_id', 191);
            $table->text('cloudflare_api_token');
            $table->boolean('enabled')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subdomain_domains');
    }
};

