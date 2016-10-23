angular.module('Pelican')

.filter('markdown', [function() {
  var converter = new Showdown.converter();
  return converter.makeHtml;
}])

.filter('moment', [function() {
  return function (input) {
    return moment(input).fromNow();
  };
}]);
