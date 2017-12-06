import angular from 'angular';
import {materializeDatePicker, MaterializeDatePicker} from "./directives/DatePicker";
import {materialSelect, MaterialSelect} from "./directives/MaterialSelect";

export default angular
    .module('MaterializeModule', [])
    .directive(materialSelect, MaterialSelect)
    .directive(materializeDatePicker, MaterializeDatePicker)
    .name;