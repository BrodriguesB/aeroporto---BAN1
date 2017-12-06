export const materializeDatePicker = 'datepicker';

export /* @ngInject */ function MaterializeDatePicker() {
    return {
        restrict: 'C',
        link: function (scope, element, attr) {
            $(document).ready(function() {
                $(element).pickadate({
                    selectMonths: true, // Creates a dropdown to control month
                    selectYears: 15, // Creates a dropdown of 15 years to control year,
                    today: 'Today',
                    clear: 'Clear',
                    close: 'Ok',
                    closeOnSelect: false // Close upon selecting a date,
                });
            });
        }
    };
}