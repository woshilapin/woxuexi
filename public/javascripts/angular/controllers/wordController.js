angular.module('woxuexiApp').controller('wordController', ['$scope', 'restService', function($scope, restService) {
	$scope.edit_index = undefined;
		$scope.new = function() {
			$scope.theword = {
				chars: [],
				translations: {}
			};
			$scope.add(0);
		};
		$scope.cancel = function(theword) {
			$scope.theword = angular.copy($scope.thewordoriginal);
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
		$scope.add = function(index) {
			$scope.theword.chars.splice(index, 0, {});
			$scope.edit_index = index;
		};
		$scope.delete = function(index) {
			$scope.theword.chars.splice(index, 1);
			if(index === $scope.theword.chars.length) {
				$scope.edit_index = index - 1;
			}
		};
		$scope.edit = function(index) {
			$scope.edit_index = index;
		};
		$scope.isEdit = function(index) {
			if($scope.edit_index === undefined) {
				return false;
			} else {
				if(index === undefined) {
					return true;
				} else if($scope.edit_index === index) {
					return true;
				} else {
					return false;
				}
			}
		};

}]);
