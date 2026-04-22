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
            $table->string('info_color', 7)->default('#0ea5e9')->after('danger_color');
            $table->string('text_primary', 7)->default('#f8fafc')->after('info_color');
            $table->string('text_muted', 7)->default('#94a3b8')->after('text_primary');
            $table->string('link_color', 7)->default('#60a5fa')->after('text_muted');
            $table->string('link_hover_color', 7)->default('#93c5fd')->after('link_color');
            $table->string('card_background', 7)->default('#162130')->after('link_hover_color');
            $table->string('card_border', 7)->default('#334155')->after('card_background');
            $table->string('input_background', 7)->default('#1a2636')->after('card_border');
            $table->string('input_border', 7)->default('#475569')->after('input_background');
            $table->string('topbar_background', 7)->default('#05080f')->after('input_border');
            $table->string('topbar_text', 7)->default('#cbd5e1')->after('topbar_background');
            $table->string('footer_background', 7)->default('#05080f')->after('topbar_text');
            $table->string('footer_text', 7)->default('#cbd5e1')->after('footer_background');
        });

        DB::table('theme_settings')->update([
            'success_color' => '#22c55e',
            'warning_color' => '#f59e0b',
            'danger_color' => '#ef4444',
            'info_color' => '#0ea5e9',
            'text_primary' => '#f8fafc',
            'text_muted' => '#94a3b8',
            'link_color' => '#60a5fa',
            'link_hover_color' => '#93c5fd',
            'card_background' => '#162130',
            'card_border' => '#334155',
            'input_background' => '#1a2636',
            'input_border' => '#475569',
            'topbar_background' => '#05080f',
            'topbar_text' => '#cbd5e1',
            'footer_background' => '#05080f',
            'footer_text' => '#cbd5e1',
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
