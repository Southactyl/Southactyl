<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('server_subdomains', function (Blueprint $table) {
            $table->unsignedInteger('domain_id')->nullable()->after('allocation_id');
            $table->foreign('domain_id')->references('id')->on('subdomain_domains')->nullOnDelete();
            $table->index(['server_id', 'domain_id']);
        });
    }

    public function down(): void
    {
        Schema::table('server_subdomains', function (Blueprint $table) {
            $table->dropForeign(['domain_id']);
            $table->dropIndex(['server_id', 'domain_id']);
            $table->dropColumn('domain_id');
        });
    }
};

