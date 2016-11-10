var routerApp = angular.module('Pelican', ['ngSanitize','ui.router']);

routerApp.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
        .state('user', {
            url: '/user',
            templateUrl: './templates/user.html',
            controller: 'ListsController',
            resolve: {
              ownerLists: function (apiService) {
                // return apiService.get
              }
            }
        })

        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('about', {
            // we'll get to this in a bit
        });

});
