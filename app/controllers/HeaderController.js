angular.module('Pelican')

.controller('HeaderController', ['$scope', '$rootScope', 'searchService', function ($scope, $rootScope, searchService) {
  $scope.search = function (query) {
    if (!query) return;
    searchService.globalSearch(query)
    .then(function (response) {
      console.warn(response.data);
      // DO CRAAAAZY STUFF HERE

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
}]);
