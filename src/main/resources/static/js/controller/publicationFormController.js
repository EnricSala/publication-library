/*
 * Publication Form controller
 */

angular
  .module('app.controllers')
  .controller('PublicationFormController', publicationFormController);

function publicationFormController($scope, $mdDialog, Authors, Publishers, init, readonly) {
  $scope.readonly = readonly;
  $scope.publication = init || {
    authors: []
  };
  $scope.initial = angular.copy($scope.publication);

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
    $mdDialog.hide(publication);
  }
  $scope.discard = function() {
    angular.copy($scope.initial, $scope.publication);
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
