class ReferenceExportController {

  constructor($mdDialog, init) {
    this.$mdDialog = $mdDialog;
    this.publications = init;
  }

  close() {
    this.$mdDialog.cancel();
  }

}

ReferenceExportController.$inject = ['$mdDialog', 'init'];
export default ReferenceExportController;
