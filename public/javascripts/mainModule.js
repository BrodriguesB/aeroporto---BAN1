
(function () {
    'use strict';
    /*
     * Main AngularJS Web Application
     */

    /*global angular*/
    angular.module('MainApp',['ngRoute','ngMessages','ngMaterial','OfficeModule','EmployeeModule','PlanesModelsModule','FlightsModule']);


    angular.module('MainApp').config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                    templateUrl: '/index',
                    controller: 'planesModelsController',
            })
            .when('/cargo', {
                templateUrl: '/cargo',
                controller: 'officeController',
            })
            .when('/funcionario', {
                templateUrl: '/funcionario',
                controller: 'employeeController',
            })
            .when('/voos', {
                templateUrl: '/voos',
                controller: 'flightsController',
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



        window.showSimpleToast = showSimpleToast;

    });
})();