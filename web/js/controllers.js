'use strict';

var dssApp = angular.module("dssApp", ['ngRoute']);

google.charts.setOnLoadCallback(function() {
    angular.bootstrap(document.body, ['myApp']);
});

google.charts.load('current', {packages: ['corechart', 'table', 'line']});


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
    $scope.event_name = cur_event;
    $http.get("http://localhost:7550/" + cur_app + "/" + cur_event).success(function (data, status, headers, config) {
        $scope.url_string = config.url;
        $scope.event_data_list = data;
        if (data[0]) {
            $scope.event_data_head = Object.keys(data[0]);
        }
    }).error(function () {});
});


dssApp.controller("eventsStatsCtrl", function ($scope, $http, $routeParams) {
    var cur_app = $routeParams.cur_app,
        cur_event = $routeParams.cur_event,
        cur_stat = $routeParams.cur_stat;
    $scope.app_name = cur_app;
    $scope.event_name = cur_event;
    $scope.stat_name = cur_stat;
    $http.get("http://localhost:7550/" + cur_app + "/" + cur_event + "/" + cur_stat).success(function (data, status, headers, config) {
        $scope.url_string = config.url;
        $scope.event_data_list = data;
        if (data[0]) {
            $scope.event_data_head = Object.keys(data[0]);
        }
    }).error(function () {});
});


dssApp.controller("eventsBoardCtrl", function ($scope, $http, $routeParams) {
    var cur_app = $routeParams.cur_app,
        cur_event = $routeParams.cur_event,
        cur_board = $routeParams.cur_board;
    $scope.app_name = cur_app;
    $scope.event_name = cur_event;
    $scope.board_name = cur_board;

    $http.get("http://localhost:7550/" + cur_app + "/" + cur_event + "/board/" + cur_board).success(function (data, status, headers, config) {
        $scope.url_string = config.url;
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
                    if ($score.type == "talbe") {
                        var data = new google.visualization.DataTable();
                        var keys = [];
                        for (var i in $scope.event_data_head) {
                            keys.push($scope.event_data_head[i]);
                            data.addColumn($scope.event_data_head[i] == "score" ? "number" : "string", $scope.event_data_head[i]);
                        }
                        var rows = [];
                        for (var i in $scope.event_data_list) {
                            var row = [];
                            for (var k in keys) {
                                var val = $scope.event_data_list[i][keys[k]];
                                if ($score.data.keys[k].type == "number") {
                                    val = parseInt(val);
                                } else {
                                    val = val.toString();
                                }
                                row.push(val);
                            }
                            rows.push(row);
                        }
                        data.addRows(rows);
                        var table = new google.visualization.Table($elm[0]);
                        table.draw(data, {showRowNumber: true, width: '70%', height: '100%'});
                    }

                    if ($score.type == "graph") {
                        var data = new google.visualization.DataTable();
                        var keys = [];
                        for (var i in $scope.event_data_head) {
                            keys.push($scope.event_data_head[i]);
                            data.addColumn($scope.event_data_head[i] == "score" ? "number" : "string", $scope.event_data_head[i]);
                        }
                        var rows = [];
                        for (var i in $scope.event_data_list) {
                            var row = [];
                            for (var k in keys) {
                                var val = $scope.event_data_list[i][keys[k]];
                                if ($score.data.keys[k].type == "number") {
                                    val = parseInt(val);
                                } else {
                                    val = val.toString();
                                }
                                row.push(val);
                            }
                            rows.push(row);
                        }
                        var options = {
                            chart: {
                                title: $score.event_name,
                            }
                            width: 70,
                            height: 100
                        }
                        data.addRows(rows);
                        var chart = new google.visualization.Table($elm[0]);
                        chart.draw(data, google.charts.Line.convertOptions(options));
                    }
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
        .when('/app/:cur_app/:cur_event/:cur_stat', {
            templateUrl: templatePath + 'stats_data.html',
            controller: 'eventsStatsCtrl'
        })
        .when('/app/:cur_app/board/:cur_board', {
            templateUrl: templatePath + 'board.html',
            controller: 'eventsBoardCtrl'
        })
         .when('/new', {
            templateUrl: templatePath + 'new.html',
            controller: 'newAppCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
});
