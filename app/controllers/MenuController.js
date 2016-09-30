angular.module('Pelican')

.controller('MenuController', ['$scope', '$sce', '$rootScope', function ($scope, $sce, $rootScope) {
  $scope.init = function () {
    if (p.user) $scope.user = p.user;
    if (p.lists) $scope.lists = p.lists;
    if (p.owner) $scope.owner = p.owner;
    if (p.ownerLists) $scope.ownerLists = p.ownerLists;
  };

  $scope.makeActive = function (activeList, isFromOwner) {
    if (isFromOwner) {
      $scope.ownerLists = $scope.ownerLists.map(function (list) {
        list.displayPosts = false;
        return (list);
      })
    } else {
      if ($scope.owner && ($scope.owner.id !== $scoe.user._id)) return;
      if (window.location.href.indexOf('/discover') > -1) return;

      $scope.lists = $scope.lists.map(function (list) {
        list.displayPosts = false;
        return (list);
      })
    }

    activeList.displayPosts = true;
  };

  $scope.sanitizeHtml = function(text) {
    return $sce.trustAsHtml(text);
  };

  $scope.openPostMenu = function (post, postIndex, listIndex) {
    post.title = post.title.replace(/<\/?span[^>]*>/g,"");

    $rootScope.$emit('open post modal', {
      post: post,
      postIndex: postIndex,
      listIndex: listIndex
    })
  };

  $scope.openComposeModal = function (list) {
    var data = {
      user: $scope.user,
      lists: $scope.lists,
      focusId: '#create-list-name',
      preventEmit: true
    };

    $rootScope.$emit('open compose modal', data)
  };

  $rootScope.$on('post edited', function (e, editedPost) {
    $scope.lists[editedPost.listIndex].posts[editedPost.postIndex] = editedPost;
  });

  $rootScope.$on('new list created', function (e, newList) {
    if (newList.preventEmit) return;
    $scope.lists.push(newList);
  });

  $rootScope.$on('list name updated', function (e, editedList) {
    $scope.lists = $scope.lists.map(function (list) {
      if (list._id == editedList._id) list.title = editedList.title;
      return list;
    });
  });

  $rootScope.$on('list privacy toggled', function (e, udpatedList) {
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
    if (newPost.preventEmit) return;
    $scope.lists = $scope.lists.map(function (list) {
      if (list._id === newPost.parentList) list.posts.unshift(newPost);
      return list;
    });
  });
}]);
