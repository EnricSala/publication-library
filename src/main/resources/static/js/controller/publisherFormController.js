/*
 * Publisher Form controller
 */

angular
  .module('app.controllers')
  .controller('PublisherFormController', publisherFormController);

function publisherFormController($scope, $mdDialog, Publishers, init, readonly) {
  $scope.readonly = readonly;
  $scope.initial = init || {};
  $scope.publisher = angular.copy($scope.initial);

  /*
   * Save and discard functions
   */
  $scope.save = function () {
    Publishers.save($scope.publisher).then(function (saved) {
      console.log('Saved publisher: ' + saved.fullname);
      $mdDialog.hide(saved);
    }, function (err) {
      console.log('Error saving publisher');
    });
  }
  $scope.discard = function () {
    console.log('Discarding changes on publisher form');
    $mdDialog.cancel();
  }

};
