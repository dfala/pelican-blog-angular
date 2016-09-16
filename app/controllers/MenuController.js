angular.module('Pelican')

.controller('MenuController', ['$scope', '$sce', '$rootScope', function ($scope, $sce, $rootScope) {
  $scope.init = function (user, lists) {
    $scope.user = user;
    $scope.lists = lists;
  };

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

  $rootScope.$on('post edited', function (e, editedPost) {
    $scope.lists[editedPost.listIndex].posts[editedPost.postIndex] = editedPost;
  });

  $rootScope.$on('new list created', function (e, newList) {
    $scope.lists.push(newList);
  });

  $rootScope.$on('list privacy toggled', function (e, udpatedList) {
    console.log(udpatedList);
    $scope.lists = $scope.lists.map(function (list) {
      if (list._id === udpatedList._id) return udpatedList;
      return list;
    })
  })

  $rootScope.$on('post deleted', function (e, postDeleted) {
    $scope.lists = $scope.lists.map(function (list) {
      if (list._id === postDeleted.parentList) {
        list.posts = list.posts.filter(function (post) {
          if (post._id === postDeleted._id) return false;
          return true;
        });
      }
      return list;
    })
  });

  $rootScope.$on('new post created', function (e, newPost) {
    // $scope.lists = $scope.lists.map(function (list) {
    //   if (list._id === newPost.parentList) list.posts.unshift(newPost);
    //   return list;
    // });
  });
}]);
