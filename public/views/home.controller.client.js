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
        vm.generateGraph = generateGraph;
        vm.showCurrentWeather = showCurrentWeather

        vm.generateGraphFlag = false;
        vm.placeError = false;
        vm.timeError = false;


        function init() {
            vm.searchHistory=[];
            vm.searchDate = moment().format('LLLL');
            vm.searchInput =""
            vm.toggleFlag =true
            vm.minTemp=[]
            vm.maxTemp=[]
            vm.options={}
            vm.data={}
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
                var unixTime = moment(time).unix()
                generateGraph(lat,lng,time)
                UserService
                    .findWeather(lat, lng,unixTime)
                    .then(function (response) {
                            console.log(response.data)

                            vm.data = [
                                {
                                    values: vm.maxTemp.sort(function(a,b) {return (a.x > b.x) ? 1 : ((b.x > a.x) ? -1 : 0);}),      //values - represents the array of {x,y} data points
                                    key: 'Max Temperature', //key  - the name of the series.
                                    color: '#ff7f0e'  //color - optional: choose your own line color.
                                },
                                {
                                    values: vm.minTemp.sort(function(a,b) {return (a.x > b.x) ? 1 : ((b.x > a.x) ? -1 : 0);}),
                                    key: 'Min Temperature',
                                    color: '#2ca02c'
                                }
                            ]
                            vm.generateGraphFlag=true;
                            showCurrentWeather(response.data)
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


        function showCurrentWeather(data) {

            var icons = new Skycons({"color": "Black"});
            switch(data.currently.icon){
                case 'clear-day':
                    icons.add("icon", Skycons.CLEAR_DAY);
                    break;
                case 'clear-night':
                    icons.add("icon", Skycons.CLEAR_NIGHT);
                    break;
                case 'partly-cloudy-day':
                    icons.add("icon", Skycons.PARTLY_CLOUDY_DAY);
                    break;
                case 'partly-cloudy-night':
                    icons.add("icon", Skycons.PARTLY_CLOUDY_NIGHT);
                    break;
                case 'cloudy':
                    icons.add("icon", Skycons.CLOUDY);
                    break;
                case 'rain':
                    icons.add("icon", Skycons.RAIN);
                    break;
                case 'sleet':
                    icons.add("icon", Skycons.SLEET);
                    break;
                case 'snow':
                    icons.add("icon", Skycons.SNOW);
                    break;
                case 'wind':
                    icons.add("icon", Skycons.WIND);
                    break;
                case 'fog':
                    icons.add("icon", Skycons.FOG);
                    break;

            }
            icons.play();
            vm.currentTemp = data.currently.temperature
            vm.summary = data.currently.summary
            vm.currentTime = moment.unix(data.currently.time).format('LLLL')

        }





        function generateGraph(lat,lng,time) {
            vm.minTemp=[]
            vm.maxTemp=[]
            for(i=1;i<=10    ;i++){
                var newTime = moment(time).subtract(i, 'years').unix()
                UserService
                    .findWeather(lat, lng,newTime)
                    .then(function (response) {
                            vm.maxTemp.push({x:moment.unix(response.data.currently.time).year(),y:response.data.daily.data[0].temperatureHigh})
                            vm.minTemp.push({x:moment.unix(response.data.currently.time).year(),y:response.data.daily.data[0].temperatureMin})
                        },
                        function (err) {
                            vm.error = "Please try after some time";
                        });

            }
        }




        vm.options = {
            chart: {
                type: 'lineChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                showValues: true,

                xAxis: {
                    axisLabel: 'Year',

                },
                yAxis: {
                    axisLabel: 'Temperature',

                },
            },
            title: {
                enable: true,
                text: 'Temperature for past 10  years on this day'
            },

        };





    }
})();
