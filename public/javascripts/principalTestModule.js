(function () {
    'use strict';
    /*
     * Main AngularJS Web Application
     */

    /*global angular*/

    const moduleName="principalTestModule";
    const pluralViewKey="principalTests";
    const controllerName="principalTestController";
    const pKey="id_teste_principal";
    const apiBaseUrl = '/api/teste_principal/';

    angular.module(moduleName,['ngMaterial','ngMessages']);

    /**
     * TODO:Move controller to a separated file.
     */
    angular.module(moduleName).controller(controllerName, function ($scope, $http,$mdDialog) {


        $scope.currentManagedCard = undefined;

        $scope.showAdvanced = function(ev,edit) {
            //TODO : maybe filter the date.
            if(edit){
                //Transform to number FIXME: numbers should come as numbers from server.
                tryParseNtoN(edit);
                $scope.currentManagedCard = edit;
            } else {
                $scope.currentManagedCard = {};
                $scope.currentManagedCard[pKey] = getDateInIdForm();
                console.log($scope.currentManagedCard[pKey])
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
                let id= answer[pKey];
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
                    $http.put(apiBaseUrl+pKey+"/"+id, converted)
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
                $scope[pluralViewKey] = response.data;
                console.log($scope[pluralViewKey]);

                response.data.forEach((x)=>{
                    //getSpecificToScope('api/funcionario/single/nom_funcionario/num_matricula/'+x.id_funcionario,x.id_funcionario);
                    //getSpecificToScope('api/modelo_aviao/single/cod_modelo_aviao/id_modelo_aviao/'+x.id_modelo,x.id_modelo);
                });
            });
        }

        $scope.delete = function (registry){
            console.debug(registry);
            $http.delete(apiBaseUrl+pKey+'/'+registry[pKey])
                .success(function () {
                    getAll();
                    showSimpleToast("Removido.")
                });
        };

        getAll();

    });
})();