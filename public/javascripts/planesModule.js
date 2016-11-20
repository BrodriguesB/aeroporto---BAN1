(function () {
    'use strict';
    /*
     * Main AngularJS Web Application
     */

    /*global angular*/
    angular.module('AirportMainApp',['ngMaterial','ngMessages']);

    /**
     * TODO:Move controller to a separated file.
     */
    angular.module('AirportMainApp').controller('indexController', function ($scope, $http,$mdDialog,$mdToast) {

        const apiBaseUrl = '/api/modelo_aviao';
        $scope.currentManagedCard = undefined;

        $scope.showAdvanced = function(ev,edit) {
            //TODO : maybe filter the date.
            if(edit){
                //Transform to number FIXME: numbers should come as numbers from server.
                edit.id_modelo_aviao = Number(edit.id_modelo_aviao);
                edit.num_capacidade_passageiros = Number(edit.num_capacidade_passageiros);
                edit.qtd_peso = Number(edit.qtd_peso);
                edit.num_maximo_aeroporto = Number(edit.num_maximo_aeroporto);
                $scope.currentManagedCard = edit;
            } else {
                $scope.currentManagedCard = {
                    id_modelo_aviao: Number(String(+new Date).substr(0,11)),
                    cod_modelo_aviao: undefined,
                    num_capacidade_passageiros:undefined,
                    qtd_peso: undefined,
                    num_maximo_aeroporto:undefined,
                }
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
                            $scope.planes = response.data;
                            showSimpleToast("Avião adicionado"); //TODO:Call toaster.
                        }, function error() {
                            showSimpleToast("Houve um erro ao adicionar");
                        });

                } else {
                    $http.post(apiBaseUrl, converted)
                        .then(function success(response) {
                            $scope.planes = response.data;
                            showSimpleToast("Avião adicionado"); //TODO:Call toaster.
                        }, function error() {
                            showSimpleToast("Houve um erro ao adicionar");
                        });
                }
            }, function() {
                console.log('You cancelled the dialog.');
            });
        };

        function showSimpleToast(message) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(message)
                    .position("top right" )
                    .hideDelay(3000)
            );
        }

        function DialogController($scope, $mdDialog,item) {
            $scope.item = item;
            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };
        }


        //Pega os avioes
        function getPlanes(){
            $http.get(apiBaseUrl).then(function (response) {
                $scope.planes = response.data;
            });
        }

        $scope.deletePlane = function (plane){
            console.debug(plane.registro);
            $http.delete(apiBaseUrl+plane.registro)
                .success(function (response) {
                    $scope.planes = response;
                    console.info("Removed plane.")
            });
        };


        getPlanes();



    });
})();