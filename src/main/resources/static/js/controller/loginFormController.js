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
    console.log('Clicked attemp login');
    Auth.login($scope.credentials)
      .then(function(authenticated) {
        if (authenticated) {
          $mdDialog.hide();
        } else {
          $scope.credentials = {};
          $scope.error = true;
        }
      });
  }
  $scope.cancel = function() {
    console.log('Clicked cancel login');
    $mdDialog.cancel();
  }

};
