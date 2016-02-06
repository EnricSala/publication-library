/**
 * Main controller
 */

angular
  .module('app.controllers')
  .controller('MainController', MainController);

function MainController($scope, $mdDialog, Auth, Publications, Authors, Publishers, PublicationApi, AuthorApi, PublisherApi) {
  $scope.publicationTypes = ['All', 'Journal', 'Conference', 'Book'];
  $scope.query = {
    text: '',
    author: '',
    type: $scope.publicationTypes[0],
    after: 1990,
    before: new Date().getFullYear(),
    page: 0
  };
  $scope.authorFilter = '';
  $scope.isMenuOpen = false;
  $scope.metadata = {};

  /*
   * Load initial data
   */
  Publications.init().then(function(data) {
    $scope.authors = data.authors;
    $scope.publishers = data.publishers;
    $scope.publications = data.publications;
    $scope.metadata = data.publications.$metadata;
  });

  /*
   * Check authentication state
   */
  $scope.authenticated = false;
  Auth.login(null, function(authenticated) {
    $scope.authenticated = authenticated;
  });

  /*
   * Configure the year slider
   */
  $scope.yearSliderConfig = {
    floor: $scope.query.after,
    ceil: $scope.query.before,
    draggableRange: true,
    keyboardSupport: false,
    hideLimitLabels: true,
    onEnd: onSliderChanged
  };

  function onSliderChanged(id, value) {
    $scope.doNewSearch();
  }

  /*
   * Search Author
   */
  $scope.selectAuthor = function(author) {
    $scope.authorFilter = '';
    $scope.query.author = $scope.query.author === author.id ? '' : author.id;
    $scope.doNewSearch();
  };

  /*
   * Calulate secondary authors
   */
  $scope.getSecondaryAuthors = function(authors) {
    var items = authors || [];
    var secondaries = items.slice(1, items.length);
    return secondaries.map(function(author) {
      return shortenName(author.fullname);
    }).join(', ');
  };

  function shortenName(name) {
    var parts = name.split(' ');
    var last = parts.pop();
    parts = parts.map(function(part) {
      return part.charAt(0);
    });
    parts.push(last);
    return parts.join('. ');
  }

  /*
   * Search Publications
   */
  $scope.doNewSearch = function() {
    $scope.query.page = 0;
    $scope.searchPublications();
  }
  $scope.searchPublications = function() {
    $scope.publications = [];
    $scope.metadata = {};
    Publications.search($scope.query).then(function(publications) {
      $scope.publications = publications;
      $scope.metadata = publications.$metadata;
    });
  };

  /*
   * Menu for adding content
   */
  $scope.menuItems = [{
    name: "New Publication",
    icon: "/img/icon/publication-plus.svg",
    sensitive: true
  }, {
    name: "New Author",
    icon: "/img/icon/author-plus.svg",
    sensitive: true
  }, {
    name: "New Publisher",
    icon: "/img/icon/folder-plus.svg",
    sensitive: true
  }, {
    name: "Export Publications",
    icon: "/img/icon/file-export.svg",
    sensitive: false
  }];
  $scope.isOptionVisible = function(option) {
    return !option.sensitive || $scope.authenticated;
  }
  $scope.handleMenuClick = function(ev, idx) {
    switch (idx) {
      case 0:
        console.log('Open new publication dialog');
        $scope.showPublicationDialog(ev);
        break;
      case 1:
        console.log('Open new author dialog');
        $scope.showAuthorDialog(ev);
        break;
      case 2:
        console.log('Open new publisher dialog');
        $scope.showPublisherDialog(ev);
        break;
      case 3:
        console.log('Export current selection');
        $scope.showReferenceExportDialog(ev, $scope.publications);
        break;
    }
  }

  /*
   * Show new/edit dialogs
   */
  $scope.showPublicationDialog = function(ev, publication) {
    handleResourceDialog(ev, publication, 'PublicationFormController', 'publicationDialog.html',
      function(newPublication) {
        PublicationApi.save(newPublication, function(saved) {
          console.log('Saved new publication: ' + JSON.stringify(saved));
          $scope.publications.push(saved);
        });
      });
  };
  $scope.showAuthorDialog = function(ev, author) {
    handleResourceDialog(ev, author, 'AuthorFormController', 'authorDialog.html',
      function(newAuthor) {
        AuthorApi.save(newAuthor, function(saved) {
          console.log('Saved new author: ' + JSON.stringify(saved));
          $scope.authors.push(saved);
        });
      });
  };
  $scope.showPublisherDialog = function(ev, publisher) {
    handleResourceDialog(ev, publisher, 'PublisherFormController', 'publisherDialog.html',
      function(newPublisher) {
        PublisherApi.save(newPublisher, function(saved) {
          console.log('Saved new publisher: ' + JSON.stringify(saved));
          $scope.publishers.push(saved);
        });
      });
  };

  /*
   * Function to handle resource dialogs
   */
  function handleResourceDialog(ev, item, controller, template, newItemCallback) {
    $mdDialog.show({
      controller: controller,
      templateUrl: '/view/' + template,
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: false,
      fullscreen: true,
      locals: {
        init: item,
        readonly: !$scope.authenticated
      }
    }).then(function(item) {
      if (item.id) {
        console.log('Clicked save: updating existing item');
        item.$update();
      } else {
        console.log('Clicked save: creating new item');
        newItemCallback(item);
      }
    }, function() {
      console.log('Clicked Discard');
    });
  }

  /*
   * Handle publication menu actions
   */
  $scope.openPublicationMenu = function($mdOpenMenu, ev) {
    $mdOpenMenu(ev);
  };
  $scope.clickPublicationDetails = function(ev, publication) {
    $scope.showPublicationDialog(ev, publication);
  }
  $scope.clickPublicationWebsite = function(ev, publication) {
    var url = publication.url;
    // To make window.open work, add protocol when none is specified
    url = /^https?:\/\//.test(url) ? url : 'http://' + url;
    console.log('Clicked visit publication url: ' + url);
    window.open(url);
  }
  $scope.clickPublicationReference = function(ev, publication) {
    $scope.showReferenceExportDialog(ev, [publication]);
  }
  $scope.clickRemovePublication = function(ev, publication) {
    var confirm = $mdDialog.confirm()
      .title('Remove this publication?')
      .textContent('"' + publication.title + '"')
      .targetEvent(ev)
      .ok('Remove')
      .cancel('Cancel');
    $mdDialog.show(confirm).then(function() {
      console.log('Removing publication: ' + publication.title);
      return Publications.remove(publication);
    }).then(function() {
      $scope.doNewSearch();
    });
  }

  /*
   * Show reference export dialog
   */
  $scope.showReferenceExportDialog = function(ev, publications) {
    $mdDialog.show({
      controller: 'ReferenceExportController',
      templateUrl: '/view/referenceExportDialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: false,
      fullscreen: true,
      locals: {
        init: publications
      }
    });
  }

  /*
   * Show login dialog
   */
  $scope.showLoginDialog = function(ev) {
    $mdDialog.show({
      controller: 'LoginFormController',
      templateUrl: '/view/loginDialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: false,
      fullscreen: false
    }).then(function() {
      console.log('Clicked login, authenticated: yes');
      $scope.authenticated = true;
    }, function() {
      console.log('Clicked cancel login');
    });
  };

  /*
   * Handle logout
   */
  $scope.logout = function() {
    Auth.logout(function(authenticated) {
      console.log('Clicked logout, authenticated: no');
      $scope.authenticated = authenticated;
    });
  }

  /*
   * Handle Navigation buttons
   */
  $scope.showPagingButtons = function() {
    return $scope.metadata.totalPages > 0;
  }
  $scope.showNextButton = function() {
    return ($scope.metadata.page + 1) < $scope.metadata.totalPages;
  }
  $scope.showPrevButton = function() {
    return $scope.metadata.page > 0;
  }
  $scope.navNextPage = function() {
    $scope.query.page = $scope.metadata.page + 1;
    $scope.searchPublications();
  }
  $scope.navPrevPage = function() {
    $scope.query.page = $scope.metadata.page - 1;
    $scope.searchPublications();
  }

};
