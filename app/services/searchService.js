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
            var data = service.parseSearchData(item, key);
            suggestions.unshift(data);
          }
        })
      };
      deferred.resolve(suggestions);
    })
    .catch(function (err) {
      deferred.reject(err);
    });

    return deferred.promise;
  };

  service.parseSearchData = function (item, type) {
    if (!type) {
      console.error('Needs type');
      return {};
    }

    var data = { type: type, id: item._id };

    // text, subInfo, image, link
    if (type === 'users') {
      data.image    = item.image;
      data.text     = item.displayName;
      data.email    = item.email;
    } else if (type === 'lists') {
      data.text     = item.title;
    } else {
      data.text     = item.title;
      data.link     = item.link;
      data.subInfo  = item.text;
    }

    return data;
  };

  return service;
}]);
