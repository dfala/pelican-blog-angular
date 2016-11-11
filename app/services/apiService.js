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
    calq.action.track(
      "post updated",
      { "postId": post._id }
    );
    return $http.put('/api/post/' + post._id, post);
  };

  service.deletePost = function (post) {
    calq.action.track(
      "deleted post",
      { "postId": post._id }
    );
    return $http.delete('/api/post/' + post.parentList + '/' + post._id);
  };

  service.lazyLoad = function (start) {
    calq.action.track(
      "lazy loading",
      { "loadAt": start }
    );
    return $http.get('/api/more-posts/' + start);
  };

  service.deleteList = function (list) {
    calq.action.track(
      "deleted list",
      { "listId": list._id }
    );
    return $http.delete('/api/list/' + list._id);
  };

  service.renameList = function (list) {
    calq.action.track(
      "renamed list",
      { "listId": list._id }
    );
    return $http.put('/api/list/rename/' + list._id, list);
  };

  service.toggleListPrivate = function (list) {
    calq.action.track(
      "toggled list private",
      {
        "listId": list._id,
        "newStatus": !list.isPrivate
      }
    );
    return $http.put('/api/list/privacy/' + list._id, {
      newStatus: !list.isPrivate
    });
  };

  service.getHeader = function (link) {
    calq.action.track(
      "requested page title",
      {
        "link": link,
        "userId": p.user._id
      }
    );
    return $http.post('/api/request/header', {
      uri: link
    });
  };

  service.globalSearch = function (query) {
    // METRICS TRACKED IN SEARCHSERVICE TO DOCUMENT RESULT COUNT
    query = encodeURIComponent(query);
    return $http.get('/api/global-search/' + query);
  };

  service.newUserCompleted = function () {
    try {
      calq.action.track(
        "onboard completed",
        { "userId": p.user._id }
      );
    } catch(err) { console.error(err) }

    return $http.put('/api/training/new-user-onboard');
  };

  service.likePost = function (post) {
    calq.action.track(
      "post liked",
      { "postId": post._id }
    );
    return $http.put('/api/like-post/' + post._id);
  };

  service.sendComment = function (newComment, user, post) {
    // Calq tracking in controller for comment created to record commentId

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
    calq.action.track(
      "notification dismissed",
      { "notificationId": nId }
    );
    return $http.put('/api/dismiss-notification/' + nId);
  };

  service.markNotificationsAsViewed = function (notifications) {
    calq.action.track(
      "opened notifications modal",
      { "userId": p.user._id }
    );
    return $http.put('/api/notifications/viewed', notifications);
  }

  return service;
}]);
