export const materialSelect = 'materialSelect';

export /* @ngInject */ function MaterialSelect() {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            $(document).ready(function() {
                $(element).material_select();
            });
        }
    };
}