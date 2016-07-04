export default class PublicationFormController {

  constructor($mdDialog, Publications, Authors, Publishers, init, readonly) {
    this.$mdDialog = $mdDialog;
    this.Publications = Publications;
    this.Authors = Authors;
    this.Publishers = Publishers;
    this.publication = angular.copy(init || { authors: [] });
    this.readonly = readonly;
    this.init();
  }

  init() {
    // Init authors and publishers
    this.Authors.findAll().then(data => this.allAuthors = data);
    this.Publishers.findAll().then(data => this.allPublishers = data);

    // Initialize date field if present
    if (this.publication.publishDate) {
      this.publishDate = new Date(this.publication.publishDate);
    }
  }

  /**
   * Search for authors
   */
  querySearch(query) {
    const createFilterFor = (query) => {
      const lowercaseQuery = angular.lowercase(query);
      return (contact) => {
        const lowername = angular.lowercase(contact.fullname);
        return (lowername.indexOf(lowercaseQuery) != -1);
      };
    }
    return query ? this.allAuthors.filter(createFilterFor(query)) : [];
  }

  /*
   * Save and discard functions
   */
  save() {
    this.publication.publishDate = this.publishDate ?
      this.publishDate.getTime() : new Date().getTime();

    this.Publications.save(this.publication)
      .then(
        saved => {
          console.log(`Saved publication: ${saved.title}`);
          this.$mdDialog.hide(saved);
        },
        err => console.log(`Error saving publication: ${err}`)
      );
  }

  discard() {
    console.log('Discarding changes on publication form');
    this.$mdDialog.cancel();
  }

}
