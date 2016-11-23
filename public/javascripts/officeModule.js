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

                response.data.forEach((x)=>{
                    getSpecificToScope('api/funcionario/count/id_cargo/'+x.id_cargo,x.id_cargo+'counter');
                });
            });
        }

        $scope.delete = function (item,ev){
            console.debug(item.id_cargo);
            if($scope.requestedsArr[item.id_cargo+'counter'] != 0){
                var confirm = $mdDialog.confirm()
                    .title('Tem certeza?')
                    .textContent('Há funcionarios neste cargo, se deleta-lo todos eles irão pro limbo junto.')
                    .targetEvent(ev)
                    .ok('Manda pro limbo')
                    .cancel('Nah...');

                $mdDialog.show(confirm).then(function() {
                    showSimpleToast("Me recuso a fazer tamanha atrocidade.");
                });
            } else {
                $http.delete(apiBaseUrl + 'id_cargo/' + item.id_cargo)
                    .success(function (response) {
                        $scope.offices = response;
                        showSimpleToast("Cargo removido");
                    });
            }
        };


        getAll();

    });
})();