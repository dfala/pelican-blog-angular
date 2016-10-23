angular.module('Pelican')

.factory('apiService', ['$http', function ($http) {
  var service = {};

  service.addList = function (listTitle, isPrivate) {
    calq.action.track(
      "created list",
      { "userId": p.user._id }
    );

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

    calq.action.track(
      "created post",
      { "userId": p.user._id }
    );

    return $http.post('/api/post', data);
  };

  service.updatePost = function (post) {
    return $http.put('/api/post/' + post._id, post);
  };

  service.deletePost = function (post) {
    return $http.delete('/api/post/' + post.parentList + '/' + post._id);
  };

  service.lazyLoad = function (start) {
    return $http.get('/api/more-posts/' + start);
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

  service.likePost = function (post) {
    return $http.put('/api/like-post/' + post._id);
  };

  service.sendComment = function (newComment, user, post) {
    var data = {
      creator       : user._id,
      postOwner     : post.owner._id || post.owner,
      post          : post._id,
      message       : newComment
    }

    return $http.post('/api/comment', data);
  };

  service.getComments = function (postId) {
    return $http.get('/api/comments/' + postId);
  };

  service.getNotifications = function () {
    return $http.get('/api/notifications');
  };

  service.dismissNotification = function (nId) {
    return $http.put('/api/dismiss-notification/' + nId);
  };

  return service;
}]);
