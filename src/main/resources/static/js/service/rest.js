/*
 * REST Resources
 */

angular
  .module('app.services')
  .factory('Publications', ['$resource', function($resource) {
    return $resource('/api/publications/:id', {}, {
      update: {
        method: 'PUT'
      }
    });
  }])
  .factory('Authors', ['$resource', function($resource) {
    return $resource('/api/authors/:id', {}, {
      update: {
        method: 'PUT'
      }
    });
  }])
  .factory('Publishers', ['$resource', function($resource) {
    return $resource('/api/publishers/:id', {}, {
      update: {
        method: 'PUT'
      }
    });
  }]);
