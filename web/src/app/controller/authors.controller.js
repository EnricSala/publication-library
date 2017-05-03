import AuthorFormController from './author.form.controller.js';
import AuthorDialog from '../view/author.dialog.html';

class AuthorsController {

  constructor($mdDialog, Auth, Authors) {
    this.$mdDialog = $mdDialog;
    this.Auth = Auth;
    this.Authors = Authors;
    this.init();
  }

  init() {
    this.Authors.findAll()
      .then(list => this.authors = addSortAndShowName(list));

    function addSortAndShowName(authors) {
      return authors.map(it => {
        const fullname = it.fullname;
        const parts = fullname.split(' ').filter(it => it.length > 1);
        const sortIdx = parts.length < 4 ?
          Math.min(parts.length - 1, 1) : 2;
        it.sortname = parts.slice(sortIdx).join(' ');
        it.showname = parts.slice(sortIdx).join(' ') +
          ', ' + parts.slice(0, sortIdx).join(' ');
        return it;
      });
    }
  }

  showAuthorDialog(ev, author) {
    console.log('Open author dialog');
    this.handleResourceDialog(ev, author, AuthorFormController, AuthorDialog);
  }

  handleResourceDialog(ev, item, controller, template) {
    return this.$mdDialog.show({
      template: template,
      controller: controller,
      controllerAs: 'vm',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: false,
      fullscreen: true,
      locals: { init: item, readonly: !this.Auth.authenticated }
    });
  }

}

AuthorsController.$inject = ['$mdDialog', 'Auth', 'Authors'];
export default AuthorsController;
