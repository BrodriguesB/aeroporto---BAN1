//$(document).ready(function(){
//    return;
//
//    var data = {};
//    data.registro           = 3;
//    data.modelo             = 'Boeing 747-300';
//    data.max_passageiros   = 660;
//    data.max_carga          = 377842;
//    data.data_aquisicao     = '13/11/2010';
//    data.companhia           = 'GOL';
//
//
//});


(function () {
    'use strict';
    /*
     * Main AngularJS Web Application
     */

    /*global angular*/
    angular.module('AirportMainApp',['ngMaterial']);

    /**
     * TODO:Move controller to a separated file.
     */
    angular.module('AirportMainApp').controller('indexController', function ($scope, $http,$mdDialog) {

        $scope.currentManagedCard = undefined;

        $scope.editModel = {
            modelo:'',
            max_passageiros:'',
            max_carga:'',
            data_aquisicao:'',
            companhia:''
        };

        $scope.showAdvanced = function(ev) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'dialog1.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: false // Only for -xs, -sm breakpoints.
            }).then(function(answer) {
                let converted = angular.toJson(answer);

                if (!converted || converted.indexOf('undefined')==-1){
                    console.error("There were undefined data, all fields are required");
                    return;
                }

                $http.post('/api/avioes',converted)
                    .then(function(response){
                        $scope.planes = response.data;
                        console.info("Adicionado ",answer.modelo); //TODO:Call toaster.
                    });
            }, function() {
                console.log('You cancelled the dialog.');
            });
        };

        function DialogController($scope, $mdDialog) {
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
                    $scope.planes = response.data;
                    console.info("Removed plane.")
            });
        };


        getPlanes();



    });
})();