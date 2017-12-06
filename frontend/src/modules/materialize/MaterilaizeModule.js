import angular from 'angular';
import {materializeDatePicker, MaterializeDatePicker} from "./directives/DatePicker";

export default angular
    .module('MaterializeModule', [])
    .directive(materializeDatePicker, MaterializeDatePicker)
    .name;