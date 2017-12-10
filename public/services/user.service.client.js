(function(){
    angular
        .module("WeatherApp")
        .factory("UserService", UserService);


    function UserService($http) {
        var api = {
            createUser: createUser,
            findUserByCredentials:findUserByCredentials,
            findUserById:findUserById,
            login:login,
            logout:logout,
            register: register
        };
        return api;

        function createUser(username, password) {
            var user = {
                username: username,
                password: password
            };
            return $http.post("/proj/user", user);
        }
        function findUserByCredentials(username, password) {
            var url = "/proj/user?username="+username+"&password="+password;
            return $http.get(url);

        }

        function findUserById(id) {
            var url = "/proj/user/" + id;
            return $http.get(url);
        }

        function login(username,password) {
            var user = {
                username: username,
                password: password
            };
            return $http.post("/proj/login", user);
        }
        function logout() {
            return $http.post("/proj/logout");
        }

        function register(username, password) {
            var user = {
                username: username,
                password: password
            };
            return $http.post("/proj/register", user);
        }
    }
})();