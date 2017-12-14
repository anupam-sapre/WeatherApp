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
            register: register,
            findWeather: findWeather,
            addHistory: addHistory,
            findHistory:findHistory,
            fetchPlace:fetchPlace

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
        
        function findWeather(lat,long,time,current) {
            if (current){
                var url ='https://api.darksky.net/forecast/573bed4ceaabeb4e99f4846ec84b05ad/'+lat+','+long;
                return $http.get('https://cors-asapre.herokuapp.com/'+url);
            }else {
                var url = 'https://api.darksky.net/forecast/573bed4ceaabeb4e99f4846ec84b05ad/' + lat + ',' + long + ',' + time;
                return $http.get('https://cors-asapre.herokuapp.com/' + url);
            }
        }

        function addHistory(id,lat,long,time,placeid,address) {
            var history = {
                latitude: lat,
                longitude: long,
                timestamp: time,
                address:address,
                placeid:placeid
            };
            return $http.post("/proj/addHistory/"+id,history);

        }

        function findHistory(id) {
            return $http.get("/proj/searchHistory/"+id);
        }
        
        function fetchPlace(placeId) {
            var url = "https://maps.googleapis.com/maps/api/place/details/json?placeid="+ placeId +"&key=AIzaSyCQqTnznE0toeAVJKVzttPYAG29kMTIOUM";
            return $http.get('https://cors-asapre.herokuapp.com/'+url);
        }
    }
})();