angular.module('Pelican')

.factory('validator', [function () {
  var service = {};

  service.validateNewPost = function (activeList, post) {
    if (!activeList) throw 'Please choose a list before trying to save a new post.';
    if (!post || !post.title) throw 'Please add a name to your post';
  };

  service.verifyLink = function (link) {
    if (link.indexOf('http') < 0) link = 'http://' + link;
    var re = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);
    var isUrl = link.match(re);
    if (!isUrl) throw 'Please enter a valid URL.';
    return link;
  };

  return service;
}]);
