(function () {
    angular
        .module("WeatherApp")
        .controller("RegisterController",RegisterController);


    function RegisterController($routeParams,UserService,$location, $rootScope) {
        var vm =this;
        vm.register = register;

        function register(username,password,verifyPassword) {
            vm.userError = false;
            vm.passError = false;
            vm.verifyError = false;
            if(!username){
                vm.error="Username is required";
                vm.userError = true;
            }else if(!password){
                vm.error="Password is required";
                vm.passError = true;
            }
            else if(!verifyPassword){
                vm.error="Verify Password is required";
                vm.verifyError = true;
            }
            else {
                if (password === verifyPassword) {
                    UserService
                        .register(username, password)
                        .then(function (response) {
                                var user = response.data;
                                $rootScope.currentUser = user;
                                $location.url("/login");
                                /*
                                 if (user) {
                                 $location.url("/user");
                                 }*/
                            },
                            function (err) {
                                vm.error=err.data;
                            });
                }
                else {
                    vm.passError = true;
                    vm.verifyError = true;
                    vm.error = "Both typed passwords should match";
                }
            }
        }
    }




})();