(function () {
    angular
        .module("WeatherApp")
        .controller("HomeController",HomeController);
    function HomeController($routeParams,$rootScope,UserService,$location){
        var vm=this;
        vm.currUser =$rootScope.currentUser;
        vm.searchWeather=searchWeather;
        vm.checkLogIn = checkLogIn;
        vm.showHistory = showHistory;
        vm.updateFields = updateFields;
        vm.logout = logout
        vm.placeError = false;
        vm.timeError = false;

        function init() {
            vm.searchHistory=[];
            vm.searchDate = moment().format('LLLL');
            vm.searchInput =""
            vm.toggleFlag =true
        }
        init();
        function searchWeather(place,time){
            vm.placeError = false;
            vm.timeError = false;
            if(!place){
                vm.error="Location is required";
                vm.placeError = true;
            }else if(!time){
                vm.error="Time is required";
                vm.timeError = true;
            }
            else {
                vm.error=""
                console.log(place)
                var lat = place.geometry.location.lat();
                var lng = place.geometry.location.lng();
                UserService
                    .findWeather(lat, lng, moment(time).unix())
                    .then(function (response) {
                            console.log(response.data)
                            vm.weatherData = response.data.offset
                            if(vm.currUser) {
                                UserService.addHistory(vm.currUser._id, lat, lng, moment(time).format('LLLL'),place.formatted_address)
                                    .then(
                                        function (response) {
                                            vm.success = "Added successfully";
                                            vm.toggleFlag=true
                                            showHistory();
                                        }
                                        , function (err) {
                                            vm.error = "Unable to save history";
                                        })
                            }
                        },
                        function (err) {
                            vm.error = "Please try after some time";
                        });
            }
        }


        function checkLogIn() {
            if(!vm.currUser){
                $location.url("/login");
            }
        }

        function showHistory() {
            vm.toggleFlag=!vm.toggleFlag
            if(vm.currUser){
                if(!vm.toggleFlag) {
                    vm.error = "";
                    $('#showHistory').text('Hide History');
                    UserService
                        .findHistory(vm.currUser._id).then(
                        function (response) {
                            vm.historyResultAddr = response.data[0].address;
                            vm.historyResultTime = response.data[0].timestamp;
                        }
                        , function (err) {
                            vm.error = "Unable to show history";
                        })
                }else{
                    $('#showHistory').text('Show History');
                }
            }
            else{
                vm.error = "You must be LoggedIn to see history"
                $('#showHistory').text('Show History');
            }

        }

        function updateFields(address,time) {
            vm.searchDate = moment(time).format('LLLL')
            vm.searchInput = address
        }

        function logout() {
            UserService.logout()
                .then(
                    function (response) {
                        $rootScope.currentUser = null;
                        $location.url("/login");
                    }
                    , function () {
                        $rootScope.currentUser = null;
                        $location.url("/login");
                    }
                )
        }


    }
})();
