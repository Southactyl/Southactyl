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
        Schema::table('theme_settings', function (Blueprint $table) {
            $table->string('dashboard_panel_background', 7)->default('#0a1427')->after('footer_text');
            $table->string('dashboard_panel_border', 7)->default('#1f3357')->after('dashboard_panel_background');
            $table->string('dashboard_stat_background', 7)->default('#101c35')->after('dashboard_panel_border');
            $table->string('dashboard_stat_border', 7)->default('#243d65')->after('dashboard_stat_background');
            $table->string('dashboard_search_background', 7)->default('#0b1730')->after('dashboard_stat_border');
            $table->string('dashboard_search_border', 7)->default('#2f4c7e')->after('dashboard_search_background');
            $table->string('dashboard_online_text', 7)->default('#27d17f')->after('dashboard_search_border');
            $table->string('dashboard_offline_text', 7)->default('#fb5f71')->after('dashboard_online_text');
        });

        DB::table('theme_settings')->update([
            'dashboard_panel_background' => '#0a1427',
            'dashboard_panel_border' => '#1f3357',
            'dashboard_stat_background' => '#101c35',
            'dashboard_stat_border' => '#243d65',
            'dashboard_search_background' => '#0b1730',
            'dashboard_search_border' => '#2f4c7e',
            'dashboard_online_text' => '#27d17f',
            'dashboard_offline_text' => '#fb5f71',
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('theme_settings', function (Blueprint $table) {
            $table->dropColumn([
                'dashboard_panel_background',
                'dashboard_panel_border',
                'dashboard_stat_background',
                'dashboard_stat_border',
                'dashboard_search_background',
                'dashboard_search_border',
                'dashboard_online_text',
                'dashboard_offline_text',
            ]);
        });
    }
};
