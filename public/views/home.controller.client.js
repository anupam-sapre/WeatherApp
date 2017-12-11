(function () {
    angular
        .module("WeatherApp")
        .controller("HomeController",HomeController);
    function HomeController($routeParams,$rootScope,UserService,$location){
        var vm=this;
        vm.userId = $routeParams.userId;
        vm.currUser =$rootScope.currentUser;
        vm.searchWeather=searchWeather;

        function searchWeather(place){
            console.log(place)

            var lat = place.geometry.location.lat();
            var lng = place.geometry.location.lng();
            UserService
                .findWeather(lat, lng)
                .then(function (response) {
                        vm.weatherData = response.data
                        $location.url("/weather");

                    },
                    function (err) {
                        vm.error = "Please try after some time";
                    });
        }

    }
})();
