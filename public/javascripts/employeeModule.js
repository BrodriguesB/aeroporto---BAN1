(function () {
    'use strict';
    /*
     * Main AngularJS Web Application
     */

    /*global angular*/
    angular.module('EmployeeMainApp',['ngMaterial','ngMessages']);

    /**
     * TODO:Move controller to a separated file.
     */
    angular.module('EmployeeMainApp').controller('indexController', function ($scope, $http,$mdDialog,$mdToast) {

        const apiBaseUrl = '/api/funcionario/';
        $scope.currentManagedCard = undefined;

        $scope.showAdvanced = function(ev,edit) {
            //TODO : maybe filter the date.
            if(edit){
                $scope.currentManagedCard = edit;
            } else {
                $scope.currentManagedCard = {
                    num_matricula: Number(String(+new Date).substr(0,11)),
                    nom_funcionario: undefined,
                    den_endereco:undefined,
                    num_telefone: undefined,
                    val_salario:undefined,
                    id_cargo:undefined,
                    num_membro_sindicato:undefined,
                    id_sindicato:undefined,
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
                            $scope.employees = response.data;
                            showSimpleToast("Adicionado");
                        }, function error() {
                            showSimpleToast("Houve um erro ao adicionar");
                        });

                } else {
                    $http.post(apiBaseUrl, converted)
                        .then(function success(response) {
                            $scope.employees = response.data;
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

            $scope.offices = null;
            $scope.selectedOffice =  null;

            $scope.getFrom = function (url,keyForScope){
                $http.get(url).then(function (response) {
                    $scope[keyForScope] = response.data;
                });
            };

        }


        //Pega os avioes
        function getAll(){
            $http.get(apiBaseUrl).then(function (response) {
                $scope.employees = response.data;
            });
        }

        $scope.delete = function (item){
            console.debug(item.num_matricula);
            $http.delete(apiBaseUrl+"num_matricula/"+item.num_matricula)
                .success(function (response) {
                    $scope.employees = response;
                    showSimpleToast("Empregado removido");
                });
        };

        getAll();



    });
})();