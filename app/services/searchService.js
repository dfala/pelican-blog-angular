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
      calq.action.track(
        "global search",
        {
          "query": query,
          "resultCount": response.data.length
        }
      );

      var suggestions = [];
      for (var key in response.data) {
        response.data[key].forEach(function (item) {
          if (item) {
            var data = service.parseSearchData(item, key);
            suggestions.push(data);
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

    var data = { type: type, _id: item._id };

    // text, subInfo, image, link
    if (type === 'users') {
      data.image    = item.image;
      data.text     = item.displayName;
      data.email    = item.email;
    } else if (type === 'lists') {
      data.text     = item.title;
      data.owner    = item.owner;
    } else {
      data.text     = item.title;
      data.link     = item.link;
      data.subInfo  = item.text;
      data.owner    = item.owner;
    }

    return data;
  };

  return service;
}]);
