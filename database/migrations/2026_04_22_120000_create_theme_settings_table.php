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
            $table->string('primary_content', 7)->default('#3d8bff');
            $table->string('secondary_content', 7)->default('#9bb0d0');
            $table->string('background_color', 7)->default('#050b1a');
            $table->string('component_headers', 7)->default('#0b162b');
            $table->string('sidebar_navigation', 7)->default('#030b1f');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        DB::table('theme_settings')->insert([
            'primary_content' => '#3d8bff',
            'secondary_content' => '#9bb0d0',
            'background_color' => '#050b1a',
            'component_headers' => '#0b162b',
            'sidebar_navigation' => '#030b1f',
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
