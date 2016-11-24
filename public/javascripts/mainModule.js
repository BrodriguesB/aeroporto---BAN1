
(function () {
    'use strict';
    /*
     * Main AngularJS Web Application
     */

    /*global angular*/
    angular.module('MainApp', ['ngRoute', 'ngMessages', 'ngMaterial', 'OfficeModule', 'EmployeeModule', 'PlanesModelsModule', 'UnionModule', 'PlanesModule', 'SkillsModule', 'principalTestModule', 'planeTestModule']);


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
            .when('/avioes', {
                templateUrl: '/avioes',
                controller: 'planesController',
            })
            .when('/habilidades', {
                templateUrl: '/habilidades',
                controller: 'skillsController',
            })
            .when('/teste_principal', {
                templateUrl: '/teste_principal',
                controller: 'principalTestController',
            })
            .when('/teste_aviao', {
                templateUrl: '/teste_aviao',
                controller: 'planeTestController',
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
                    .position("top right")
                    .hideDelay(3000)
            );
        }


        function DialogController($scope, $mdDialog, item, requestItems) {
            tryParseNtoN(item);
            $scope.item = Object.assign({},item); //Prevent two way data bind.


            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.answer = function(answer) {
                if(!$scope.form.$valid){
                    //So, there's A FUCKING PROBLEM ON FUCKING MD-SELECT, WHERE IT DOESNT SET THE FUCKING MODEL VALUE(ng-options dont exist :D).
                    if($scope.form.$error.required){
                        $scope.form.$error.required.forEach((x)=>{
                            if(x.$viewValue==undefined){
                                return;
                            }
                        });
                    }
                }

                tryParseNtoN(answer);
                $mdDialog.hide(answer);
            };

            $scope.getFrom = function (url,keyForScope){
                $http.get(url).then(function (response) {
                    response.data.forEach((x)=> {
                        tryParseNtoN(x);
                    });
                    $scope[keyForScope] = response.data;
                    console.log(keyForScope);
                    console.log($scope[keyForScope]);
                });
            };

            //pre requests from selects
            if(requestItems){
                if(requestItems instanceof Array) {
                    requestItems.forEach((args) => {
                        $scope.getFrom.apply(this,args);
                    })
                }
            }


            $scope.searchValueForGiven = function (obj, value, key) {
                if (!obj || !key || !value) return;
                let found;
                obj.forEach((x)=> {
                    Object.keys(x).forEach((y)=> {
                        if (x[y] == value) {
                            found = x[key];
                        }
                    });
                });
                return found;

            }

        }


        //Dunno if it works..but should (not covering floats, im too lazy)
        function tryParseNtoN(obj){
            Object.keys(obj).map((x)=>{
                if (obj[x] instanceof Date) {
                    return obj[x];
                }
                try{
                    obj[x] = isNaN(Number(obj[x])) ? obj[x] :Number(obj[x]);
                } catch (e){
                }
                return obj[x];
            })
        }


        /**Comparisons on only one level deep, return the diffs on obj one.*/
        function getDiff(objOne,objTwo){
            let diff = {};
            Object.keys(objOne).map((x)=>{
                if(objOne[x]!=objTwo[x]){
                    diff[x] = objOne[x];
                }
            });
            return diff;
        }

        function getDateInIdForm() {
            return Number(String(+new Date).substr(2,13));
        }

        $scope.requestedsArr = {};
        /** Put a requested {Any} on the requestedsArrays named as the provided key.*/
        function getSpecificToScope(apiUrl,keyForRequestedsArr){
            console.log($scope.requestedsArr);

            if($scope.requestedsArr[keyForRequestedsArr]){
                //Only works after request is done.
                console.info("Already requested to scope from given key :",keyForRequestedsArr);
            }
             $http.get(apiUrl).then(function (response) {
                $scope.requestedsArr[keyForRequestedsArr] = response.data;

             });
        }

        //FIXME: move to global scope.
        window.getDiff = getDiff;
        window.getSpecificToScope = getSpecificToScope;
        window.getDateInIdForm = getDateInIdForm;
        window.DialogController = DialogController;
        window.showSimpleToast = showSimpleToast;
        window.tryParseNtoN = tryParseNtoN;



    });
})();