angular.module('woxuexiApp')
.controller('listOfWordsController', [
  '$scope',
  'restService',
  function($scope, restService) {
    $scope.read = function() {
      restService.getWords(function(response) {
        $scope.listofwords = response.data;
      });
    };
    $scope.search = function(search) {
      var searchParams = {};
      if (search !== undefined) {
        searchParams.pinyin = search;
      }
      restService.searchWords(searchParams, function(response) {
        $scope.listofwords = response.data;
      });
    };
    $scope.selectWord = function(word) {
      $scope.thewordoriginal = word;
      $scope.theword = angular.copy(word);
    };
    $scope.read();
  }]
);
