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


.filter('menuSearch', [function () {

  // THIS IS THE HACKIEST THING I HAVE EVER DONE

  var args = {
    input: [],
    query: "",
    output: [],
    count: 0
  };

  return function (input, query) {
    if (!query) return input;

    // THIS PREVENTS AN INFINITE DIGEST LOOP
    if (args.input == input && args.query == query) {
      if (args.count == 0) {
        args.count++;
      } else {
        return args.output || input;
      }
    }

    args.input = input;
    args.query = query;

    //////////////////////////////////////////

    query = query.toLowerCase();

    var output = [];

    input.forEach(function (list) {

      if (list.title.toLowerCase().indexOf(query) > -1) return output.push(list);
      var tempList = Object.assign({}, list);
      tempList.posts = [];

      list.posts.forEach(function (post) {
        if (post.title && post.title.toLowerCase().indexOf(query) > -1) return tempList.posts.push(post);
        if (post.link && post.link.toLowerCase().indexOf(query) > -1) return tempList.posts.push(post);
        if (post.text && post.text.toLowerCase().indexOf(query) > -1) return tempList.posts.push(post);
      });

      if (tempList.posts.length > 0) return output.push(tempList);
    })

    args.output = output;
    return output;
  }
}]);
