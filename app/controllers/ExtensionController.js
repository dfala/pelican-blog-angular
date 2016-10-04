angular.module('Pelican')

.controller('ExtensionController', ['$scope', 'apiService', 'validator', '$rootScope',
  function ($scope, apiService, validator, $rootScope) {

  //TODO: This needs refactoring -- just create one controller for compose.ejs

  //INIT
  $scope.init = function () {
    if (!p.user) return ($scope.loginMessage = true);
    if (p.user)   $scope.user   = p.user;
    if (p.lists)  $scope.modalLists  = p.lists;
    loadPostData();
  };

  $scope.hideX = true;

  $scope.activateList = function (list) {
    $scope.activeList = list;
  };

  $scope.addList = function (list) {
    if (!list.title) return alertify.error('Please add a list title to create one.');
    if (!list.isPrivate) list.isPrivate = false;

    apiService.addList(list.title, list.isPrivate)
    .then(function (response) {
      $scope.activateList(response.data);

      $scope.newList = null;
      $scope.modalLists.unshift(response.data);
    })
    .catch(function (err) {
      console.error(err);
      alertify.error('Could not save your new list :(')
    })
  };

  $scope.backToList = function () {
    $scope.activeList = null;
  };

  $scope.addPost = function (newPost) {
    try { validator.validateNewPost($scope.activeList, newPost) } catch (err) { return alertify.error(err); }
    if (newPost.link) {
      try {
        newPost.link = validator.verifyLink(newPost.link)
      } catch (err) {
        return alertify.error(err);
      }
    }

    apiService.addPost(newPost, $scope.activeList)
    .then(function (response) {
      $scope.successMessage = true;
      closeWindow();
    })
    .catch(function (err) {
      console.error(err);
      alertify.error('Could not save your post :(')
    })
  };

  function closeWindow () {
    setTimeout(function () {
      top.window.close();
    }, 400)
  };

  function cleanUrl () {
    var url = window.location.href;
    url = url.slice(url.indexOf('?='));
    url = url.slice(2, url.length);
    url = url.replace(/%2F/g, "/");

    return url;
  }

  function loadPostData () {
    var titleToAdd,
        urlToAdd;

    var urlParams = cleanUrl();
    var urlArr = urlParams.split('peli-title');

    if (urlArr && urlArr[0]) urlToAdd = urlArr[0];
    if (urlArr && urlArr[1]) titleToAdd = decodeURIComponent(urlArr[1]);

    if (!$scope.newPost) {
      $scope.newPost = {
        title: '',
        link: ''
      };
    }

    $scope.newPost.title = titleToAdd;
    $scope.newPost.link = urlToAdd;
  };

}]);
