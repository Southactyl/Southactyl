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
            $table->string('success_color', 7)->default('#22c55e')->after('sidebar_navigation');
            $table->string('warning_color', 7)->default('#f59e0b')->after('success_color');
            $table->string('danger_color', 7)->default('#ef4444')->after('warning_color');
            $table->string('info_color', 7)->default('#38bdf8')->after('danger_color');
            $table->string('text_primary', 7)->default('#eaf2ff')->after('info_color');
            $table->string('text_muted', 7)->default('#9bb0d0')->after('text_primary');
            $table->string('link_color', 7)->default('#6aa8ff')->after('text_muted');
            $table->string('link_hover_color', 7)->default('#9ec5ff')->after('link_color');
            $table->string('card_background', 7)->default('#0d1a31')->after('link_hover_color');
            $table->string('card_border', 7)->default('#223a63')->after('card_background');
            $table->string('input_background', 7)->default('#0a1730')->after('card_border');
            $table->string('input_border', 7)->default('#2b4878')->after('input_background');
            $table->string('topbar_background', 7)->default('#040d21')->after('input_border');
            $table->string('topbar_text', 7)->default('#c9daf6')->after('topbar_background');
            $table->string('footer_background', 7)->default('#040d21')->after('topbar_text');
            $table->string('footer_text', 7)->default('#b8cae8')->after('footer_background');
        });

        DB::table('theme_settings')->update([
            'success_color' => '#22c55e',
            'warning_color' => '#f59e0b',
            'danger_color' => '#ef4444',
            'info_color' => '#38bdf8',
            'text_primary' => '#eaf2ff',
            'text_muted' => '#9bb0d0',
            'link_color' => '#6aa8ff',
            'link_hover_color' => '#9ec5ff',
            'card_background' => '#0d1a31',
            'card_border' => '#223a63',
            'input_background' => '#0a1730',
            'input_border' => '#2b4878',
            'topbar_background' => '#040d21',
            'topbar_text' => '#c9daf6',
            'footer_background' => '#040d21',
            'footer_text' => '#b8cae8',
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('theme_settings', function (Blueprint $table) {
            $table->dropColumn([
                'success_color',
                'warning_color',
                'danger_color',
                'info_color',
                'text_primary',
                'text_muted',
                'link_color',
                'link_hover_color',
                'card_background',
                'card_border',
                'input_background',
                'input_border',
                'topbar_background',
                'topbar_text',
                'footer_background',
                'footer_text',
            ]);
        });
    }
};
