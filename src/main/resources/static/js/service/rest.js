/*
 * REST Resources
 */

angular
  .module('app.services')
  .factory('Publications', function($resource) {
    return $resource('/api/publications/:id', {}, {
      update: {
        method: 'PUT'
      }
    });
  })
  .factory('Authors', function($resource) {
    return $resource('/api/authors/:id', {}, {
      update: {
        method: 'PUT'
      }
    });
  })
  .factory('Publishers', function($resource) {
    return $resource('/api/publishers/:id', {}, {
      update: {
        method: 'PUT'
      }
    });
  });
