import {tableController} from '../controllers/DynamicTableController';

export const dynamicTable = 'dynamicTable';

export /* @ngInject */ function DynamicTable() {
    return {
        restrict: 'E',
        template: [
            '<table ng-if="tableCtrl.bindData">',
                '<thead>',
                    '<tr>',
                    '<th ng-repeat="dataKey in tableCtrl.getFirstKeys(tableCtrl.bindData)">{{dataKey}}</th>',
                    '</tr>',
                '</thead>',
                '<tbody>',
                    '<tr ng-repeat="dataElement in tableCtrl.bindData">',
                        '<td ng-repeat="value in dataElement">{{value}}</td>',
                    '</tr>',
                '</tbody>',
            '</table>',
            ''
        ].join(''),
        controller: tableController,
        controllerAs: 'tableCtrl',
        bindToController:{
            bindData: '='
        }
    };
}