angular.module('Pelican')

.factory('apiService', ['$http', function ($http) {
  var service = {};

  service.addList = function (listTitle, isPrivate) {
    return $http.post('/api/list', {
      title: listTitle,
      isPrivate: isPrivate
    });
  };

  service.addPost = function (post, activeList) {
    var data = post;
    data.parentList = activeList._id;

    if (activeList.isPrivate) {
      data.isPrivate = true;
    } else {
      data.isPrivate = false;
    }

    return $http.post('/api/post', data);
  };

  service.updatePost = function (post) {
    return $http.put('/api/post/' + post._id, post);
  };

  service.deletePost = function (post) {
    return $http.delete('/api/post/' + post.parentList + '/' + post._id);
  };

  service.deleteList = function (list) {
    return $http.delete('/api/list/' + list._id);
  };

  service.renameList = function (list) {
    return $http.put('/api/list/rename/' + list._id, list);
  };

  service.toggleListPrivate = function (list) {
    return $http.put('/api/list/privacy/' + list._id, {
      newStatus: !list.isPrivate
    });
  };

  service.getHeader = function (link) {
    return $http.post('/api/site-header', {
      uri: link
    });
  };

  service.globalSearch = function (query) {
    query = encodeURIComponent(query);
    return $http.get('/api/global-search/' + query);
  };

  service.newUserCompleted = function () {
    return $http.put('/api/training/new-user-onboard');
  };

  return service;
}]);
