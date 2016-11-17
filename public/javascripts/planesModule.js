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
    angular.module('AirportMainApp',[]);

    /**
     * TODO:Move controller to a separated file.
     */
    angular.module('AirportMainApp').controller('indexController', function ($scope, $http) {

        //Pega os avioes
        function getPlanes(){
            $http.get('/api/avioes').then(function (response) {
                $scope.planes = response.data;
            });
        }

        $scope.deletePlane = function (plane){
            console.debug(plane.registro);
            $.ajax({
                url: '/api/avioes/'+plane.registro,
                type: 'DELETE',
                success: function (result) {
                    getPlanes();
                    console.info("Removed plane.")
                }
            });
        };


        $('#add').click(function(){
            var form = $('#planeForm');

            if(form.parsley().isValid()) {
                $.post('/api/avioes', form.serialize())
                    .done(function () {
                        getPlanes();
                        form.trigger("reset")
                    })
                    .fail(function(){
                        console.error.apply(this,arguments);
                    });

            } else{
                alert("Todos os campos devem ser preenchidos.");
            }
        });

        getPlanes();



    });
})();