(function () {
    'use strict';
    /*
     * Main AngularJS Web Application
     */

    /*global angular*/
    angular.module('UnionModule',['ngMaterial','ngMessages']);

    /**
     * TODO:Move controller to a separated file.
     */
    angular.module('UnionModule').controller('unionController', function ($scope, $http,$mdDialog) {
        const apiBaseUrl = '/api/sindicato/';
        $scope.currentManagedCard = undefined;

        $scope.showAdvanced = function(ev,edit) {
            //TODO : maybe filter the date.
            if(edit){
                edit.id_sindicato = Number(edit.id_sindicato);
                $scope.currentManagedCard = edit;
            } else {
                $scope.currentManagedCard = {
                    id_sindicato: Number(String(+new Date).substr(0,11)),
                    den_sindicato: undefined,
                };
            }
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'dialog1.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: false, // Only for -xs, -sm breakpoints.
                locals: {
                    item: $scope.currentManagedCard
                },
            }).then(function(answer) {
                let converted = angular.toJson(answer);

                if (!converted || converted.indexOf('undefined')!=-1){
                    showSimpleToast("Todos os campos são requeridos");
                    return;
                }

                if(edit){
                    $http.post(apiBaseUrl, converted)
                        .then(function success(response) {
                            $scope.unions = response.data;
                            showSimpleToast("Adicionado");
                        }, function error() {
                            showSimpleToast("Houve um erro ao adicionar");
                        });

                } else {
                    $http.post(apiBaseUrl, converted)
                        .then(function success(response) {
                            $scope.unions = response.data;
                            showSimpleToast("Adicionado");
                        }, function error() {
                            showSimpleToast("Houve um erro ao adicionar");
                        });
                }
            }, function() {
                console.log('You cancelled the dialog.');
            });
        };

        $scope.delete = function (item){
            console.debug(item.id_sindicato);
            $http.delete(apiBaseUrl+'id_sindicato/'+item.id_sindicato)
                .success(function (response) {
                    $scope.unions = response;
                    showSimpleToast("Sindicato removido");
                });
        };

        function getAll(){
            $http.get(apiBaseUrl).then(function (response) {
                $scope.unions = response.data;
            });
        }
        getAll();

    });
})();