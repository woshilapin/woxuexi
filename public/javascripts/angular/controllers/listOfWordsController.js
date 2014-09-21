angular.module('woxuexiApp').controller('listOfWordsController', ['$scope', '$http', 'restService', function($scope, $http, restService) {
		$scope.listofwords = [];
		$scope.theword = {};
		$scope.init = function() {
			restService.getWords(function(response) {
				$scope.listofwords = response.data;
			});
		};
		$scope.search = function(search) {
			var searchParams = {};
			if(search !== undefined) {
				searchParams['pinyin']= search;
			}
			restService.searchWords(searchParams, function(response) {
				$scope.listofwords = response.data;
			});
		};
		$scope.save = function(word) {
			restService.saveWord(word, function(response) {
				console.log(response.statusText);
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
		$scope.init();
		$scope.viewMode();
}]);
