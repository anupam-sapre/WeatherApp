(function() {
    angular
        .module("WeatherApp")
        .config(Config);
    function Config($routeProvider) {
        $routeProvider
            .when("/home", {
                templateUrl: "views/home.html",
                controller: "HomeController",
                controllerAs: "model"
            })
            .when("/login", {
                templateUrl: "views/login.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/register", {
                templateUrl: "views/register.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .otherwise({
                redirectTo: "/home"
            });

        function checkLoggedin($q, $timeout, $http, $location, $rootScope) {
            var deferred = $q.defer();
            $http.get('/proj/loggedin').success(function(user) {
                $rootScope.errorMessage = null;
                if (user !== '0') {
                    $rootScope.currentUser = user;
                    deferred.resolve();
                } else {
                    $rootScope.currentUser=null;
                    deferred.reject();
                    $location.url('/');
                }
            });
            return deferred.promise;
        }
    }
})();