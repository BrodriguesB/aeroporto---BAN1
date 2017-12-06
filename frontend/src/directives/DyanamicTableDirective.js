import {tableController} from '../controllers/DynamicTableController';

export const dynamicTable = 'dynamicTable';

export /* @ngInject */ function DynamicTable() {
    return {
        restrict: 'E',
        template: [
            '<table ng-if="tableCtrl.bindData" ng-init="trackedData = tableCtrl.bindData">',
                '<thead>',
                    '<tr>',
                    '<th ng-repeat="dataKey in tableCtrl.getFirstKeys(trackedData)">{{dataKey}}</th>',
                    '</tr>',
                '</thead>',
                '<tbody>',
                    '<tr ng-repeat="dataElement in trackedData">',
                        '<td ng-repeat="value in dataElement">{{value}}</td>',
                    '</tr>',
                '</tbody>',
            '</table>',
        ].join(''),
        controller: tableController,
        controllerAs: 'tableCtrl',
        bindToController:{
            bindData: '='
        }
    };
}