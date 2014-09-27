angular.module('woxuexiApp').controller('listOfWordsController', ['$scope', '$http', 'restService', function($scope, $http, restService) {
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
		$scope.update = function(word) {
			restService.updateWord($scope.thewordoriginal, word, function(response) {
				console.log(response.statusText);
				angular.copy($scope.theword, $scope.thewordoriginal);
			});
		};
		$scope.delete = function(word) {
			restService.deleteWord(word, function(response) {
				console.log(response.statusText);
				delete $scope.thewordoriginal;
				$scope.theword = undefined;
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
		$scope.add = function(index) {
			$scope.theword.chars.splice(index, 0, {});
			$scope.edit.char = index;
		};
		$scope.delete = function(index) {
			$scope.theword.chars.splice(index, 1);
			if(index === $scope.theword.chars.length) {
				$scope.edit.char = index - 1;
			}
		};
		$scope.cancel = function(theword) {
			$scope.theword = angular.copy($scope.thewordoriginal);
		};
		$scope.selectWord = function(word) {
			$scope.thewordoriginal = word;
			$scope.theword = angular.copy(word);
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
