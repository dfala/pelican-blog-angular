angular.module('Pelican')

.controller('MenuController', ['$scope', '$sce', '$rootScope', function ($scope, $sce, $rootScope) {
  $scope.init = function (user, lists) {
    $scope.user = user;
    $scope.lists = lists;
  };

  $rootScope.$on('post edited', function (e, editedPost) {
    $scope.lists[editedPost.listIndex].posts[editedPost.postIndex] = editedPost;
  });

  $scope.makeActive = function (activeList) {
    $scope.lists = $scope.lists.map(function (list) {
      list.displayPosts = false;
      return (list);
    })
    activeList.displayPosts = true;
  };

  $scope.sanitizeHtml = function(text) {
    return $sce.trustAsHtml(text);
  };
}]);
