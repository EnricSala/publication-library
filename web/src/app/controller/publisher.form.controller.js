class PublisherFormController {

  constructor($mdDialog, Publishers, init, readonly) {
    this.$mdDialog = $mdDialog;
    this.Publishers = Publishers;
    this.publisher = angular.copy(init || { authors: [] });
    this.readonly = readonly;
  }

  save() {
    this.Publishers.save(this.publisher)
      .then(
        saved => {
          console.log(`Saved publisher: ${saved.fullname}`);
          this.$mdDialog.hide(saved);
        },
        err => console.log(`Error saving publisher: ${err}`)
      );
  }

  discard() {
    console.log('Discarding changes on publisher form');
    this.$mdDialog.cancel();
  }

}

PublisherFormController.$inject = [
  '$mdDialog', 'Publishers', 'init', 'readonly'
];
export default PublisherFormController;
