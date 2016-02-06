/*
 * Author Form controller
 */

angular
  .module('app.controllers')
  .controller('AuthorFormController', authorFormController);

function authorFormController($scope, $mdDialog, Authors, init, readonly) {
  $scope.readonly = readonly;
  $scope.initial = init || {};
  $scope.author = angular.copy($scope.initial);

  /*
   * Save and discard functions
   */
  $scope.save = function() {
    Authors.save($scope.author).then(function(saved) {
      console.log('Saved author: ' + saved.fullname);
      $mdDialog.hide(saved);
    }, function(err) {
      console.log('Error saving author');
    });
  }
  $scope.discard = function() {
    console.log('Discarding changes on publication form');
    $mdDialog.cancel();
  }

};
