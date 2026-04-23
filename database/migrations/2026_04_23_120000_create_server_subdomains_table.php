<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('server_subdomains', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('server_id');
            $table->unsignedInteger('allocation_id')->nullable();
            $table->string('subdomain', 191);
            $table->string('domain', 191);
            $table->string('fqdn', 191);
            $table->string('record_type', 16);
            $table->string('record_id', 191);
            $table->string('srv_record_id', 191)->nullable();
            $table->string('target', 191);
            $table->unsignedInteger('port')->nullable();
            $table->boolean('proxied')->default(false);
            $table->timestamps();

            $table->foreign('server_id')->references('id')->on('servers')->cascadeOnDelete();
            $table->foreign('allocation_id')->references('id')->on('allocations')->nullOnDelete();
            $table->unique(['server_id', 'fqdn']);
            $table->index(['server_id', 'allocation_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('server_subdomains');
    }
};
