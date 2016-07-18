class PublishersController {

  constructor(Summary) {
    this.Summary = Summary;
    this.init();
  }

  init() {
    this.Summary.publishers().then(
      byType => {
        this.journals = byType.journal;
        this.conferences = byType.conference;
        this.books = byType.book;
      });
  }

}

PublishersController.$inject = ['Summary'];
export default PublishersController;
