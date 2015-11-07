'use strict';

var dssApp = angular.module("dssApp", []);


dssApp.controller("DssCtrl", function($scope, $http) {

	$scope.cur_app_name = "";
	$scope.cur_event_name = "";
	$scope.cur_stat_name = "";

	$http.get("http://localhost:7550/").success(function(data, status, headers, config){
		$scope.app_list = data["response"];
	}).error(function(){
	});

	$scope.loadEvents = function(cur_app){
		$scope.cur_app = cur_app;
		$scope.stat_list = "";


		$http.get("http://localhost:7550/" + cur_app).success(function(data, status, headers, config){
			$scope.event_list = data["response"];
		}).error(function(){
		});
	};

	$scope.loadStats = function(cur_event){
		$scope.cur_event = cur_event;


		$http.get("http://localhost:7550/"+ $scope.cur_app + "/" + cur_event+'/stat').success(function(data, status, headers, config){
			$scope.stat_list = data["response"];
		}).error(function(){
		});
	};
});


