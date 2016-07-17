class LoginFormController {

  constructor($mdDialog, Auth) {
    this.$mdDialog = $mdDialog;
    this.Auth = Auth;
    this.credentials = {};
    this.error = false;
  }

  login() {
    console.log('Clicked try login');
    this.Auth
      .login(this.credentials)
      .then(authenticated => {
        if (authenticated) {
          this.$mdDialog.hide();
        } else {
          this.credentials = {};
          this.error = true;
        }
      });
  }
  cancel() {
    console.log('Clicked cancel login');
    this.$mdDialog.cancel();
  }

}

LoginFormController.$inject = ['$mdDialog', 'Auth'];
export default LoginFormController;
