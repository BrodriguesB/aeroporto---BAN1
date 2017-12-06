export const airportAppController = 'AirportAppController';

export /* @ngInject */ function AirportAppController(AirportAppService) {
    const _self = this;
    _self.fligthDate = '';

    _self.openSearchFlightsByDate = function (date) {
        if (date) {
            AirportAppService
                .openFlights(date)
                .then(({data}) => _self.data = data);
        }
    };


}