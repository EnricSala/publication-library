/*
 * REST Resources
 */

angular
  .module('app.services')
  .factory('PublicationApi', function($resource) {
    return $resource('/api/publications/:id', {}, {
      update: {
        method: 'PUT'
      }
    });
  })
  .factory('AuthorApi', function($resource) {
    return $resource('/api/authors/:id', {}, {
      update: {
        method: 'PUT'
      }
    });
  })
  .factory('PublisherApi', function($resource) {
    return $resource('/api/publishers/:id', {}, {
      update: {
        method: 'PUT'
      }
    });
  });
