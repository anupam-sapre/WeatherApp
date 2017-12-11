/**
 * Created by Anupam on 12/11/2017.
 */
(function () {
    angular
        .module("WeatherApp")
        .controller("WeatherController", WeatherController);
    function WeatherController($routeParams, $rootScope, $location) {
        var vm = this;
        vm.userId = $routeParams.userId;
        vm.logout = logout;
        vm.currUser = $rootScope.currentUser;
    }
})();