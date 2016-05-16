/*
 * Publication Form controller
 */

angular
  .module('app.controllers')
  .controller('PublicationFormController', publicationFormController);

function publicationFormController($scope, $mdDialog, Publications, Authors, Publishers, init, readonly) {
  $scope.readonly = readonly;
  $scope.initial = init || { authors: [] };
  $scope.publication = angular.copy($scope.initial);

  /*
   * Load authors and publishers
   */
  Authors.findAll().then(function (data) { $scope.allAuthors = data; });
  Publishers.findAll().then(function (data) { $scope.allPublishers = data; });

  /*
   * Initialize date field if present
   */
  if ($scope.publication.publishDate) {
    $scope.publishDate = new Date($scope.publication.publishDate);
  }

  /**
   * Search for authors
   */
  $scope.querySearch = function (query) {
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
  $scope.save = function () {
    $scope.publication.publishDate = $scope.publishDate ?
      $scope.publishDate.getTime() : new Date().getTime();

    Publications.save($scope.publication).then(function (saved) {
      console.log('Saved publication: ' + saved.title);
      $mdDialog.hide(saved);
    }, function (err) {
      console.log('Error saving publication');
    });
  }
  $scope.discard = function () {
    console.log('Discarding changes on publication form');
    $mdDialog.cancel();
  }

};
