angular.module('Pelican')

.controller('RenameListController', ['$scope', '$rootScope', 'apiService', function ($scope, $rootScope, apiService) {


  $scope.closeEditListModal = function () {
    // $scope.isEditListModalOpen = false;
    // $scope.activeList = null;
    $rootScope.$emit('close editListModal');
  };

  $scope.renameList = function (list) {
    apiService.renameList(list)
    .then(function (response) {
      alertify.success('Successfully renamed your list.');
      $rootScope.$emit('list name updated', list);

      $scope.closeEditListModal();
    })
    .catch(function (err) {
      console.error(err);
      alertify.error('There was a problem renaming your list.');
    });
  };
}]);
