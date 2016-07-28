angular.module('Pelican')

.factory('validator', [function () {
  var service = {};

  service.validateNewPost = function (activeList, post) {
    if (!activeList) throw 'Please choose a list before trying to save a new post.';
    if (!post || !post.title) throw 'Please add a name to your post';
  };

  return service;
}]);
