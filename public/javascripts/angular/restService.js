angular.module('woxuexiApp').service('restService', ['$http', function($http) {
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
}]);
