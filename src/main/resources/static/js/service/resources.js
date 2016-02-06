angular
  .module('app.services')
  .factory('Publications', PublicationService)
  .factory('Authors', AuthorService)
  .factory('Publishers', PublisherService)

function PublicationService($q, PublicationApi, Authors, Publishers) {
  return {
    init: init,
    search: search,
    save: save,
    remove: remove
  };

  function init() {
    var holder;
    return $q.all({
      authors: Authors.findAll(),
      publishers: Publishers.findAll(),
      publications: runQuery()
    }).then(function(res) {
      holder = res;
      console.log('Loaded ' + res.authors.length + ' authors');
      console.log('Loaded ' + res.publishers.length + ' publisers');
      console.log('Loaded ' + res.publications.length + ' publications');
      return wireUp(res.publications);
    }).then(function(list) {
      return {
        authors: holder.authors,
        publishers: holder.publishers,
        publications: list
      };
    });
  }

  function search(query) {
    return runQuery(query).then(function(list) {
      return wireUp(list);
    });
  }

  function save(publication) {
    // Convert publisher and author list to ids
    publication.publisherId = publication.publisher ? publication.publisher.id : null;
    publication.authorIds = publication.authors.map(function(author) {
      return author.id;
    });
    // If existing do put, else do post
    if (publication.id) {
      return PublicationApi.update(publication).$promise;
    } else {
      return PublicationApi.save(publication).$promise;
    }
  }

  function remove(publication) {
    return PublicationApi.remove({
      id: publication.id
    }).$promise;
  }

  function runQuery(query) {
    var params = query || {};
    console.log('Searching query: ' + JSON.stringify(params));
    return PublicationApi.query({
      q: params.text,
      author: params.author,
      type: angular.lowercase(params.type),
      after: params.after,
      before: params.before,
      page: params.page
    }).$promise.then(function(res) {
      console.log('Search returned: ' + JSON.stringify(res.$metadata));
      return res;
    });
  }

  function wireUp(publications) {
    var promises = [];
    publications.forEach(function(pub) {
      promises.push($q.all({
        publisher: Publishers.findById(pub.publisherId),
        authors: $q.all(pub.authorIds.map(function(id) {
          return Authors.findById(id);
        }))
      }).then(function(data) {
        pub.publisher = data.publisher;
        pub.authors = data.authors;
        return pub;
      }));
    });
    return $q.all(promises).then(function(data) {
      data.$metadata = publications.$metadata;
      return data;
    });
  }

}

/*
 * Author Service
 */
function AuthorService($q, Utils, AuthorApi) {
  var cache = {};

  return {
    findAll: findAll,
    findById: findById,
    save: save
  };

  function findAll() {
    return AuthorApi.query().$promise.then(function(list) {
      cache = Utils.toMap(list);
      return list;
    });
  }

  function findById(id) {
    var author = cache[id];
    if (author) {
      return $q.when(author);
    } else {
      console.log('Not in cache, hitting author api');
      return AuthorApi.get({
        id: id
      }).$promise.then(cacheAndReturn);
    }
  }

  function save(author) {
    if (author.id) {
      return AuthorApi.update(author).$promise.then(cacheAndReturn);
    } else {
      return AuthorApi.save(author).$promise.then(cacheAndReturn);
    }
  }

  function cacheAndReturn(data) {
    cache[data.id] = data;
    return data;
  }

}

/*
 * Publisher Service
 */
function PublisherService($q, Utils, PublisherApi) {
  var cache = {};

  return {
    findAll: findAll,
    findById: findById,
    save: save
  };

  function findAll() {
    return PublisherApi.query().$promise.then(function(list) {
      cache = Utils.toMap(list);
      return list;
    });
  }

  function findById(id) {
    var publisher = cache[id];
    if (publisher) {
      return $q.when(publisher);
    } else {
      console.log('Not in cache, hitting publisher api');
      return PublisherApi.get({
        id: id
      }).$promise.then(cacheAndReturn);
    }
  }

  function save(publisher) {
    if (publisher.id) {
      return PublisherApi.update(publisher).$promise.then(cacheAndReturn);
    } else {
      return PublisherApi.save(publisher).$promise.then(cacheAndReturn);
    }
  }

  function cacheAndReturn(data) {
    cache[data.id] = data;
    return data;
  }

}
