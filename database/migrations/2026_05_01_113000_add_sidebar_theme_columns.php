<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    public function up(): void
    {
        Schema::table('theme_settings', function (Blueprint $table) {
            $table->string('sidebar_text', 7)->default('#9bb0d0')->after('dashboard_offline_text');
            $table->string('sidebar_text_active', 7)->default('#eaf2ff')->after('sidebar_text');
            $table->string('sidebar_section_text', 7)->default('#6f86aa')->after('sidebar_text_active');
            $table->string('sidebar_footer_text', 7)->default('#6f86aa')->after('sidebar_section_text');
            $table->string('sidebar_active_background', 7)->default('#12284d')->after('sidebar_footer_text');
            $table->string('sidebar_icon_background', 7)->default('#0b1730')->after('sidebar_active_background');
            $table->string('sidebar_hover_background', 7)->default('#0f2345')->after('sidebar_icon_background');
        });

        DB::table('theme_settings')->update([
            'sidebar_text' => '#9bb0d0',
            'sidebar_text_active' => '#eaf2ff',
            'sidebar_section_text' => '#6f86aa',
            'sidebar_footer_text' => '#6f86aa',
            'sidebar_active_background' => '#12284d',
            'sidebar_icon_background' => '#0b1730',
            'sidebar_hover_background' => '#0f2345',
        ]);
    }

    public function down(): void
    {
        Schema::table('theme_settings', function (Blueprint $table) {
            $table->dropColumn([
                'sidebar_text',
                'sidebar_text_active',
                'sidebar_section_text',
                'sidebar_footer_text',
                'sidebar_active_background',
                'sidebar_icon_background',
                'sidebar_hover_background',
            ]);
        });
    }
};
