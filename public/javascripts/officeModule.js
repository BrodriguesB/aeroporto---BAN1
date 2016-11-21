(function () {
    'use strict';
    /*
     * Main AngularJS Web Application
     */

    /*global angular*/
    angular.module('OfficeMainApp',['ngMaterial','ngMessages']);

    /**
     * TODO:Move controller to a separated file.
     */
    angular.module('OfficeMainApp').controller('indexController', function ($scope, $http,$mdDialog,$mdToast) {

        const apiBaseUrl = '/api/cargo';
        $scope.currentManagedCard = undefined;

        $scope.showAdvanced = function(ev,edit) {
            //TODO : maybe filter the date.
            if(edit){
                $scope.currentManagedCard = edit;
            } else {
                $scope.currentManagedCard = {
                    id_cargo: Number(String(+new Date).substr(0,11)),
                    den_cargo: undefined,
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
                            $scope.offices = response.data;
                            showSimpleToast("Adicionado");
                        }, function error() {
                            showSimpleToast("Houve um erro ao adicionar");
                        });

                } else {
                    $http.post(apiBaseUrl, converted)
                        .then(function success(response) {
                            $scope.offices = response.data;
                            showSimpleToast("Adicionado");
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
        function getAll(){
            $http.get(apiBaseUrl).then(function (response) {
                $scope.offices = response.data;
            });
        }

        $scope.delete = function (item){
            console.debug(item.num_matricula);
            $http.delete(apiBaseUrl+item.num_matricula)
                .success(function (response) {
                    $scope.offices = response;
                    showSimpleToast("Cargo removido");
                });
        };


        getAll();



    });
})();