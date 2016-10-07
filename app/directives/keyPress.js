angular.module('Pelican')

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
}])

.directive('arrowNavigate', [function () {
  return {
    restrict: 'A',
    link: function (scope, elem, attr) {
      var activeNum = 0;
      $(elem).keydown(function(e) {
        var suggestions = $('#header-search').find('.suggestion');
        if (!suggestions || suggestions.length < 1) return;

        if (e.keyCode === 40) {
          // DOWN KEY
          if (activeNum > 0) suggestions.removeClass('active');
          $(suggestions[activeNum]).addClass('active');

          if (activeNum >= scope.suggestions.length - 1) return;
          activeNum++;
        } else if (e.keyCode === 38) {
          // UP KEY
          if (activeNum > 0) suggestions.removeClass('active');
          $(suggestions[activeNum - 1]).addClass('active');
          if (activeNum - 1 === 0) return;
          activeNum--;
        }
      });
    }
  }
}])

.directive('submitSearch', [function () {
  return {
    restrict: 'A',
    link: function (scope, elem, attr) {
      $(elem).keydown(function(e) {
        if (e.keyCode == 13) {
          var activeElem = $('.suggestion.active')[0];
          if (!activeElem) return;
          var activeSuggestionIndex = parseInt($('.suggestion.active')[0].id.replace('suggestion-', ''));
          scope.activateSuggestion(scope.suggestions[activeSuggestionIndex]);
        }
      });
    }
  }
}]);
