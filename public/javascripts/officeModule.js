(function () {
    'use strict';
    /*
     * Main AngularJS Web Application
     */

    /*global angular*/
    angular.module('OfficeModule',['ngMaterial','ngMessages']);

    /**
     * TODO:Move controller to a separated file.
     */
    angular.module('OfficeModule').controller('officeController', function ($scope, $http, $mdDialog) {

        const apiBaseUrl = '/api/cargo/';
        $scope.currentManagedCard = undefined;

        $scope.showAdvanced = function(ev,edit) {
            //TODO : maybe filter the date.
            if(edit){
                tryParseNtoN(edit);
                $scope.currentManagedCard = edit;
            } else {
                $scope.currentManagedCard = {
                    id_cargo: getDateInIdForm(),
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
                    item: $scope.currentManagedCard,
                    requestItems: false
                },
            }).then(function(answer) {
                let id= answer.id_cargo;
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
                    $http.put(apiBaseUrl+"id_cargo/"+id, converted)
                        .then(function success(response) {
                            $scope.offices = response.data;
                            showSimpleToast("Alterado");
                        }, function error() {
                            showSimpleToast("Houve um erro ao alterar");
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

        //Pega os avioes
        function getAll(){
            $http.get(apiBaseUrl).then(function (response) {
                $scope.offices = response.data;
            });
        }

        $scope.delete = function (item){
            console.debug(item.num_matricula);
            $http.delete(apiBaseUrl+'num_matricula/'+item.num_matricula)
                .success(function (response) {
                    $scope.offices = response;
                    showSimpleToast("Cargo removido");
                });
        };


        getAll();

    });
})();