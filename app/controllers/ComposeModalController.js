angular.module('Pelican')

.controller('ComposeModalController', ['$scope', '$rootScope', 'apiService', 'validator',
  function ($scope, $rootScope, apiService, validator) {

  $scope.isListModalOpen = false;
  $scope.modalLists = p.lists || [];
  var preventEmit = false;

  $rootScope.$on('open compose modal', function (e, data) {
    $scope.isListModalOpen = true;
    if (data.preventEmit) {
      preventEmit = true;
    } else {
      preventEmit = false;
    }
    if (data.activeList) $scope.activeList = data.activeList;
  });

  $rootScope.$on('repin post', function (e, newPost) {
    $scope.isListModalOpen = true;
    if (newPost) $scope.newPost = newPost;
  });

  $scope.closeListModal = function () {
    $scope.isListModalOpen = false;
    $scope.activeList = null;
    $scope.newList = null;
    $scope.newPost = {};
    $scope.query = "";
  };

  $scope.backToList = function () {
    $scope.activeList = null;
  };

  $scope.addList = function (list) {
    if (!list.title) return alertify.error('Please add a list title to create one.');
    if (!list.isPrivate) list.isPrivate = false;

    apiService.addList(list.title, list.isPrivate)
    .then(function (response) {
      alertify.success('New list created!')
      // $scope.activateList(response.data);
      response.data.fromNewList = true;
      response.data.preventEmit = preventEmit;
      $scope.activateList(response.data);
      $rootScope.$emit('new list created', response.data);
      $scope.newList = null;
    })
    .catch(function (err) {
      console.error(err);
      alertify.error('Could not save your new list :(')
    })
  };

  $scope.activateList = function (list) {
    $scope.activeList = list;
  };

  $scope.addPost = function (newPost) {
    try { validator.validateNewPost($scope.activeList, newPost) } catch (err) { return alertify.error(err); }
    if (newPost.link) {
      try {
        newPost.link = validator.verifyLink(newPost.link)
      } catch (err) {
        return alertify.confirm(newPost.link + " doesn't seem like a legit URL. Are you sure that's correct?", function () {
          createPost(newPost);
        }, function() {
          // user clicked "cancel"
        });
      }
    }

    createPost(newPost);
  };

  function createPost (newPost) {
    alertify.log('Saving your new post');
    apiService.addPost(newPost, $scope.activeList)
    .then(function (response) {
      response.data.owner = $scope.user;
      response.data.preventEmit = preventEmit;
      if ($scope.activeList.fromNewList) response.data.fromNewList = true;
      $rootScope.$emit('new post created', response.data);

      $scope.closeListModal();
      alertify.success('New post created!')
    })
    .catch(function (err) {
      console.error(err);
      alertify.error('Could not save your post :(')
    })
  };

  $scope.$watch('newPost.link', function(newVal, oldVal) {
    if (!newVal || $scope.newPost.title) return;
    try { var uri = validator.verifyLink(newVal) } catch (err) { return; }

    apiService.getHeader(uri)
    .then(function (response) {
      if (response.data) $scope.newPost.title = response.data;
    })
    .catch(function (err) {
      console.warn(err);
    });
  });

}]);
