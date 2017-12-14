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
            vm.currUser =$rootScope.currentUser;
            vm.searchHistory=[];
            vm.searchDate = moment().format('LLLL');
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
            if(!place || !place.geometry){
                vm.error="Valid Location is required";
                vm.placeError = true;
            }else if(!time){
                vm.error="Time is required";
                vm.timeError = true;
            }
            else {
                vm.error=""
                console.log(place)
                var lat;
                var lng;
                var currRequest=false;
                if(!isFunction(place.geometry.location.lat)){
                     lat = place.geometry.location.lat;
                     lng = place.geometry.location.lng;
                }else{
                     lat = place.geometry.location.lat();
                     lng = place.geometry.location.lng();
                }
                var unixTime = moment(time).unix()
                var curr = moment().unix()
                var diff = curr- unixTime
                if(diff< 180 && diff > 0){
                    currRequest=true
                }

                generateGraph(lat,lng,time)
                UserService
                    .findWeather(lat, lng,unixTime,currRequest)
                    .then(function (response) {
                            console.log(response.data)
                            vm.data = [
                                {
                                    values: vm.maxTemp,      //values - represents the array of {x,y} data points
                                    key: 'Max Temperature', //key  - the name of the series.
                                    color: '#ff7f0e'  //color - optional: choose your own line color.
                                },
                                {
                                    values: vm.minTemp,
                                    key: 'Min Temperature',
                                    color: '#2ca02c'
                                }
                            ]
                            vm.generateGraphFlag=true;
                            showCurrentWeather(response.data)
                            if(vm.currUser) {
                                UserService.addHistory(vm.currUser._id, lat, lng, moment(time).format('LLLL'),place.place_id,place.formatted_address)
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
                            vm.historyResultPlaceId = response.data[0].placeid;
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
            UserService.fetchPlace(address).then(
                function (response) {
                    vm.searchDate = moment(time).format('LLLL')
                    vm.searchInput= response.data.result
                },function (err) {
                    vm.searchDate = moment(time).format('LLLL')
                }
            )
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
            vm.hourWeather=[]
            vm.currentIcon = getSkycon(data.currently.icon)
            vm.currentTemp = data.currently.temperature
            vm.summary = data.currently.summary
            vm.currentTime = moment.unix(data.currently.time).format('LLLL')
            var icon,temp,summary,time;
            var count =6;
            for(i =0;i<24;i++){
                var dat = data.hourly.data[i]
                if(count>0 && dat.time > data.currently.time) {
                    icon = getSkycon(dat.icon)
                    temp = dat.temperature
                    summary = dat.summary
                    time = moment.unix(dat.time).format("LLLL")
                    vm.hourWeather.push({
                        icon: icon,
                        currentTemp: temp,
                        summary: summary,
                        currentTime: time
                    })
                    count--;
                }
            }

        }

        function generateGraph(lat,lng,time) {
            vm.minTemp=[]
            vm.maxTemp=[]
            for(i=1;i<=10    ;i++){
                var newTime = moment(time).subtract(i, 'years').unix()
                UserService
                    .findWeather(lat, lng,newTime,false)
                    .then(function (response) {
                            vm.maxTemp.push({x:moment.unix(response.data.currently.time).year(),y:response.data.daily.data[0].temperatureHigh})
                            vm.maxTemp.sort(function(a,b) {return (a.x > b.x) ? 1 : ((b.x > a.x) ? -1 : 0);})
                            vm.minTemp.push({x:moment.unix(response.data.currently.time).year(),y:response.data.daily.data[0].temperatureMin})
                            vm.minTemp.sort(function(a,b) {return (a.x > b.x) ? 1 : ((b.x > a.x) ? -1 : 0);})
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

        function isFunction(functionToCheck) {
            var getType = {};
            return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
        }

    }
})();
