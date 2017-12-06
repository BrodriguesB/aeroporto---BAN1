import moment from 'moment';
import {host} from '../../../configurations';

export const airportAppService = 'AirportAppService';

export /* @ngInject */ function AirportAppService($http) {
    const _self = this;

    _self.openFlights = function (date) {
        let dataObject = {};

        if (date) {
            const jsDate = new Date(date);
            const momentDate = moment(jsDate).format('DD-MM-YYYY');
            dataObject = {
                date: momentDate
            };
        }

        return $http({
            method: 'POST',
            url: `http://${host}:3000/search/flights`,
            data: dataObject
        });

    };
    _self.fetchPassengerFlights = function (date) {
        let dataObject = {};

        if (date) {
            const jsDate = new Date(date);
            const momentDate = moment(jsDate).format('DD-MM-YYYY');
            dataObject = {
                date: momentDate
            };
        }

        return $http({
            method: 'POST',
            url: `http://${host}:3000/search/passengers/flights`,
            data: dataObject
        });

    };

    _self.searchAirportsByInitials = function (initials) {
        let dataObject = {initials};

        return $http({
            method: 'POST',
            url: `http://${host}:3000/search/company/airports/`,
            data: dataObject
        });
    };

    _self.getTableData = function (table) {
        return $http({
            method: 'GET',
            url: `http://${host}:3000/api/tables/${table}`,
        });
    }
}