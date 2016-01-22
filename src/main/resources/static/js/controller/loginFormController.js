/*
 * Login Form controller
 */

angular
  .module('app.controllers')
  .controller('LoginFormController', loginFormController);

function loginFormController($scope, $mdDialog, Auth) {
  $scope.credentials = {};
  $scope.error = false;

  $scope.login = function() {
    Auth.login($scope.credentials, function(authenticated) {
      if (authenticated) {
        $mdDialog.hide();
      } else {
        $scope.credentials = {};
        $scope.error = true;
      }
    });
  }
  $scope.cancel = function() {
    $mdDialog.cancel();
  }

};
