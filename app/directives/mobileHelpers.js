angular.module('Pelican')

.directive('openSideMenu', [function () {
  return {
    restrict: 'A',
    link: function (scope, elem, attr) {
      elem.bind('click', function (e) {
        var menu = $('#side-menu');
        menu.addClass('animated-fast slideInLeft');
        menu.css('display', 'inherit');

        setTimeout(function () {
          menu.removeClass('slideInLeft');
        }, 300);
      })
    }
  }
}])

.directive('closeSideMenu', [function () {
  return {
    restrict: 'A',
    link: function (scope, elem, attr) {
      if (windowWidth > 600) return;

      elem.bind('click', function (e) {
        var menu = $('#side-menu');
        menu.addClass('slideOutLeft');

        setTimeout(function () {
          menu.css('display', 'none');
          menu.removeClass('slideOutLeft');
        }, 300);
      })
    }
  }
}])

.directive('openHeaderSearch', [function () {
  return {
    restrict: 'A',
    link: function (scope, elem, attr) {
      elem.bind('click', function (e) {
        // switch mobile navitation buttons
        $('.mobile-header').css('display', 'none');
        $('.mobile-close').css('display', 'inherit');

        $('#notification-globe').css('display', 'none');

        // toggle search bar
        var search = $('#header-search');
        search.addClass('animated-fast slideInRight');
        search.css('display', 'inherit');

        setTimeout(function () {
          $('#header-search-input').focus();
          search.removeClass('slideInRight');
        }, 300);
      })
    }
  }
}])

.directive('closeHeaderSearch', [function () {
  return {
    restrict: 'A',
    link: function (scope, elem, attr) {
      elem.bind('click', function (e) {
        // switch mobile navitation buttons
        $('.mobile-close').css('display', 'none');

        var search = $('#header-search');
        search.addClass('slideOutRight');

        setTimeout(function () {
          search.css('display', 'none');
          $('.mobile-header').css('display', 'inherit');
          $('#notification-globe').css('display', 'inherit');

          search.removeClass('slideOutRight');
        }, 300);
      })
    }
  }
}]);
