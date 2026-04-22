<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('theme_settings', function (Blueprint $table) {
            $table->id();
            $table->string('primary_content', 7)->default('#3b82f6');
            $table->string('secondary_content', 7)->default('#94a3b8');
            $table->string('background_color', 7)->default('#070b13');
            $table->string('component_headers', 7)->default('#0f1622');
            $table->string('sidebar_navigation', 7)->default('#05080f');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        DB::table('theme_settings')->insert([
            'primary_content' => '#3b82f6',
            'secondary_content' => '#94a3b8',
            'background_color' => '#070b13',
            'component_headers' => '#0f1622',
            'sidebar_navigation' => '#05080f',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('theme_settings');
    }
};
