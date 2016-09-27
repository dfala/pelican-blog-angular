angular.module('Pelican')

.controller('ListsController', ['$scope', 'apiService', 'validator', '$rootScope', '$timeout',
  function ($scope, apiService, validator, $rootScope, $timeout) {

  //INIT
  $scope.init = function (user, lists, owner, ownerList) {
    if (user) $scope.user = user;
    if (owner) $scope.owner = owner;

    if (owner && ownerList) {
      $scope.lists = ownerList;
    } else if (lists) {
      $scope.lists = lists
    }

    // ENABLE WELCOME UI
    if (!lists || lists.length < 1) return $scope.deactivateWelcome = false;

    for (var i = 0; i < lists.length; i++) {
      if (lists[i].posts && lists[i].posts.length)
        return $scope.deactivateWelcome = true;
    };
  };

  $scope.openPost = function (post, postIndex, listIndex) {
    $scope.activePost = post;
    $scope.activePost.postIndex = postIndex;
    $scope.activePost.listIndex = listIndex;
    $('body').css({
      'overflow': 'hidden',
      'marginRight': '15px'
    });

    console.warn(post);
  };

  $scope.closePostModal = function () {
    $scope.activePost = null;
    $scope.editingPost = false;
    $('body').css({
      'overflow': 'inherit',
      'marginRight': '0'
    });
  };

  $scope.toggleListLock = function (list) {
    var confirmMessage = 'You are about to make this lists private. Are you sure you want to proceed?';
    if (list.isPrivate) confirmMessage = 'You are about to make this list public. Are you sure you want to proceed?';

    alertify.confirm(confirmMessage, function () {
      apiService.toggleListPrivate(list)
      .then(function (response) {
        list.isPrivate = !list.isPrivate;
        $rootScope.$emit('list privacy toggled', list)
      })
      .catch(function (err) {
        console.error(err);
        alertify.error("There was a problem with changing your list settings.")
      })
    }, function() {
        // user clicked "cancel"
    });
  };

  $scope.deleteList = function (list, listIndex) {
    alertify.confirm("Are you sure you want to delete this list? This action cannot be undone.", function () {
      apiService.deleteList(list)
      .then(function (response) {
        alertify.success('Your list was successfully deleted.');
        $rootScope.$emit('list deleted', {
          list: list,
          listIndex: listIndex
        });
        $scope.lists.splice(listIndex, 1);
      })
      .catch(function (err) {
        console.error(err);
        alertify.error('There was an error deleting your list.');
      })
    });
  };

  // LIST SETTINGS
  $scope.openListSettings = function (list) {
    list.isOpenSettings = true;
  };

  $scope.closeListSettings = function (list, all) {
    if (list) return (list.isOpenSettings = false);
    $rootScope.$emit('close list settings');
  };

  $scope.openRenameListModal = function (list) {
    $scope.activeList = angular.copy(list);
    $scope.isEditListModalOpen = true;

    $timeout(function () {
      $('#edit-list-name-input').focus();
    });

    $scope.closeListSettings(null, true);
  };

  $rootScope.$on('close editListModal', function () {
    $scope.isEditListModalOpen = false;
    $scope.activeList = null;
  })

  $rootScope.$on('list name updated', function (e, editedList) {
    $scope.lists = $scope.lists.map(function (list) {
      if (list._id == editedList._id) list.title = editedList.title;
      return list;
    });
  });

  // EDIT POST
  $scope.turnOffEditPost = function () {
    $scope.editingPost = false;
  };

  $scope.turnOnEditPost = function (index) {
    if ($scope.editingPost) return $scope.turnOffEditPost();

    $scope.editablePost = angular.copy($scope.activePost);
    $scope.editablePostIndex = index;
    $scope.editingPost = true;
    $timeout(function () {
      $('#post-title-edit').focus();
    })
  };

  $scope.deletePost = function (postToDelete) {
    alertify.confirm("Are you sure you want to delete this post? This action cannot be undone.", function () {
      apiService.deletePost(postToDelete)
      .then(function (response) {
        $rootScope.$emit('post deleted', postToDelete);
        $scope.lists = $scope.lists.map(function (list) {
          if (list._id === postToDelete.parentList) {
            list.posts = list.posts.filter(function (post) {
              if (post._id == postToDelete._id) return false;
              return true;
            })
          }
          return list;
        })
        $scope.closePostModal();
        alertify.success('The post has been deleted.');
      })
      .catch(function (err) {
        console.error(err);
        alertify.error('There was a problem with deleting your post.');
      })
    });
  };

  $scope.updatePost = function (post) {
    try { validator.validateNewPost(true, post) } catch (err) { return alertify.error(err); }
    if (post.link) {
      try {
        post.link = validator.verifyLink(post.link)
      } catch (err) {
        return alertify.error(err);
      }
    }

    apiService.updatePost(post)
    .then(function (response) {
      $scope.activePost = response.data;
      $scope.editingPost = false;

      $rootScope.$emit('post edited', $scope.activePost);
      $scope.lists[$scope.activePost.listIndex].posts[$scope.activePost.postIndex] = response.data;
      alertify.success('Your changes were successfully saved.');
    })
    .catch(function (err) {
      console.error(err);
      alertify.error('Were not able to update post :(');
    })
  };

  $scope.openComposeModal = function (list) {
    var data = {
      user: $scope.user,
      lists: $scope.lists,
      focusId: '#search-list'
    };

    if (list) data.activeList = list;

    $rootScope.$emit('open compose modal', data)
  };

  $rootScope.$on('new post created', function (e, newPost) {
    if (!$scope.deactivateWelcome) $scope.deactivateWelcome = true;
    if (newPost.fromNewList) return;
    $scope.lists = $scope.lists.map(function (list) {
      if (list._id === newPost.parentList) list.posts.unshift(newPost);
      return list;
    });
  });

  $rootScope.$on('new list created', function (e, list) {
    $scope.lists.push(list);
  });

  $rootScope.$on('open post modal', function (e, data) {
    $scope.openPost(data.post, data.postIndex, data.listIndex);
  });

}]);
