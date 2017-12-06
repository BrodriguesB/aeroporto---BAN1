import {tableController} from '../controllers/DynamicTableController';

export const dynamicTable = 'dynamicTable';

export /* @ngInject */ function DynamicTable() {
    return {
        restrict: 'E',
        template: [
            '<table ng-if="tableCtrl.bindData" class="striped">',
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
            '<h5 ng-show="!tableCtrl.bindData"> ',
                'Não há dados para exibir',
            '</h5>',
        ].join(''),
        controller: tableController,
        controllerAs: 'tableCtrl',
        bindToController:{
            bindData: '='
        }
    };
}