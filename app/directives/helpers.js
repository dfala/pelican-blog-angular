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

.directive('udpateUrl', [function () {
  return {
    restrict: 'A',
    link: function (scope, elem, attr) {
      elem.bind('click', function (e) {
        return console.log('Altering history disabled for now');
        if (!attr.udpateUrl) return;
        var url = window.location.origin + attr.udpateUrl;
        window.history.pushState({ path: url }, '', url);
      })
    }
  }
}])

.directive('identifyLocation', [function () {
  return {
    restrict: 'A',
    link: function (scope, elem, attr) {
      if (!attr.identifyLocation) return;
      if (window.location.href.indexOf(attr.identifyLocation) > -1) {
        elem.addClass('active');
        if (scope.list) {
          scope.list.displayPosts = true;
        }
      }
    }
  }
}])

.directive('menuHelper', [function () {
  return {
    restrict: 'A',
    link: function (scope, elem, attr) {
      var listId = '#' + attr.id.split('menu-')[1];
      if (window.location.href.indexOf('/discover') > -1) return;
      
      elem.bind('click', function (e) {
        if (e.target.className.indexOf('post-title') > -1 || e.target.className.indexOf('post') > -1) return;

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

.directive('focusId', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {

      $rootScope.$on('open compose modal', function (e, data) {
        $timeout(function () {
          if (!scope.lists || scope.lists.length < 1) return $('#create-list-name').focus();
          $(data.focusId).focus();
        });
      })
    }
  };
}])

.directive('looseFocus', ['$rootScope', function ($rootScope) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {

      $(document).mouseup(function(e) {
        // scope.closeListSettings(scope.list)
        // scope.$digest();

        var container = $(element);

        if (scope.list.isOpenSettings && !container.is(e.target)) {
          scope.closeListSettings(scope.list)
          scope.$digest();
        };
      });
    }
  }
}])

.directive('createList', [function () {
  return {
    restrict: 'A',
    link: function (scope, elem, attr) {
      $(elem).keyup(function(e) {
        if (e.keyCode == 13) {
          if (elem[0].id === 'search-list') {
            alertify.confirm(scope.query + ' list does not exist yet, do you want to create it now? It would be a public list.', function () {
              scope.addList({title: scope.query});
            });
          } else {
            scope.addList(scope.newList);
          }
        }
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
