/*
 * Publisher Form controller
 */

angular
  .module('app.controllers')
  .controller('PublisherFormController', publisherFormController);

function publisherFormController($scope, $mdDialog, init, readonly) {
  $scope.readonly = readonly;
  $scope.publisher = init || {};
  $scope.initial = angular.copy($scope.publisher);

  /*
   * Save and discard functions
   */
  $scope.save = function(publisher) {
    $mdDialog.hide(publisher);
  }
  $scope.discard = function() {
    angular.copy($scope.initial, $scope.publisher);
    $mdDialog.cancel();
  }

};
