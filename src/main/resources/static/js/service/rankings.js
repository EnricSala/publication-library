/*
 * Ranking service
 */

angular
  .module('app.services')
  .factory('Rankings', RankingsService);

function RankingsService($http) {

  return {
    authors: authors
  };

  function authors() {
    return $http
      .post('/api/ranking/authors')
      .then(function (data) {
        console.log('Loaded authors summary: ' + JSON.stringify(data));
      }, function (err) {
        console.log('Error loading authors summary: ' + err);
      });
  }

}
