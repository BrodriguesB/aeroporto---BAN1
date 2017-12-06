export const tableController = 'DynamicTableController';

export /* @ngInject */ function DynamicTableController() {
    const _self = this;

    _self.getFirstKeys = function(obj){
        return Object.keys(obj[0]).filter(x => !x.includes('$$'));
    }
}