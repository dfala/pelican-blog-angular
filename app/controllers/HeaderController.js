angular.module('Pelican')

.controller('HeaderController', ['$scope', '$rootScope', 'searchService', 'apiService', function ($scope, $rootScope, searchService, apiService) {

  $scope.init = function () {
    if (!p.user) return;
    apiService.getNotifications()
    .then(function (response) {
      $scope.notifications = response.data;
      $scope.activeNotifications = getNotificationCount(response.data);
    })
    .catch(function (err) {
      console.error(err);
    })
  };

  function getNotificationCount (notifications) {
    var activeNotifications = 0;
    notifications.forEach(function (n) { if (!n.viewed) activeNotifications++; })
    return activeNotifications;
  };

  $scope.notificationAction = function (notification) {
    apiService.dismissNotification(notification._id);
    window.location = notification.action;
  };

  $scope.search = function (query) {
    if (!query) return;
    searchService.globalSearch(query)
    .then(function (response) {
      console.warn(response.data);
      // TODO: DO CRAAAAZY STUFF HERE
    })
    .catch(function (err) {
      console.error(err);
      alertify.error('There was an error with your search. Sorry!')
    })
  };

  $scope.$watch('query', function(newVal, oldVal) {
    if (!newVal && $scope.suggestions) return $scope.suggestions = [];
    if (!newVal || newVal.length < 3) return;

    searchService.autoSuggestor(newVal)
    .then(function (response) {
      $scope.suggestions = response;
    })
    .catch(function (err) {
      console.warn(err);
    });
  });

  $scope.activateSuggestion = function (item) {
    if (item.type === 'users') {
      window.location.href = '/user/' + item._id;
    } else if (item.type === 'lists') {
      window.location.href = '/list/' + item._id + '/' + item.owner;
    } else {
      window.location.href = '/user/' + item.owner + '?post=' + item._id;
    }
  };

  $scope.toggleNotifications = function () {
    $scope.notificationsOpened = !$scope.notificationsOpened;
    if ($scope.notificationsOpened) {
      apiService.markNotificationsAsViewed($scope.notifications)
      .then(function (response) {
        $scope.activeNotifications = 0;
      })
      .catch(function (err) {
        console.error(err);
      })
    }
  }
}]);
