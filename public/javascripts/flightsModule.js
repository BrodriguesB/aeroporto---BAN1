(function () {
    'use strict';
    /*
     * Main AngularJS Web Application
     */

    /*global angular*/
    angular.module('flightModule',['ngMaterial','ngMessages']);

    /**
     * TODO:Move controller to a separated file.
     */
    angular.module('flightModule').controller('flightController', function ($scope, $http,$mdDialog,$mdToast) {

        $scope.currentManagedCard = undefined;

        $scope.showAdvanced = function(ev,edit) {
            //TODO : maybe filter the date.
            if(edit){
                edit.data_aquisicao = new Date(edit.data_aquisicao);
                $scope.currentManagedCard = edit;
            } else {
                $scope.currentManagedCard = {
                    modelo:'',
                    max_passageiros:'',
                    max_carga:'',
                    data_aquisicao: + new Date,
                    companhia:''
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
                    $http.post('/api/avioes', converted)
                        .then(function success(response) {
                            $scope.planes = response.data;
                            showSimpleToast("Avião adicionado"); //TODO:Call toaster.
                        }, function error() {
                            showSimpleToast("Houve um erro ao adicionar");
                        });

                } else {
                    $http.post('/api/avioes', converted)
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
                    .position("bottom right" )
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
            $http.get('/api/avioes').then(function (response) {
                $scope.planes = response.data;
            });
        }

        $scope.deletePlane = function (plane){
            console.debug(plane.registro);
            $http.delete('/api/avioes/'+plane.registro)
                .success(function (response) {
                    $scope.planes = response;
                    console.info("Removed plane.")
                });
        };


        //getPlanes();



    });
})();