import {isEmpty, unless} from "ramda";

export const tableController = 'DynamicTableController';

export /* @ngInject */ function DynamicTableController() {
    const _self = this;

    _self.getFirstKeys = function(obj){
        return unless(
            isEmpty,
            array => Object.keys(obj[0]).filter(x => !x.includes('$$'))
        )(obj);
    }
}