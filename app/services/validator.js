angular.module('Pelican')

.factory('validator', [function () {
  var service = {};

  service.validateNewPost = function (activeList, post) {
    if (!activeList) throw 'Please choose a list before trying to save a new post.';
    if (!post || !post.title) throw 'Please add a name to your post';
  };

  service.verifyLink = function (link) {
    var isUrl = /^(?:(ftp|http|https)?:\/\/)?(?:[\w-]+\.)+([a-z]|[A-Z]|[0-9]){2,6}$/gi.test(link);
    if (!isUrl) throw 'Please enter a valid URL.';
    if (link.indexOf('http') < 1) link = 'http://' + link;
    return link;
  };

  return service;
}]);
