angular.module('Pelican')

.controller('BannerController', ['$scope', 'apiService', 'validator', '$rootScope',
  function ($scope, apiService, validator, $rootScope) {

  //INIT
  $scope.init = function (user, lists) {
    if (user)   $scope.user   = user;
    if (lists)  $scope.lists  = lists;
  };

  $scope.openComposeModal = function () {
    $rootScope.$emit('open compose modal', {
      user: $scope.user,
      lists: $scope.lists
    })
  };

}]);
