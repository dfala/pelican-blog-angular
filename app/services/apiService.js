angular.module('Pelican')

.factory('apiService', ['$http', function ($http) {
  var service = {};

  service.addList = function (listTitle) {
    return $http.post('/api/list', {title: listTitle});
  };

  service.addPost = function (post, activeList) {
    var data = post;
    data.parentList = activeList._id;

    return $http.post('/api/post', data);
  };

  service.updatePost = function (post) {
    return $http.put('/api/post/' + post._id, post);
  };

  service.toggleListPrivate = function (list) {
    return $http.put('/api/list/privacy/' + list._id, {
      newStatus: !list.isPrivate
    });
  };

  return service;
}]);
