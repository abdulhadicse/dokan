<?php

namespace WeDevs\Dokan\Admin\Notices;

use WeDevs\Dokan\Traits\ChainableContainer;

/**
 * Dokan Admin notices handler class
 *
 * @since 3.3.3
 */
class Manager {
    use ChainableContainer;

    /**
     * Class constructor
     *
     * @since 3.3.3
     */
    public function __construct() {
        $this->init_classes();
        $this->init_hooks();
    }

    /**
     * Register all notices classes to chainable container
     *
     * @since 3.3.3
     *
     * @return void
     */
    private function init_classes() {
        $this->container['whats_new']              = new WhatsNew();
        $this->container['setup_wizard']           = new SetupWizard();
        $this->container['plugin_review']          = new PluginReview();
        $this->container['limited_time_promotion'] = new LimitedTimePromotion();
    }

    /**
     * Handle notices that has no ajax action
     *
     *  @since 3.3.3
     *
     * @return void
     */
    private function init_hooks() {
        add_action( 'admin_enqueue_scripts', [ $this, 'load_dokan_admin_notices_styles' ] );
        add_action( 'admin_notices', [ $this, 'render_missing_woocommerce_notice' ] );
        add_action( 'admin_notices', [ $this, 'render_global_admin_notices_html' ] );
        add_filter( 'dokan_admin_notices', [ $this, 'show_permalink_setting_notice' ] );
        add_filter( 'dokan_admin_notices', [ $this, 'show_admin_logo_update_notice' ] );
        add_action( 'wp_ajax_dismiss_dokan_admin_logo_update_notice', [ $this, 'dismiss_dokan_admin_logo_update_notice' ] );
    }

    /**
     * Load admin notices style and styles
     *
     * @since 3.3.6
     *
     * @return void
     */
    public function load_dokan_admin_notices_styles() {
        wp_enqueue_style( 'dokan-global-admin-css', DOKAN_PLUGIN_ASSEST . '/css/global-admin.css', [], filemtime( DOKAN_DIR . '/assets/css/global-admin.css' ) );
    }

    /**
     * Render dokan global admin notices via Vue.js
     *
     * @since 3.3.3
     *
     * @return void
     */
    public function render_global_admin_notices_html() {
        echo '<div id="dokan-admin-notices"></div>';
    }

    /**
     * Missing WooCommerce notice
     *
     * @since 2.9.16
     *
     * @return void
     */
    public function render_missing_woocommerce_notice() {
        // check wooCommerce is available and active
        $has_woocommerce = dokan()->has_woocommerce();

        // check if woocommerce installed
        $woocommerce_installed = dokan()->is_woocommerce_installed();

        if ( ( ! $has_woocommerce || ! $woocommerce_installed ) && current_user_can( 'activate_plugins' ) ) {
            dokan_get_template(
                'admin-notice-dependencies.php', [
                    'has_woocommerce' => $has_woocommerce,
                    'woocommerce_installed' => $woocommerce_installed,
                ]
            );
        }
    }

    /**
     * Display permalink format not working for Dokan notice
     *
     * @since 3.3.3
     *
     * @param array $notices
     *
     * @return array
     */
    public function show_permalink_setting_notice( $notices ) {
        if ( empty( get_option( 'permalink_structure' ) ) ) {
            $notices[] = [
                'type'        => 'alert',
                /* translators: %s permalink settings url */
                'description' => sprintf( __( 'The <strong>Plain</strong> permalink structure is not working for the Dokan plugin. Please change your permalink structure from <a href="%s">Settings > Permalinks</a>', 'dokan-lite' ), admin_url( 'options-permalink.php' ) ),
                'priority'    => 1,
                'actions'     => [
                    [
                        'type'   => 'primary',
                        'text'   => __( 'Go to Settings', 'dokan-lite' ),
                        'action' => admin_url( 'options-permalink.php' ),
                    ],
                ],
            ];
        }

        return $notices;
    }

    /**
     * Display dokan admin logo update notice.
     *
     * @since DOKAN_SINCE
     *
     * @param array $notices
     *
     * @return array
     */
    public function show_admin_logo_update_notice( array $notices ): array {
        if ( 'yes' !== get_option( 'dismiss_dokan_admin_logo_update_notice', 'no' ) ) {
            $notices[] = [
                'priority'          => 1,
                'show_close_button' => true,
                'type'              => 'info',
                'title'             => __( 'New Dokan Logo!', 'dokan-lite' ),
                'description'       => __( 'Introducing the new freshly designed Dokan Logo. Keep an eye on your admin dashboard!!', 'dokan-lite' ),
                'ajax_data'         => [
                    'action' => 'dismiss_dokan_admin_logo_update_notice',
                    'nonce'  => wp_create_nonce( 'dismiss_dokan_admin_logo_update_notice_nonce' ),
                ],
            ];
        }

        return $notices;
    }

    /**
     * Dismisses dokan admin logo update notice.
     *
     * @since DOKAN_SINCE
     *
     * @return void
     */
    public function dismiss_dokan_admin_logo_update_notice() {
        $this->dismiss_notice( 'dismiss_dokan_admin_logo_update_notice' );
    }

    /**
     * Dismisses dokan notice.
     *
     * @since DOKAN_SINCE
     *
     * @param string $option_name The name of the option to update.
     *
     * @return void
     */
    private function dismiss_notice( string $option_name ) {
        // Check nonce actions.
        if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( sanitize_key( wp_unslash( $_POST['nonce'] ) ), $option_name . '_nonce' ) ) {
            wp_send_json_error( __( 'Invalid nonce', 'dokan-lite' ) );
        }

        // Check permission.
        if ( ! current_user_can( 'manage_woocommerce' ) ) { // phpcs:ignore
            wp_send_json_error( __( 'You have no permission to do that', 'dokan-lite' ) );
        }

        // Dismiss dokan admin logo notice.
        update_option( $option_name, 'yes' );
        wp_send_json_success();
    }
}
