angular.module('Pelican')

.factory('trackingService', ['$http', function ($http) {
  var service = {};

  service.trackConsumedPost = function (post) {
    calq.action.track(
      "consumed post",
      { "postId": post._id }
    );

    if (post.isPrivate) return;
    $http.put('/api/post-vanity/' + post._id, post);
  };

  return service;
}]);
