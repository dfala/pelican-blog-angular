angular.module('Pelican')

.directive('submitEnter', ['apiService', function (apiService) {
  return {
    restrict: 'A',
    link: function (scope, elem, attr) {
      $(elem).on('keydown', function (e) {
        if (e.keyCode == 13) {
          e.preventDefault();
          return scope.sendComment(scope.newComment);
        }
      });
    }
  }
}]);
