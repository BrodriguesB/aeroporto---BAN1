(function () {
    'use strict';
    /*
     * Main AngularJS Web Application
     */

    /*global angular*/

    const moduleName="planeTestModule";
    const pluralViewKey = "planeTests";
    const controllerName="planeTestController";
    const pKey="id_teste_aviao";
    const apiBaseUrl = '/api/teste_aviao/';

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

                edit.dat_teste = new Date(edit.dat_teste);

                $scope.currentManagedCard = edit;
            } else {
                $scope.currentManagedCard = {};
                $scope.currentManagedCard[pKey] = getDateInIdForm();
                console.log(pKey, $scope.currentManagedCard[pKey])
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
                        ['api/aviao/', 'planes'],
                        ['api/modelo_aviao/', 'planesModels'],
                        ['api/teste_principal', 'principalTests'],
                        ['api/funcionario','employees']
                    ]
                },
            }).then(function(answer) {
                let id= answer[pKey];
                if(edit) {
                    answer = getDiff(answer, edit);
                    console.log('answer', answer);

                    console.log($scope);
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
            });
        };

        function getAll(){
            $http.get(apiBaseUrl).then(function (response) {
                tryParseNtoN(response.data);
                $scope[pluralViewKey] = response.data;
                console.log("pluralViewKey", $scope[pluralViewKey]);

                response.data.forEach((x)=>{
                    getSpecificToScope('api/funcionario/single/nom_funcionario/num_matricula/' + x.id_funcionario, x.id_funcionario);
                    getSpecificToScope('api/teste_principal/single/den_teste/id_teste_principal/' + x.id_teste_principal, x.id_teste_principal);
                    getSpecificToScope('api/teste_principal/single/val_pontuacao_maxima/id_teste_principal/' + x.id_teste_principal, x.id_teste_principal + 'maxPoint');
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