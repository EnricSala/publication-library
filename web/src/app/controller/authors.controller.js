import AuthorFormController from './author.form.controller.js';
import AuthorDialog from '../view/author.dialog.html';

class AuthorsController {

  constructor($mdDialog, Auth, Summary) {
    this.$mdDialog = $mdDialog;
    this.Auth = Auth;
    this.Summary = Summary;
    this.init();
  }

  init() {
    this.Summary.authors()
      .then(list => {
        const { scored, maxVal } = calcScores(list);
        this.list = scored;
        this.maxScore = maxVal;
      });

    function calcScores(authors) {
      const scored = authors
        .map(it => {
          const { score, byType } = toScore(it.contributions);
          it.score = score;
          it.scoreByType = byType;
          return it;
        });
      const maxVal = scored
        .map(it => it.score)
        .reduce((acc, it) => it > acc ? it : acc, 0);
      return { scored, maxVal };
    }

    function toScore(contributions) {
      const journalScore = scoreByType(contributions.journal);
      const conferenceScore = scoreByType(contributions.conference);
      const bookScore = scoreByType(contributions.book);
      return {
        score: journalScore + conferenceScore + bookScore,
        byType: [
          { name: 'journal', score: journalScore, type: 'success' },
          { name: 'conference', score: conferenceScore, type: 'info' },
          { name: 'book', score: bookScore, type: 'warning' }
        ]
      };
    }

    function scoreByType(byType) {
      return (byType || [])
        .map(it => it.count * 1 / it.pos)
        .reduce((acc, it) => acc + it, 0);
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

AuthorsController.$inject = ['$mdDialog', 'Auth', 'Summary'];
export default AuthorsController;
