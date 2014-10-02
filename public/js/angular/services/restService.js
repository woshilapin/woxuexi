angular.module('woxuexiApp')
.service('restService', [
  '$http',
  function($http) {
    var extractWord = function(wordStruct) {
      var word = '';
      for (var index = 0; index < wordStruct.chars.length; index++) {
        var char = wordStruct.chars[index].char;
        word += char ? char : '';
      }
      return word;
    };
    this.getWords = function(callback) {
      var uri = 'words';
      var getRequest = {
        method: 'GET',
        url: uri
      };
      $http(getRequest)
      .success(function(data, status, header, config) {
        console.log('List of words downloaded');
      })
      .error(function(data, status, header, config) {
        console.log('The database does not contain ' +
          'any char "' + searchParams + '"');
      })
      .then(callback);
    };
    this.searchWords = function(searchParams, callback) {
      if (searchParams instanceof Function) {
        callback = searchParams;
        searchParams = '';
      }
      var query = [];
      for (var param in searchParams) {
        query.push(param + '=' + searchParams[param]);
      }
      var uri = 'words/search?' + query.join('&');
      var getRequest = {
        method: 'GET',
        url: uri
      };
      $http(getRequest)
      .success(function(data, status, header, config) {
        console.log('List of words downloaded');
      })
      .error(function(data, status, header, config) {
        console.log('The database does not contain ' +
          'any char "' + searchParams + '"');
      })
      .then(callback);
    };
    this.saveWord = function(wordStruct, callback) {
      var word = extractWord(wordStruct);
      var uri = 'words/' + word;
      var getRequest = {
        method: 'PUT',
        url: uri,
        data: wordStruct
      };
      $http(getRequest)
      .success(function(data, status, header, config) {
        console.log('Character "' + word + '" saved');
      })
      .error(function(data, status, header, config) {
        console.log('Cannot save the character "' + word + '"');
      }).
      then(callback);
    };
    this.deleteWord = function(wordStruct, callback) {
      var word = extractWord(wordStruct);
      var uri = 'words/' + word;
      var getRequest = {
        method: 'DELETE',
        url: uri
      };
      $http(getRequest)
      .success(function(data, status, header, config) {
        console.log('Character "' + word + '" deleted');
      })
      .error(function(data, status, header, config) {
        console.log('Cannot delete the character "' + word + '"');
      })
      .then(callback);
    };
    this.updateWord = function(oldWordStruct, newWordStruct, callback) {
      var saveWord = this.saveWord;
      var deleteWord = this.deleteWord;
      saveWord(newWordStruct, function(response) {
        if (response.status === 201 &&
          oldWordStruct !== undefined &&
          extractWord(newWordStruct) !== extractWord(oldWordStruct)) {
          deleteWord(oldWordStruct, callback);
        } else {
          callback(response);
        }
      });
    };
  }]
);
