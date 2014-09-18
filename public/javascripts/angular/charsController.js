angular.module('woxuexiApp').controller('listwordsController', ['$scope', '$http', function($scope, $http) {
		$scope.updateWordList = function() {
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
			}).
			error(function(data, status, header, config) {
				console.log('The database does not contain any char \`' + $scope.search + "'");
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
		$scope.save = function(theword) {
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
			}).
			error(function(data, status, header, config) {
				console.log('Cannot save the character \`' + theword.word + "'");
			});
		};
		$scope.cancel = function(theword) {
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
			}).
			error(function(data, status, header, config) {
				console.log('The database does not contain any char \`' + $scope.search + "'");
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
