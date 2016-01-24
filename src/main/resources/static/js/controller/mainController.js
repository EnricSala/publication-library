/**
 * Main controller
 */

angular
  .module('app.controllers')
  .controller('MainController', MainController);

function MainController($scope, $mdDialog, Auth, Publications, Authors, Publishers) {
  $scope.authors = Authors.query();
  $scope.publishers = Publishers.query();
  $scope.publications = Publications.query();
  $scope.publicationTypes = ['All', 'Journal', 'Conference', 'Book'];
  $scope.query = {
    text: '',
    author: '',
    type: $scope.publicationTypes[0],
    minYear: 1990,
    maxYear: new Date().getFullYear()
  };
  $scope.selectedAuthor = {};
  $scope.isMenuOpen = false;

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
    floor: $scope.query.minYear,
    ceil: $scope.query.maxYear,
    draggableRange: true,
    keyboardSupport: false,
    hideLimitLabels: true
  };

  /*
   * Search Author
   */
  $scope.selectAuthor = function(author) {
    if ($scope.selectedAuthor.id === author.id) {
      $scope.selectedAuthor = {};
      $scope.query.author = '';
    } else {
      $scope.selectedAuthor = author;
    }
  };
  $scope.clearAuthor = function() {
    $scope.selectedAuthor = {};
    $scope.query.author = '';
  };

  /*
   * Calulate secondary authors
   */
  function shortenName(name) {
    var parts = name.split(' ');
    var last = parts.pop();
    parts = parts.map(function(part) {
      return part.charAt(0);
    });
    parts.push(last);
    return parts.join('. ');
  }
  $scope.getSecondaryAuthors = function(authors) {
    var secondaries = authors.slice(1, authors.length);
    return secondaries.map(function(author) {
      return shortenName(author.fullname);
    }).join(', ');
  };

  /*
   * Search Publications
   */
  $scope.searchPublications = function() {
    if ($scope.query.text) {
      console.log('Searching: ' + $scope.query.text);
      $scope.publications = Publications.query({
        q: $scope.query.text,
        author: $scope.query.author,
        type: $scope.query.type
      });
    } else {
      Publications.query().$promise.then(function(list) {
        console.log('Empty query, showing all');
        $scope.publications = list;
      });
    }
  };
  $scope.filterPublications = function(pub) {
    return hasAuthor(pub) && matchesType(pub) && matchesYearRange(pub);
  }

  function hasAuthor(pub) {
    return !$scope.selectedAuthor.id ||
      pub.authors.map(function(author) {
        return $scope.selectedAuthor.id === author.id;
      }).reduce(function(aux, matches) {
        return aux = aux || matches;
      }, false);
  }

  function matchesType(pub) {
    var type = angular.lowercase($scope.query.type);
    return (type === 'all') ||
      (angular.lowercase(pub.publisher.type) === type);
  }

  function matchesYearRange(pub) {
    if (pub.publishDate) {
      var year = (new Date(pub.publishDate)).getFullYear();
      return (year >= $scope.query.minYear) &&
        (year <= $scope.query.maxYear);
    }
    return true;
  }

  /*
   * Menu for adding content
   */
  $scope.items = [{
    name: "New Publication",
    icon: "/img/icon/publication-plus.svg"
  }, {
    name: "New Author",
    icon: "/img/icon/author-plus.svg"
  }, {
    name: "New Publisher",
    icon: "/img/icon/folder-plus.svg"
  }];
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
    }
  }

  /*
   * Show new/edit dialogs
   */
  $scope.showPublicationDialog = function(ev, publication) {
    var resource = findResource(publication, $scope.authors);
    handleResourceDialog(ev, publication, 'PublicationFormController', 'publicationDialog.html',
      function(newPublication) {
        Publications.save(newPublication, function(saved) {
          console.log('Saved new publication: ' + JSON.stringify(saved));
          $scope.publications.push(saved);
        });
      });
  };
  $scope.showAuthorDialog = function(ev, author) {
    var resource = findResource(author, $scope.authors);
    handleResourceDialog(ev, resource, 'AuthorFormController', 'authorDialog.html',
      function(newAuthor) {
        Authors.save(newAuthor, function(saved) {
          console.log('Saved new author: ' + JSON.stringify(saved));
          $scope.authors.push(saved);
        });
      });
  };
  $scope.showPublisherDialog = function(ev, publisher) {
    var resource = findResource(publisher, $scope.publishers);
    handleResourceDialog(ev, resource, 'PublisherFormController', 'publisherDialog.html',
      function(newPublisher) {
        Publishers.save(newPublisher, function(saved) {
          console.log('Saved new publisher: ' + JSON.stringify(saved));
          $scope.publishers.push(saved);
        });
      });
  };

  function findResource(item, list) {
    if (item) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === item.id) {
          return list[i];
        }
      }
    }
    return null;
  }

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

};
