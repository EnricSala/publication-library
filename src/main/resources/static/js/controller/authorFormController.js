/*
 * Author Form controller
 */

angular
  .module('app.controllers')
  .controller('AuthorFormController', authorFormController);

function authorFormController($scope, $mdDialog, init) {
  $scope.author = init || {};
  $scope.initial = angular.copy($scope.author);

  /*
   * Save and discard functions
   */
  $scope.save = function(author) {
    $mdDialog.hide(author);
  }
  $scope.discard = function() {
    angular.copy($scope.initial, $scope.author);
    $mdDialog.cancel();
  }

};
