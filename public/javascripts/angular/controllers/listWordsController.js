angular.module('woxuexiApp').controller('listWordsController', ['$scope', '$http', 'restService', function($scope, $http, restService) {
		$scope.listwords = [];
		$scope.theword = {};
		$scope.update = function(search) {
			var searchParams = {
				pinyin: search
			};
			restService.getWords(searchParams, function(result, err) {
				if(err === null) {
					$scope.listwords = result;
				}
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
			var word = '';
			for(var index=0; index<theword.chars.length; index++) {
				var char = theword.chars[index].char;
				word += char?char:'';
			}
			var uri = 'words/' + word;
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
			var word = '';
			for(var index=0; index<theword.chars.length; index++) {
				var char = theword.chars[index].char;
				word += char?char:'';
			}
			var uri = 'words/' + word;
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
		restService.getWords(function(result, err) {
			if(err === null) {
				$scope.listwords = result;
			}
		});
		$scope.viewMode();
}]);
