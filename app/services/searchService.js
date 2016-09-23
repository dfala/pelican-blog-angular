angular.module('Pelican')

.factory('searchService', ['$http', '$q', function ($http, $q) {
  var service = {};

  service.globalSearch = function (query) {
    query = encodeURIComponent(query);
    return $http.get('/api/global-search/' + query);
  };

  service.autoSuggestor = function (query) {
    var deferred = $q.defer();

    service.globalSearch(query)
    .then(function (response) {
      var suggestions = [];
      for (var key in response.data) {
        response.data[key].forEach(function (item) {
          if (item) {
            item.type = key;
            suggestions.unshift(item);
          }
        })
      };
      console.info(suggestions);
      deferred.resolve(suggestions);
    })
    .catch(function (err) {
      deferred.reject(err);
    });

    return deferred.promise;
  };

  return service;
}]);
