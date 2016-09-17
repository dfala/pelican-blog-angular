angular.module('Pelican')
.directive('sendTo', [function () {
  return {
    restrict: 'A',
    link: function (scope, elem, attr) {
      elem.bind('click', function (e) {
        if (attr.sendTo) window.location = attr.sendTo;
      })
    }
  }
}])

.directive('menuHelper', [function () {
  return {
    restrict: 'A',
    link: function (scope, elem, attr) {
      var listId = '#' + attr.id.split('menu-')[1];

      elem.bind('click', function (e) {
        if (e.target.nodeName.toLowerCase() == "p" || e.target.className.indexOf('post') > -1) return;

        $('.menu-list').removeClass('active');
        elem.addClass('active');

        $('.list').removeClass('active-list');
        $(listId).addClass('active-list');

        $('html, body').animate({
          scrollTop: $(listId).offset().top - 60
        }, 500);
      });
    }
  }
}])

.directive('escapeSearch', [function () {
  return {
    restrict: 'A',
    link: function (scope, elem, attr) {
      $(document).keyup(function(e) {
        if (e.keyCode == 27) {
          scope.query = "";
          scope.$digest();
        }
      });
    }
  }
}]);
