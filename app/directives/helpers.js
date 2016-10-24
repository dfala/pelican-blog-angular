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

.directive('openLink', ['trackingService', function (trackingService) {
  return {
    restrict: 'A',
    link: function (scope, elem, attr) {
      elem.bind('click', function (e) {
        if (attr.openLink) {
          var post = JSON.parse(attr.openLink);
          trackingService.trackConsumedPost(post);
          window.open(post.link, '_blank');
        }
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

.directive('identifyLocation', ['$timeout', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, elem, attr) {
      if (!attr.identifyLocation) return;
      if (window.location.href.indexOf(attr.identifyLocation) > -1) {
        elem.addClass('active');
        if (scope.list) {
          scope.list.displayPosts = true;
        }

        $timeout(function () {
          if (!attr.id) return;

          var listId    = '#' + attr.id.split('menu-')[1],
              listElem  = $(listId);

          if (!listElem.length) return;

          $('.list').removeClass('active-list');
          listElem.addClass('active-list');

          $('html, body').animate({
            scrollTop: listElem.offset().top - 60
          }, 500);
        })
      }
    }
  }
}])

.directive('menuHelper', ['$rootScope', function ($rootScope) {
  return {
    restrict: 'A',
    link: function (scope, elem, attr) {
      var listId = '#' + attr.id.split('menu-')[1];

      elem.bind('click', function (e) {
        var listElem = $(listId);
        if (!listElem.length) return (window.location.href = "/list/" + scope.list._id + '/' + scope.user._id);

        // TODO: when on discover page, need to prevent expanding
        // $rootScope.$emit('focus on list', {
        //   list: scope.list
        // });

        if (e.target.className.indexOf('post-title') > -1 || e.target.className.indexOf('post') > -1) return;

        $('.menu-list').removeClass('active');
        elem.addClass('active');

        $('.list').removeClass('active-list');
        listElem.addClass('active-list');

        $('html, body').animate({
          scrollTop: listElem.offset().top - 60
        }, 450);
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
        var container = $(element);

        if (scope.list && scope.closeListSettings) {
          if (scope.list.isOpenSettings && !container.is(e.target)) {
            scope.closeListSettings(scope.list)
            scope.$digest();
          };
        } else if (scope.toggleNotifications && scope.notificationsOpened) {
          if ($(e.target).hasClass('hn')) return;

          scope.notificationsOpened = false;
          scope.$digest();
        }

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

.directive('searchPost', [function () {
  return {
    restrict: 'A',
    link: function (scope, elem, attr) {
      elem.bind('click', function (e) {
        if (!scope.post || !scope.post._id) return;
        var url = window.location.origin + window.location.pathname + '?post=' + scope.post._id;
        window.history.pushState({ path: url} , '', url);
      });
    }
  }
}])

.directive('resetLocation', [function () {
  return {
    restrict: 'A',
    link: function (scope, elem, attr) {
      elem.bind('click', function (e) {
        var url = window.location.origin + window.location.pathname;
        window.history.pushState({ path: url }, '', url);
      });
    }
  }
}])

.directive('shouldOpenPost', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
  return {
    restrict: 'A',
    link: function (scope, elem, attr) {
      if (window.location.search && window.location.search.indexOf('?=post')) {
        var postId = window.location.search.slice(6, window.location.search.length);
        $timeout(function () {
          $rootScope.$emit('search for post', { postId: postId });
        })
      }
    }
  }
}])

.directive('resizable', [function () {
  return {
    restrict: 'A',
    link: function (scope, elem, attr) {
      var maxHeight = $('.menu').height() * 0.8;
      $('#small-menu').resizable({
        handles: 'n',
        maxHeight: maxHeight,
        minHeight: 250
      });
    }
  }
}])

.directive('adjustHeight', ['$timeout', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      $timeout(function () {

        function resizeTextArea(addedHeight) {
          var scroll = $(document).scrollTop();
          textarea.style.height = "2px",
          textarea.style.height = addedHeight + textarea.scrollHeight + "px",
          $(document).scrollTop(scroll)
        }

        var textarea = element[0];
        $(window).resize(resizeTextArea),
        element.bind("keydown", function(key) {
          13 === key.keyCode && resizeTextArea(20)
        }),

        element.bind("keyup", function(key) {
          8 === key.keyCode && resizeTextArea(2)
        }),

        scope.$watch(attrs.ngModel, function(newValue, oldValue) {
          if (void 0 !== newValue) {
              var lastChar = newValue.charAt(newValue - 1);
              " " !== lastChar && resizeTextArea(2)
          }
        })

      })
    }
  }
}])

.directive('toggleMenuDown', [function () {
  return {
    restrict: 'A',
    link: function (scope, elem, attr) {
      $(elem).click(function (e) {
        $('#small-menu').resizable('destroy');
        $("#small-menu").removeClass('fadeIn').addClass('toggled-down');
        $('#toggle-menu-down').addClass('hidden');
        $('#toggle-menu-up').removeClass('hidden');
      });
    }
  }
}])

.directive('toggleMenuUp', [function () {
  return {
    restrict: 'A',
    link: function (scope, elem, attr) {
      $(elem).click(function (e) {
        var maxHeight = $('.menu').height() * 0.8;
        $('#small-menu').resizable({
          handles: 'n',
          maxHeight: maxHeight,
          minHeight: 250
        });

        $("#small-menu").removeClass('toggled-down').addClass('fadeIn');
        $('#toggle-menu-down').removeClass('hidden');
        $('#toggle-menu-up').addClass('hidden');
      });
    }
  }
}])

.directive('mousewheel', ['$timeout', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, elem, attr) {
      $timeout(function () {
        $(function() {

          var toolbox = $('#side-menu');

          toolbox.bind('mousewheel', function(e, d) {
            var height = toolbox.height(),
                scrollHeight = toolbox.get(0).scrollHeight;

            if((this.scrollTop >= (scrollHeight - height - 100) && d < 0) || (this.scrollTop < 1 && d >= 0)) {
              e.preventDefault();
            }
          });
        });
      })
    }
  }
}]);
