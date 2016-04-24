/**
 * Main Controller
 */

angular
  .module('app.controllers')
  .controller('MainController', MainController);

function MainController($scope, $location, $mdDialog, Auth) {

  /*
   * Bind Auth service and check state
   */
  $scope.auth = Auth;
  Auth.login();

  /*
   * Show login dialog
   */
  $scope.handleLogin = function(ev) {
    $mdDialog.show({
      controller: 'LoginFormController',
      templateUrl: '/view/loginDialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: false,
      fullscreen: false
    });
  };

  /*
   * Handle logout
   */
  $scope.handleLogout = function(ev) {
    Auth.logout();
  }

  /*
   * Check if location matches
   */
  $scope.isLocation = function(path) {
    return $location.path() === path;
  }

};
