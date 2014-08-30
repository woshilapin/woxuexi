var woxuexiApp = angular.module('woxuexiApp', []);

// When you have a callback function, pass it as an argument to this 'callback' function.
// It will check if it's a function before calling it.
var callback = function(next) {
	if(next instanceof Function) {
		next();
	}
}

woxuexiApp.controller('charsController', ['$scope', '$http', function($scope, $http) {
		var cv = undefined;
		$scope.updateCharList = function(next) {
			var uri = 'chars';
			var getRequest = {
				method: 'GET',
				url: uri
			};
			$http(getRequest).
			success(function(data, status, header, config) {
				if(status === 200) {
					$scope.chars = data;
				}
				callback(next);
			}).
			error(function(data, status, header, config) {
				console.log('The database does not contain any char \`' + $scope.search + "'");
				callback(next);
			});
		};
		$scope.updateCharList();
}]);
