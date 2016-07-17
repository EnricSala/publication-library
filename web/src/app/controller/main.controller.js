import LoginFormController from './login.form.controller.js';
import LoginFormTemplate from '../view/login.dialog.html';

class MainController {

  constructor($location, $mdDialog, Auth) {
    this.$location = $location;
    this.$mdDialog = $mdDialog;
    this.Auth = Auth;
    this.Auth.login();
  }

  handleLogin(ev) {
    this.$mdDialog.show({
      template: LoginFormTemplate,
      controller: LoginFormController,
      controllerAs: 'form',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: false,
      fullscreen: false
    });
  };

  handleLogout(ev) {
    this.Auth.logout();
  }

  locationMatches(path) {
    return this.$location.path() === path;
  }

}

MainController.$inject = ['$location', '$mdDialog', 'Auth'];
export default MainController;
