/*
 * Author Form controller
 */

angular
  .module('app.controllers')
  .controller('AuthorFormController', authorFormController);

function authorFormController($scope, $mdDialog, init, readonly) {
  $scope.readonly = readonly;
  $scope.initial = init || {};
  $scope.author = angular.copy($scope.initial);

  /*
   * Save and discard functions
   */
  $scope.save = function(author) {
    angular.copy($scope.author, $scope.initial);
    $mdDialog.hide($scope.initial);
  }
  $scope.discard = function() {
    $mdDialog.cancel();
  }

};
