/*
 * Publisher Form controller
 */

angular
  .module('app.controllers')
  .controller('PublisherFormController', publisherFormController);

function publisherFormController($scope, $mdDialog, init, readonly) {
  $scope.readonly = readonly;
  $scope.initial = init || {};
  $scope.publisher = angular.copy($scope.initial);

  /*
   * Save and discard functions
   */
  $scope.save = function(publisher) {
    angular.copy($scope.publisher, $scope.initial);
    $mdDialog.hide($scope.initial);
  }
  $scope.discard = function() {
    $mdDialog.cancel();
  }

};
