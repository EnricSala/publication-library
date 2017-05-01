import PublicationFormController from './publication.form.controller.js';
import PublicationDialog from '../view/publication.dialog.html';

import AuthorFormController from './author.form.controller.js';
import AuthorDialog from '../view/author.dialog.html';

import PublisherFormController from './publisher.form.controller.js';
import PublisherDialog from '../view/publisher.dialog.html';

import ReferenceExportController from './reference.export.controller.js';
import ReferenceExportDialog from '../view/reference.export.dialog.html';

import filesaver from 'file-saver';

class PublicationsController {

  constructor($mdDialog, Auth, Publications, Authors, Publishers) {
    this.$mdDialog = $mdDialog;
    this.Auth = Auth;
    this.Publications = Publications;
    this.Authors = Authors;
    this.Publishers = Publishers;
    this.init();
  }

  init() {
    // Configure defaults
    this.publicationTypes = ['All', 'Journal', 'Conference', 'Book'];
    this.query = {
      text: '',
      author: '',
      type: this.publicationTypes[0],
      after: 1990,
      before: new Date().getFullYear(),
      page: 0,
      size: 10
    };
    this.authorFilter = '';
    this.isMenuOpen = false;
    this.metadata = {};

    // Load initial data
    this.Publications.findAll()
      .then(data => {
        this.authors = data.authors;
        this.publishers = data.publishers;
        this.publications = data.publications;
        this.metadata = data.publications.$metadata;
      });

    // Configure the year slider
    this.yearSliderConfig = {
      floor: this.query.after,
      ceil: this.query.before,
      draggableRange: true,
      keyboardSupport: false,
      hideLimitLabels: true,
      onEnd: () => this.doNewSearch()
    };

    //  Configure FAV buttons
    this.menuItems = [{
      name: "New Publication",
      icon: "/img/icon/publication-plus.svg",
      visible: () => this.Auth.authenticated,
      onClick: ev => this.showPublicationDialog(ev)
    }, {
      name: "New Author",
      icon: "/img/icon/author-plus.svg",
      visible: () => this.Auth.authenticated,
      onClick: ev => this.showAuthorDialog(ev)
    }, {
      name: "New Publisher",
      icon: "/img/icon/folder-plus.svg",
      visible: () => this.Auth.authenticated,
      onClick: ev => this.showPublisherDialog(ev)
    }, {
      name: "Export References",
      icon: "/img/icon/file-export.svg",
      visible: () => true,
      onClick: ev => this.downloadReferences(ev)
    }, {
      name: "Download Backup",
      icon: "/img/icon/download.svg",
      visible: () => this.Auth.authenticated,
      onClick: ev => this.downloadBackup(ev)
    }];
  }

  /*
   * Toggle filter by a specific author
   */
  selectAuthor(author) {
    this.authorFilter = '';
    this.query.author = this.query.author === author.id ? '' : author.id;
    this.doNewSearch();
  }

  /*
   * Generate secondary authors string
   */
  getSecondaryAuthors(authors) {
    const shortenName = (name) => {
      let parts = name.split(' ');
      const last = parts.pop();
      parts = parts.map(part => part.charAt(0));
      parts.push(last);
      return parts.join('. ');
    }
    const items = authors || [];
    const secondaries = items.slice(1, items.length);
    return secondaries
      .map(author => shortenName(author.fullname))
      .join(', ');
  }

  /*
   * Launch searches
   */
  doNewSearch() {
    this.query.page = 0;
    this.searchPublications();
  }

  searchPublications() {
    this.publications = [];
    this.metadata = {};
    this.Publications.search(this.query)
      .then(publications => {
        this.publications = publications;
        this.metadata = publications.$metadata;
      });
  }

  /*
   * Handle resource dialogs
   */
  showPublicationDialog(ev, publication) {
    console.log('Open publication dialog');
    this.handleResourceDialog(ev, publication, PublicationFormController, PublicationDialog)
      .then(saved => this.searchPublications());
  }

  showAuthorDialog(ev, author) {
    console.log('Open author dialog');
    this.handleResourceDialog(ev, author, AuthorFormController, AuthorDialog)
      .then(saved => this.Authors.findAll())
      .then(data => {
        this.authors = data;
        this.searchPublications();
      });
  }

  showPublisherDialog(ev, publisher) {
    console.log('Open publisher dialog');
    this.handleResourceDialog(ev, publisher, PublisherFormController, PublisherDialog)
      .then(saved => this.Publishers.findAll())
      .then(data => {
        this.publishers = data;
        this.searchPublications();
      });
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

  /*
   * Handle publication menu actions
   */
  openPublicationMenu($mdOpenMenu, ev) {
    $mdOpenMenu(ev);
  }

  clickPublicationDetails(ev, publication) {
    this.showPublicationDialog(ev, publication);
  }

  clickPublicationWebsite(ev, publication) {
    let url = publication.url;
    // To make window.open work, add protocol when none is specified
    url = /^https?:\/\//.test(url) ? url : 'http://' + url;
    console.log('Clicked visit publication url: ' + url);
    window.open(url);
  }

  clickPublicationReference(ev, publication) {
    this.showReferenceExportDialog(ev, [publication]);
  }

  clickRemovePublication(ev, publication) {
    const confirmation = this.$mdDialog.confirm()
      .title('Remove this publication?')
      .textContent('"' + publication.title + '"')
      .targetEvent(ev)
      .ok('Remove')
      .cancel('Cancel');
    this.$mdDialog.show(confirmation)
      .then(() => this.Publications.remove(publication))
      .then(() => this.doNewSearch());
  }

  /*
   * Show reference export dialog
   */
  showReferenceExportDialog(ev, publications) {
    this.$mdDialog.show({
      template: ReferenceExportDialog,
      controller: ReferenceExportController,
      controllerAs: 'vm',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: false,
      fullscreen: true,
      locals: { init: publications }
    });
  }

  /*
   * Download references in a file
   */
  downloadReferences(ev) {
    console.log('Clicked download references');
    const properties = { type: "text/plain;charset=utf-8" };
    const filename = "references.txt";
    this.Publications.searchReferences(this.query).then(references => {
      console.log(`Downloading ${references.length} matching references`);
      const content = references.join('\n');
      filesaver.saveAs(new File([content], filename, properties));
    });
  }

  /*
   * Download backup
   */
  downloadBackup(ev) {
    console.log('Clicked download backup');
    window.open('/api/backup');
  }

  /*
   * Handle Navigation buttons
   */
  showPagingButtons() {
    return this.metadata.totalPages > 0;
  }

  showNextButton() {
    return (this.metadata.page + 1) < this.metadata.totalPages;
  }

  showPrevButton() {
    return this.metadata.page > 0;
  }

  navNextPage() {
    this.query.page = this.metadata.page + 1;
    this.searchPublications();
  }

  navPrevPage() {
    this.query.page = this.metadata.page - 1;
    this.searchPublications();
  }

}

PublicationsController.$inject = [
  '$mdDialog', 'Auth', 'Publications', 'Authors', 'Publishers'
];
export default PublicationsController;
