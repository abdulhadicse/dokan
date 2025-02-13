import { setLocaleData, __, _x, __n, _nx, sprintf } from '@wordpress/i18n'

export default {
    methods: {
        setLocaleData( data ) {
            return setLocaleData( data )
        },

        __(text, domain) {
            return __(text, domain);
        },

        _nx( single, plural, number, context, domain ) {
            return _nx( single, plural, number, context, domain )
        },

        __n( single, plural, number, domain ) {
            return _n( single, plural, number, domain )
        },

        sprintf( fmt, ...args ) {
            return sprintf( fmt, ...args );
        },

        dateTimePickerFormat() {
          return {
            format: window.dokan_get_daterange_picker_format().toLowerCase(),
            ...window.dokan_helper.daterange_picker_local
          }
        },

        scrollToSettingField( fieldId, sectionId ) {
            this.$root.$emit( 'scrollToSettingField', fieldId, sectionId );
        }
    }
}
