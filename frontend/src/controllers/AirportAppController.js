export const airportAppController = 'AirportAppController';

export /* @ngInject */ function AirportAppController(AirportAppService) {
    const _self = this;
    _self.fligthDate = '';
    _self.companhiesInitialSelected = '';
    _self.selectedTable = '';
    _self.availableTables = [
        'pais',
        'estado',
        'aeroporto',
        'companhia',
        'modelo',
        'aeronave',
        'voo',
        'bagagem',
        'passageiros',
        'tripulacao',
        'habilitacao'
    ];

    _self.openSearchFlightsByDate = function (date) {
        if (date) {
            AirportAppService
                .openFlights(date)
                .then(({data}) => _self.data = data);
        }
    };

    _self.getCompaniesToSelect = function () {
        AirportAppService
            .getTableData('companhia')
            .then(({data}) => _self.companhiesInitials = data);
    };

    _self.searchAirportsByInitials = function () {
        const initials = _self.companhiesInitialSelected;
        if(initials){
            AirportAppService
                .searchAirportsByInitials(initials.nome)
                .then(({data}) => _self.companiesData = data);

        }
    };

    _self.fetchTableData = function () {
        if(_self.selectedTable){
            AirportAppService
                .getTableData(_self.selectedTable)
                .then(({data}) => _self.tableData = data);
        }
    };

    (function init() {
        _self.getCompaniesToSelect()
    }());
}