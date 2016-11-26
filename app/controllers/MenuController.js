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
      if (window.location.href.indexOf('/trending') > -1) return;
      if (window.location.href.indexOf('/recent') > -1) return;

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
    if (editedPost.listIndex && editedPost.postIndex) return ($scope.lists[editedPost.listIndex].posts[editedPost.postIndex] = editedPost);

    for (var i = 0; i < $scope.lists.length; i++) {
      if ($scope.lists[i]._id === editedPost.parentList._id) {
        for (var p = 0; p < $scope.lists[i].posts.length; p++) {
          if ($scope.lists[i].posts[p]._id === editedPost._id) {
            $scope.lists[i].posts[p] = editedPost;
            return;
          }
        }
      }
    };

  });

  $rootScope.$on('new list created', function (e, newList) {
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
    if (postDeleted.parentList._id) {
      var parentListId = postDeleted.parentList._id;
    } else {
      var parentListId = postDeleted.parentList;
    }

    $scope.lists = $scope.lists.map(function (list) {
      if (list._id === parentListId) {
        list.posts = list.posts.filter(function (post) {
          if (post._id === postDeleted._id) return false;
          return true;
        });
      }
      return list;
    })
  });

  $rootScope.$on('new post created', function (e, newPost) {
    $scope.lists = $scope.lists.map(function (list) {
      if (list._id === newPost.parentList) list.posts.unshift(newPost);
      return list;
    });
  });
}]);
