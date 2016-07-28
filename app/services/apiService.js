angular.module('Pelican')

.factory('apiService', ['$http', function ($http) {
  var service = {};

  service.addList = function (listTitle) {
    return $http.post('/api/list', {title: listTitle});
  };

  service.addPost = function (post, activeList) {
    var data = post;
    data.parentList = activeList._id;

    console.warn(data);

    return $http.post('/api/post', data);
  };

  return service;
}]);
