import angular from 'angular';
import MaterializeModule from './modules/materialize/MaterilaizeModule';
import {airportAppController, AirportAppController} from "./controllers/AirportAppController";
import {tableController, DynamicTableController} from "./controllers/DynamicTableController";
import { airportAppService,AirportAppService} from "./services/AirportAppService";
import { dynamicTable, DynamicTable} from "./directives/DyanamicTableDirective";

// CSS
require('materialize-css/dist/css/materialize.min.css');

console.log(dynamicTable,DynamicTable);

export default angular
    .module('AirportApp', [MaterializeModule])
    .service(airportAppService, AirportAppService)
    .controller(tableController, DynamicTableController)
    .controller(airportAppController, AirportAppController)
    .directive(dynamicTable, DynamicTable)
    .name;