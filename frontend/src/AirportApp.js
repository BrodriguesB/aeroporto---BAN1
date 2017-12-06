import angular from 'angular';
import MaterializeModule from './modules/materialize/MaterilaizeModule';
import {airportAppController, AirportAppController} from "./controllers/AirportAppController";
import {tableController, TableController} from "./controllers/TableController";
import { airportAppService,AirportAppService} from "./services/AirportAppService";

// CSS
require('materialize-css/dist/css/materialize.min.css');

export default angular
    .module('AirportApp', [MaterializeModule])
    .service(airportAppService, AirportAppService)
    .controller(tableController, TableController)
    .controller(airportAppController, AirportAppController)
    .name;