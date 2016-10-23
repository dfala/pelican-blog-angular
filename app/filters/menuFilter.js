angular.module('Pelican')

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

      var queryTitleListIndex = list.title.toLowerCase().indexOf(query);
      if (queryTitleListIndex > -1) {
        var temporalList = Object.assign({}, list);
        if (queryTitleListIndex == 0 && query.length == 1) {
          temporalList.title = '<span style="background-color:yellow; color: #000;">' + query + '</span>' + temporalList.title.slice(1, temporalList.title.length - 1);
        } else {
          temporalList.title = temporalList.title.toLowerCase().split(query);
          temporalList.title = temporalList.title[0] + '<span style="background-color:yellow; color: #000;">' + query + '</span>' + temporalList.title[temporalList.title.length-1];
        }
        return output.push(temporalList);
      }
      var tempList = Object.assign({}, list);
      tempList.posts = [];

      list.posts.forEach(function (post) {
        var tempPost = Object.assign({}, post);
        var queryTitlePostIndex = post.title.toLowerCase().indexOf(query);
        if (post.title && queryTitlePostIndex > -1) {
          if (queryTitlePostIndex == 0 && query.length == 1) {
            tempPost.title = '<span style="background-color:yellow; color: #000;">' + query + '</span>' + tempPost.title.slice(1, tempPost.title.length - 1);
          } else {
            tempPost.title = tempPost.title.toLowerCase().split(query);
            tempPost.title = tempPost.title[0] + '<span style="background-color:yellow; color: #000;">' + query + '</span>' + tempPost.title[tempPost.title.length - 1];
          }
          return tempList.posts.push(tempPost);
        }
        if (post.link && post.link.toLowerCase().indexOf(query) > -1) return tempList.posts.push(post);
        if (post.text && post.text.toLowerCase().indexOf(query) > -1) return tempList.posts.push(post);
      });

      if (tempList.posts.length > 0) return output.push(tempList);
    })

    args.output = output;
    return output;
  }
}]);
