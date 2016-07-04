export default class AuthorFormController {

  constructor($mdDialog, Authors, init, readonly) {
    this.$mdDialog = $mdDialog;
    this.Authors = Authors;
    this.author = angular.copy(init || {});
    this.readonly = readonly;
  }

  save() {
    if (!this.author.photo) {
      // Assign default photo if empty
      this.author.photo = '/photos/default.jpg';
    }
    this.Authors.save(this.author)
      .then(
        saved => {
          console.log(`Saved author: ${saved.fullname}`);
          this.$mdDialog.hide(saved);
        },
        err => console.log(`Error saving author: ${err}`)
      );
  }

  discard() {
    console.log('Discarding changes on author form');
    this.$mdDialog.cancel();
  }

}
