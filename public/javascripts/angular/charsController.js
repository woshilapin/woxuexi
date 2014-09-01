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
		$scope.new = function() {
			$scope.char = {
				char: '',
				pinyin: '',
				accent: 0,
				translations: {}
			};
			$scope.editMode();
		};
		$scope.save = function(char, next) {
			var uri = 'chars/' + char.char;
			var getRequest = {
				method: 'PUT',
				url: uri,
				data: char
			};
			$http(getRequest).
			success(function(data, status, header, config) {
				if(status === 200) {
					console.log('Character \`' + char.char + "' saved");
				}
				callback(next);
			}).
			error(function(data, status, header, config) {
				console.log('Cannot save the character \`' + char.char + "'");
				callback(next);
			});
		};
		$scope.cancel = function(char, next) {
			var uri = 'chars/' + char.char;
			var getRequest = {
				method: 'GET',
				url: uri
			};
			$http(getRequest).
			success(function(data, status, header, config) {
				if(status === 200) {
					$scope.char = data;
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
woxuexiApp.filter('accentFilter', [function() {
		return function(text, char) {
			var accents = {
				' ': ['\u00B7', '¯', '´', 'ˇ', '`'],
				a: ['a', '\u0101', '\u00E1', '\u01CE', '\u00E0'],
				e: ['e', '\u0113', '\u00E9', '\u011B', '\u00E8'],
				i: ['i', '\u012B', '\u00ED', '\u01D0', '\u00EC'],
				o: ['o', '\u014D', '\u00F3', '\u01D2', '\u00F2'],
				u: ['u', '\u016B', '\u00FA', '\u01D4', '\u00F9'],
				ü: ['ü', '\u01D6', '\u01D8', '\u01DA', '\u01DC']
			};
			var out = '';
			if(char === undefined) {
				return accents[' '][text];
			} else if(char.match(/ |a|e|i|o|u|ü/) === null) {
				return accents[' '][text];
			} else {
				return accents[char][text];
			}
		};
}]);
woxuexiApp.filter('pinyinFilter', ['$filter', function($filter) {
		return function(text, accent) {
			if(text === undefined) {
				return '';
			}
			if(accent === undefined) {
				return text;
			}
			var out = '';
			var currentChar = '';
			var accentOn = false;
			for(var index=0; index<text.length; index++) {
				currentChar = text.charAt(index);
				if(currentChar.match(/a|e|i|o|u/) && accentOn === false) {
					out += $filter('accentFilter')(accent, currentChar);
					accentOn = true;
				} else {
					out += currentChar;
				}
			}
			return out;
		};
}]);
