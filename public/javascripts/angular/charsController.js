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
			if($scope.search !== undefined && $scope.search !== '') {
				uri += '/search?latin=' + $scope.search;
			}
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
		$scope.selectChar = function(char) {
			$scope.char = char;
			$scope.viewMode();
		}
		$scope.editMode = function() {
			$scope.edit = {
				char: true,
				pinyin: true,
				accent: true
			};
		};
		$scope.viewMode = function() {
			$scope.edit = {
				char: false,
				pinyin: false,
				accent: false
			};
		};
		$scope.updateCharList();
		$scope.viewMode();
}]);
woxuexiApp.filter('myAccent', [function() {
	return function(text, char) {
		var out = '';
		if(char !== undefined) {
			out += char;
		} else {
			out += '\u25CC';
		}
		switch(text) {
		case 1:
			out += '\u0304';
			break;
		case 2:
			out += '\u0301';
			break;
		case 3:
			out += '\u030C';
			break;
		case 4:
			out += '\u0300';
			break;
		case 5:
			out += '';
			break;
		}
		return out;
	};
}]);
