'use strict';

var dssApp = angular.module("dssApp", ['ngRoute']);

/*
dssApp.controller("DssCtrl", function ($scope, $http) {

    $scope.cur_app_name = "";
    $scope.cur_event_name = "";
    $scope.cur_stat_name = "";

    $http.get("http://localhost:7550/").success(function (data, status, headers, config) {
        $scope.app_list = data["response"];
    }).error(function () {});

    $scope.loadEvents = function (cur_app) {
        $scope.cur_app = cur_app;
        $scope.stat_list = "";


        $http.get("http://localhost:7550/" + cur_app).success(function (data, status, headers, config) {
            $scope.event_list = data["response"];
        }).error(function () {});
    };

    $scope.loadEventData = function (cur_event) {
        $scope.cur_event = cur_event;


        $http.get("http://localhost:7550/" + $scope.cur_app + "/" + cur_event).success(function (data, status, headers, config) {
            $scope.event_data_list = data;
            if (data[0]) {
                $scope.event_data_head = Object.keys(data[0]);
            }
            console.log(data);
        }).error(function () {});

    };

    $scope.loadStats = function (cur_event) {
        $scope.cur_event = cur_event;


        $http.get("http://localhost:7550/" + $scope.cur_app + "/" + cur_event + '/stat').success(function (data, status, headers, config) {
            $scope.stat_list = data["response"];
        }).error(function () {});
    };
});
*/
google.charts.setOnLoadCallback(function() {
    // angular.bootstrap(document.body, ['myApp']);
});
google.charts.load('current', {packages: ['table']});


dssApp.controller("applicationsCtrl", function ($scope, $http) {
    $http.get("http://localhost:7550/").success(function (data, status, headers, config) {
        $scope.app_list = data["response"];
    }).error(function () {});
});

dssApp.controller("eventsCtrl", function ($scope, $http, $routeParams) {
    var cur_app = $routeParams.cur_app;
    $scope.app_name = cur_app;
    $http.get("http://localhost:7550/" + cur_app).success(function (data, status, headers, config) {
        $scope.event_list = data["response"];
    }).error(function () {});
});


dssApp.controller("eventsDataCtrl", function ($scope, $http, $routeParams) {
    var cur_app = $routeParams.cur_app,
        cur_event = $routeParams.cur_event;
    $scope.app_name = cur_app;
    $http.get("http://localhost:7550/" + cur_app + "/" + cur_event).success(function (data, status, headers, config) {
        $scope.event_data_list = data;
        if (data[0]) {
            $scope.event_data_head = Object.keys(data[0]);
        }
    }).error(function () {});
});

dssApp.directive("chart", function() {
    return {
        link: function($scope, $elm, $attr) {
            var isLoaded = false;
            var interval = setInterval(function() {
                if (google.visualization) {
                    isLoaded = true;
                    clearInterval(interval);
                }
                if (isLoaded) {
                    console.log($scope);
                    var data = new google.visualization.DataTable();
                    var keys = [];
                    for (var i in $scope.event_data_head) {
                        keys.push($scope.event_data_head[i]);
                        data.addColumn("string", $scope.event_data_head[i]);
                    }
                    var rows = [];
                    for (var i in $scope.event_data_list) {
                        var row = [];
                        for (var k in keys) {
                            row.push($scope.event_data_list[i][keys[k]].toString());
                        }
                        rows.push(row);
                    }
                    data.addRows(rows);
                    var table = new google.visualization.Table($elm[0]);
                    table.draw(data, {showRowNumber: true, width: '100%', height: '100%'});
                }
            }, 300);
        }
    }
});



dssApp.controller("newAppCtrl", function ($scope, $http, $routeParams) {
    console.log("success");
});


dssApp.config(function ($routeProvider, $locationProvider) {
    var templatePath = "template/";
    $routeProvider
        .when('/', {
            templateUrl: templatePath + 'applications.html',
            controller: 'applicationsCtrl'
        })
        .when('/app/:cur_app', {
            templateUrl: templatePath + 'events.html',
            controller: 'eventsCtrl'
        })
        .when('/app/:cur_app/:cur_event', {
            templateUrl: templatePath + 'events_data.html',
            controller: 'eventsDataCtrl'
        })
         .when('/new', {
            templateUrl: templatePath + 'new.html',
            controller: 'newAppCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
});
