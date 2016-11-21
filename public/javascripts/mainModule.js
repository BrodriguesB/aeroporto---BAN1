
(function () {
    'use strict';
    /*
     * Main AngularJS Web Application
     */

    /*global angular*/
    angular.module('MainApp',['ngRoute','ngMessages','ngMaterial','OfficeModule','EmployeeModule','PlanesModelsModule','UnionModule']);


    angular.module('MainApp').config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                    templateUrl: '/index',
                    controller: 'planesModelsController',
                //TODO: CHANGE THIS TO A PERSONAL QUERY PAGE
            })
            .when('/cargo', {
                templateUrl: '/cargo',
                controller: 'officeController',
            })
            .when('/funcionario', {
                templateUrl: '/funcionario',
                controller: 'employeeController',
            })
            .when('/sindicato', {
                templateUrl: '/sindicato',
                controller: 'unionController',
            })
            .when('/modelos', {
                templateUrl: '/modelos',
                controller: 'planesModelsController',
            })

    });
    /**
     * TODO:Move controller to a separated file.
     */
    angular.module('MainApp').controller('mainController', function ($scope, $http,$mdDialog,$mdToast) {
        $scope.currentPage = 'cargos';

        function showSimpleToast(message) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(message)
                    .position("bottom right")
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
                if($("form").hasClass("ng-invalid")){
                    return;
                }
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

        //FIXME: move to global scope.
        window.DialogController = DialogController;
        window.showSimpleToast = showSimpleToast;



    });
})();