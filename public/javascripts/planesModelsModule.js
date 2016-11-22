(function () {
    'use strict';
    /*
     * Main AngularJS Web Application
     */

    /*global angular*/
    angular.module('PlanesModelsModule',['ngMaterial','ngMessages']);

    /**
     * TODO:Move controller to a separated file.
     */
    angular.module('PlanesModelsModule').controller('planesModelsController', function ($scope, $http,$mdDialog) {

        const apiBaseUrl = '/api/modelo_aviao/';
        $scope.currentManagedCard = undefined;

        $scope.showAdvanced = function(ev,edit) {
            //TODO : maybe filter the date.
            if(edit){
                //Transform to number FIXME: numbers should come as numbers from server.
                tryParseNtoN(edit);
                $scope.currentManagedCard = edit;
            } else {
                $scope.currentManagedCard = {
                    id_modelo_aviao: getDateInIdForm(),
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
                    item: $scope.currentManagedCard,
                    requestItems: false
                },
            }).then(function(answer) {
                let id= answer.id_modelo_aviao;
                if(edit) {
                    answer = getDiff(answer, edit);
                    console.log(answer);
                    //If there's no diff.
                    if(!Object.keys(answer).length) return;
                }
                let converted = angular.toJson(answer);

                if (!converted || converted.indexOf('undefined')!=-1){
                    showSimpleToast("Todos os campos são requeridos");
                    return;
                }

                if(edit){
                    $http.put(apiBaseUrl+"id_modelo_aviao/"+id, converted)
                        .then(function success(response) {
                            $scope.planes = response.data;
                            showSimpleToast("Alterado"); //TODO:Call toaster.
                        }, function error() {
                            showSimpleToast("Houve um erro ao alterar");
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

        //Pega os avioes
        function getPlanes(){
            $http.get(apiBaseUrl).then(function (response) {
                $scope.planes = response.data;
            });
        }

        $scope.deletePlane = function (plane){
            console.debug(plane.id_modelo_aviao);
            $http.delete(apiBaseUrl+'id_modelo_aviao/'+plane.id_modelo_aviao)
                .success(function (response) {
                    $scope.planes = response;
                    showSimpleToast("Removed plane.")
            });
        };

        getPlanes();

    });
})();