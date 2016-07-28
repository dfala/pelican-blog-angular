angular.module('Pelican')

.controller('BannerController', ['$scope', 'apiService', function ($scope, apiService) {

  //INIT


  $scope.closeListModal = function () {
    $scope.isListModalOpen = false;
  };

  $scope.addList = function (listTitle) {
    if (!listTitle) return alertify.error('Please add a list title to create one.');
    
    apiService.addList(listTitle)
    .then(function (response) {
      alertify.success('New list created!')
      console.info(response);
    })
    .catch(function (err) {
      console.error(err);
      alertify.error('Could not save your new list :(')
    })
  };

}]);
