angular.module('Pelican')

.directive('lazyLoad', ['apiService', '$timeout', function (apiService, $timeout) {
  return {
    restrict: 'A',
    link: function (scope, elem, attr) {
      if (window.location.href.indexOf('/discover') < 0) return;

      scope.fetching = false;
      var end = false;
      window.onscroll = function(ev) {
        if (end) return;
        if ((window.innerHeight + window.scrollY) + 1000 >= document.body.offsetHeight) {
          if (scope.fetching || !scope.posts.length) return;

          scope.fetching = true;
          apiService.lazyLoad(scope.posts.length)
          .then(function (response) {
            if (response.data.length < 1) {
              end = true;
              scope.fetching = false;
            };

            scope.posts = scope.posts.concat(response.data);
            $timeout(function () {
              scope.fetching = false;
            }, 1000)
          })
          .catch(function (err) {
            console.error(err);
          })
        }
      };
    }
  }
}]);
