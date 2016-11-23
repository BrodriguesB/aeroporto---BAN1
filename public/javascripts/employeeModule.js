(function () {
    'use strict';
    /*
     * Main AngularJS Web Application
     */

    /*global angular*/
    angular.module('EmployeeModule',['ngMaterial','ngMessages']);

    /**
     * TODO:Move controller to a separated file.
     */
    angular.module('EmployeeModule').controller('employeeController', function ($scope, $http,$mdDialog) {

        const apiBaseUrl = '/api/funcionario/';
        $scope.currentManagedCard = undefined;

        $scope.showAdvanced = function(ev,edit) {
            //TODO : maybe filter the date.
            if(edit){
                tryParseNtoN(edit); //make numbers be numbers
                $scope.currentManagedCard = edit;
            } else {
                $scope.currentManagedCard = {
                    num_matricula: getDateInIdForm(),
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
                    item: $scope.currentManagedCard,
                    requestItems: [
                        ['api/sindicato','unions'],
                        ['api/cargo','offices']
                    ]
                },
            }).then(function(answer) {
                let id = answer.num_matricula;
                console.log(edit);
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
                    $http.put(apiBaseUrl+"num_matricula/"+id, converted)
                        .then(function success(response) {
                            $scope.employees = response.data;
                            showSimpleToast("Editado");
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


        //Pega os avioes
        function getAll(){
            $http.get(apiBaseUrl).then(function (response) {
                $scope.employees = response.data;

                response.data.forEach((x)=>{
                    getSpecificToScope('api/sindicato/single/den_sindicato/id_sindicato/'+x.id_sindicato,x.id_sindicato);
                });
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