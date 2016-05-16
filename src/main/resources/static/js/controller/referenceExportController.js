/*
 * Reference export controller
 */

angular
  .module('app.controllers')
  .controller('ReferenceExportController', referenceExportController);

function referenceExportController($scope, $mdDialog, init) {
  $scope.publications = init;

  $scope.close = function () {
    $mdDialog.cancel();
  }

};
