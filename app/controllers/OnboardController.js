angular.module('Pelican')

.controller('OnboardController', ['$scope', '$rootScope', 'apiService', '$timeout', function ($scope, $rootScope, apiService, $timeout) {

  $scope.init = function () {
    $scope.active = 1;
  };

  $scope.next = function () {
    $scope.active = $scope.active + 1;
    if ($scope.active === 3 && !$scope.activatedClose) {
      $scope.activatedClose = true;
    }
  };

  $scope.previous = function () {
    $scope.active = $scope.active - 1;
  };

  $scope.goTo = function (numb) {
    $scope.active = numb;
  };

  $scope.close = function () {
    $scope.closed = true;
    apiService.newUserCompleted()
    .then(function (response) {
      // console.warn(response);
    })
    .catch(function (err) {
      console.error(err);
    })

    $timeout(function () {
      $('#new-user-onboard').remove();
    }, 100)
  };

  $scope.openBookMarkLink = function () {
    window.open('https://chrome.google.com/webstore/detail/pelican-blog/fifejldalccfblmcopgckhdjpjmlkgga', '_blank');

    $scope.close();
  }

}]);
