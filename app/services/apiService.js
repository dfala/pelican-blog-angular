angular.module('Pelican')

.factory('apiService', ['$http', function ($http) {
  var service = {};

  service.addList = function (listTitle) {
    console.warn(listTitle);
    return $http.post('/api/list', {title: listTitle});
  };

  return service;
}]);
