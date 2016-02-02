/*
 * REST Resources
 */

angular
  .module('app.services')
  .factory('PublicationApi', PublicationApi)
  .factory('AuthorApi', AuthorApi)
  .factory('PublisherApi', PublisherApi);

function PublicationApi($resource) {
  return $resource('/api/publications/:id', {}, {
    update: {
      method: 'PUT'
    },
    query: {
      method: 'GET',
      isArray: true,
      transformResponse: function(data) {
        var pageable = angular.fromJson(data);
        pageable.data = pageable.content;
        pageable.data.$metadata = pageable.metadata;
        return pageable.data;
      },
      interceptor: {
        response: function(res) {
          res.resource.$metadata = res.data.$metadata;
          return res.resource;
        }
      }
    }
  });
}

function AuthorApi($resource) {
  return $resource('/api/authors/:id', {}, {
    update: {
      method: 'PUT'
    }
  });
}

function PublisherApi($resource) {
  return $resource('/api/publishers/:id', {}, {
    update: {
      method: 'PUT'
    }
  });
}
