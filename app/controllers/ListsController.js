angular.module('Pelican')

.controller('ListsController', ['$scope', 'apiService', 'validator', '$rootScope', '$timeout', '$sce',
  function ($scope, apiService, validator, $rootScope, $timeout, $sce) {
  //INIT
  $scope.init = function () {
    if (p.user) $scope.user = p.user;
    if (p.owner) $scope.owner = p.owner;

    if (p.owner && p.ownerLists) {
      $scope.lists = p.ownerLists;
    } else if (p.lists) {
      $scope.lists = p.lists
    }

    // ENABLE WELCOME UI
    if (!p.lists || p.lists.length < 1) return $scope.deactivateWelcome = false;

    for (var i = 0; i < p.lists.length; i++) {
      if (p.lists[i].posts && p.lists[i].posts.length)
        return $scope.deactivateWelcome = true;
    };
  };


  $scope.toggleListLock = function (list) {
    var confirmMessage = 'You are about to make this lists private. Are you sure you want to proceed?';
    if (list.isPrivate) confirmMessage = 'You are about to make this list public. Are you sure you want to proceed?';

    alertify.confirm(confirmMessage, function () {
      apiService.toggleListPrivate(list)
      .then(function (response) {
        list.isPrivate = !list.isPrivate;
        $rootScope.$emit('list privacy toggled', list);

        if (response.data.isNowPrivate) alertify.success('Your list is now private');
        else alertify.success('Your list is now public');
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

  $scope.openComposeModal = function (list) {
    var data = {
      user: $scope.user,
      lists: $scope.lists,
      focusId: '#search-list',
      preventEmit: true
    };

    if (list) {
      data.preventEmit = true;
      data.activeList = list;
    }

    $rootScope.$emit('open compose modal', data)
  };

  $scope.openPost = function (post, postIndex, listIndex) {
    $rootScope.$emit('open post modal', {
      post: post,
      postIndex: postIndex,
      listIndex: listIndex
    })
  };

  // LIST SETTINGS
  $scope.openListSettings = function (list) {
    list.isOpenSettings = !list.isOpenSettings;
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

  $rootScope.$on('new post created', function (e, newPost) {
    if (newPost.preventEmit) return;

    if (!$scope.deactivateWelcome) $scope.deactivateWelcome = true;
    if (newPost.fromNewList) return;
    $scope.lists = $scope.lists.map(function (list) {
      if (list._id === newPost.parentList) list.posts.unshift(newPost);
      return list;
    });
  });

  $rootScope.$on('new list created', function (e, list) {
    // if (list.preventEmit) return;
    var isPresent = false;
    $scope.lists.forEach(function (l) {
      if (l._id === list._id) isPresent = true;
    })
    if (isPresent) return;
    $scope.lists.push(list);
  });

  $rootScope.$on('search for post', function (e, data) {

    var info = {};
    $scope.lists.forEach(function (list, listIndex) {
      list.posts.forEach(function(post, postIndex) {
        if (post._id === data.postId) {
          info.post = post;
          info.postIndex = postIndex;
          info.listIndex = listIndex;
        }
      })
    })

    if (!info.post) return;
    $scope.openPost(info.post, info.postIndex, info.listIndex);
  });

  $rootScope.$on('post edited', function (e, data) {
    $scope.lists[data.listIndex].posts[data.postIndex] = data;
  });

  $rootScope.$on('post deleted', function (e, postToDelete) {
    $scope.lists = $scope.lists.map(function (list) {
      if (list._id === postToDelete.parentList) {
        list.posts = list.posts.filter(function (post) {
          if (post._id == postToDelete._id) return false;
          return true;
        })
      }
      return list;
    })
  });

}]);
