angular.module('woxuexiApp').service('restService', ['$http', function($http) {
		var extractWord = function(wordStruct) {
			var word = '';
			for(var index=0; index<wordStruct.chars.length; index++) {
				var char = wordStruct.chars[index].char;
				word += char?char:'';
			}
			return word;
		};
		this.getWords = function(searchParams, callback) {
			if(searchParams instanceof Function) {
				callback = searchParams;
				searchParams = '';
			}
			var query = [];
			for(param in searchParams) {
				query.push(param + '=' + searchParams[param]);
			}
			var uri = 'words/search?' + query.join('&');
			var getRequest = {
				method: 'GET',
				url: uri
			};
			$http(getRequest).
			success(function(data, status, header, config) {
				if(status === 200) {
					callback(data, null);
				} else {
					callback([], {msg: "Service unavailable"});
				}
			}).
			error(function(data, status, header, config) {
				console.log('The database does not contain any char \`' + searchParams + "'");
				callback([], {msg: "Service unavailable"});
			});
		};
		this.saveWord = function(wordStruct, callback) {
			var word = extractWord(wordStruct);
			var uri = 'words/' + word;
			var getRequest = {
				method: 'PUT',
				url: uri,
				data: wordStruct
			};
			$http(getRequest).
			success(function(data, status, header, config) {
				if(status === 200) {
					console.log('Character \`' + word + "' saved");
					callback(null);
				} else {
					callback({msg: 'Error during saving process'});
				}
			}).
			error(function(data, status, header, config) {
				console.log('Cannot save the character \`' + word + "'");
				callback({msg: 'Error during saving process'});
			});
		};
}]);
