// When you have a callback function, pass it as an argument to this 'callback' function.
// It will check if it's a function before calling it.
var callback = function(next) {
	if(next instanceof Function) {
		next();
	}
}

angular.module('woxuexiApp').controller('listwordsController', ['$scope', '$http', function($scope, $http) {
		$scope.updateWordList = function(next) {
			var uri = 'words';
			if($scope.search !== undefined && $scope.search !== '') {
				uri += '/search?pinyin=' + $scope.search;
			}
			var getRequest = {
				method: 'GET',
				url: uri
			};
			$http(getRequest).
			success(function(data, status, header, config) {
				if(status === 200) {
					console.log(data);
					$scope.listwords = data;
				}
				callback(next);
			}).
			error(function(data, status, header, config) {
				console.log('The database does not contain any char \`' + $scope.search + "'");
				callback(next);
			});
		};
		$scope.new = function() {
			$scope.theword = {
				char: '',
				pinyin: '',
				accent: 0,
				translations: {}
			};
			$scope.editMode();
		};
		$scope.save = function(theword, next) {
			var uri = 'words/' + theword.word;
			var getRequest = {
				method: 'PUT',
				url: uri,
				data: theword
			};
			$http(getRequest).
			success(function(data, status, header, config) {
				if(status === 200) {
					console.log('Character \`' + theword.word + "' saved");
				}
				callback(next);
			}).
			error(function(data, status, header, config) {
				console.log('Cannot save the character \`' + theword.word + "'");
				callback(next);
			});
		};
		$scope.cancel = function(theword, next) {
			var uri = 'words/' + theword.word;
			var getRequest = {
				method: 'GET',
				url: uri
			};
			$http(getRequest).
			success(function(data, status, header, config) {
				if(status === 200) {
					$scope.theword = data;
				}
				callback(next);
			}).
			error(function(data, status, header, config) {
				console.log('The database does not contain any char \`' + $scope.search + "'");
				callback(next);
			});
		};
		$scope.selectWord = function(word) {
			$scope.theword = word;
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
				char: undefined,
				pinyin: false,
				accent: false
			};
		};
		$scope.updateWordList();
		$scope.viewMode();
}]);
