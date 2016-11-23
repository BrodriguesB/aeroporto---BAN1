(function () {
    'use strict';
    /*
     * Main AngularJS Web Application
     */

    /*global angular*/
    angular.module('SkillsModule',['ngMaterial','ngMessages']);

    /**
     * TODO:Move controller to a separated file.
     */
    angular.module('SkillsModule').controller('skillsController', function ($scope, $http,$mdDialog) {

        const apiBaseUrl = '/api/habilidades/';
        $scope.currentManagedCard = undefined;

        $scope.showAdvanced = function(ev,edit) {
            //TODO : maybe filter the date.
            if(edit){
                //Transform to number FIXME: numbers should come as numbers from server.
                tryParseNtoN(edit);
                $scope.currentManagedCard = edit;
            } else {
                $scope.currentManagedCard = {};
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
                        ['api/funcionario','employees']
                    ]
                },
            }).then(function(answer) {
                let id= answer.id_funcionario;
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
                    $http.put(apiBaseUrl+"id_funcionario/"+id, converted)
                        .then(function success(response) {
                            getAll();
                            showSimpleToast("Alterado"); //TODO:Call toaster.
                        }, function error() {
                            showSimpleToast("Houve um erro ao alterar");
                        });

                } else {
                    $http.post(apiBaseUrl, converted)
                        .then(function success(response) {
                            getAll();
                            showSimpleToast("Adicionado"); //TODO:Call toaster.
                        }, function error() {
                            showSimpleToast("Houve um erro ao adicionar");
                        });
                }
            }, function() {
                console.log('You cancelled the dialog.');
            });
        };

        function getAll(){
            $http.get(apiBaseUrl).then(function (response) {
                $scope.skills = response.data;
                console.log($scope.skills);

                response.data.forEach((x)=>{
                    getSpecificToScope('api/funcionario/single/nom_funcionario/num_matricula/'+x.id_funcionario,x.id_funcionario);
                    getSpecificToScope('api/modelo_aviao/single/cod_modelo_aviao/id_modelo_aviao/'+x.id_modelo,x.id_modelo);
                });
            });
        }

        $scope.delete = function (registry){
            console.debug(registry);
            $http.delete(apiBaseUrl+'id_funcionario/'+registry.id_funcionario)
                .success(function (response) {
                    getAll();
                    showSimpleToast("Removido.")
                });
        };

        $scope.customDelete = function (registry){
            console.debug(registry);


            $http({
                method: 'DELETE',
                url: apiBaseUrl+"customDelete",
                data: {
                    queryLastPart: `WHERE id_funcionario='${registry.id_funcionario}' AND id_modelo='${registry.id_modelo}'`
                },
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            }).success(function (response) {
                    getAll();
                    showSimpleToast("Removido.")
                }).error(function (response) {
                    showSimpleToast("Ocorreu um problema na remoção.")
                });
        };

        getAll();

    });
})();