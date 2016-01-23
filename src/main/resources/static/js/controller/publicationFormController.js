/*
 * Publication Form controller
 */

angular
  .module('app.controllers')
  .controller('PublicationFormController', publicationFormController);

function publicationFormController($scope, $mdDialog, Authors, Publishers, init, readonly) {
  $scope.readonly = readonly;
  $scope.initial = init || {
    authors: []
  };
  $scope.publication = angular.copy($scope.initial);

  /*
   * Load authors and publishers
   */
  Authors.query({}, function(list) {
    $scope.allAuthors = list;
  });
  Publishers.query({}, function(list) {
    $scope.allPublishers = list;
  });


  /*
   * Save and discard functions
   */
  $scope.save = function(publication) {
    angular.copy($scope.publication, $scope.initial);
    $mdDialog.hide($scope.initial);
  }
  $scope.discard = function() {
    $mdDialog.cancel();
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

};
