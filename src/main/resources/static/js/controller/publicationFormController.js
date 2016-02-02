/*
 * Publication Form controller
 */

angular
  .module('app.controllers')
  .controller('PublicationFormController', publicationFormController);

function publicationFormController($scope, $mdDialog, AuthorApi, PublisherApi, init, readonly) {
  $scope.readonly = readonly;
  $scope.initial = init || {
    authors: []
  };
  $scope.publication = angular.copy($scope.initial);
  $scope.allAuthors = AuthorApi.query();
  $scope.allPublishers = PublisherApi.query();

  /*
   * Initialize date field if present
   */
  if ($scope.publication.publishDate) {
    $scope.publishDate = new Date($scope.publication.publishDate);
  }

  /**
   * Search for authors
   */
  $scope.querySearch = function(query) {
    return query ? $scope.allAuthors.filter(createFilterFor(query)) : [];
  }

  function createFilterFor(query) {
    var lowercaseQuery = angular.lowercase(query);
    return function filterFn(contact) {
      var lowername = angular.lowercase(contact.fullname);
      return (lowername.indexOf(lowercaseQuery) != -1);
    };
  }

  /*
   * Save and discard functions
   */
  $scope.save = function(publication) {
    if ($scope.publishDate) {
      $scope.publication.publishDate = $scope.publishDate.getTime();
    }
    angular.copy($scope.publication, $scope.initial);
    $mdDialog.hide($scope.initial);
  }
  $scope.discard = function() {
    $mdDialog.cancel();
  }

};
