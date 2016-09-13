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
        $('.menu-list').removeClass('active');
        elem.addClass('active');

        $('html, body').animate({
          scrollTop: $(listId).offset().top - 20
        }, 500);
      });
    }
  }
}])
