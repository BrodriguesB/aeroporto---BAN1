(function () {
    'use strict';
    /*
     * Main AngularJS Web Application
     */

    /*global angular*/
    angular.module('PlanesModule',['ngMaterial','ngMessages']);

    /**
     * TODO:Move controller to a separated file.
     */
    angular.module('PlanesModule').controller('planesController', function ($scope, $http,$mdDialog) {

        const apiBaseUrl = '/api/aviao/';
        $scope.currentManagedCard = undefined;

        $scope.showAdvanced = function(ev,edit) {
            //TODO : maybe filter the date.
            if(edit){
                //Transform to number FIXME: numbers should come as numbers from server.
                tryParseNtoN(edit);
                $scope.currentManagedCard = edit;
            } else {
                $scope.currentManagedCard = {
                    id_aviao: getDateInIdForm(),
                    id_modelo_aviao: undefined,
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
                    requestItems: [
                        ['api/modelo_aviao/','planeModels'],
                        ['api/cargo','offices']
                    ]
                },
            }).then(function(answer) {
                let id= answer.id_aviao;
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
                    $http.put(apiBaseUrl+"id_aviao/"+id, converted)
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

                response.data.forEach((x)=>{
                    getSpecificToScope('api/modelo_aviao/single/cod_modelo_aviao/id_modelo_aviao/'+x.id_modelo_aviao,x.id_modelo_aviao);
                    getSpecificToScope('api/teste_aviao/count/id_aviao/' + x.id_aviao, x.id_aviao + 'counter');
                });
            });
        }

        $scope.delete = function (plane) {
            if ($scope.requestedsArr[plane.id_aviao + 'counter'] != 0) {
                showSimpleToast("Não é possível deletar o avião pois há testes registrados para ele.");
                return;
            }
            console.debug(plane.id_aviao);
            $http.delete(apiBaseUrl+'id_aviao/'+plane.id_aviao)
                .success(function (response) {
                    $scope.planes = response;
                    showSimpleToast("Removed plane.")
                });
        };

        getPlanes();

    });
})();