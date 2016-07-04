export default class PublicationsService {

  constructor($q, $resource, Authors, Publishers) {
    this.$q = $q;
    this.authors = Authors;
    this.publishers = Publishers;
    this.api = $resource('/api/publications/:id', {}, {
      update: { method: 'PUT' },
      query: {
        method: 'GET',
        isArray: true,
        transformResponse: data => {
          var pageable = angular.fromJson(data);
          pageable.data = pageable.content;
          pageable.data.$metadata = pageable.metadata;
          return pageable.data;
        },
        interceptor: {
          response: res => {
            res.resource.$metadata = res.data.$metadata;
            return res.resource;
          }
        }
      }
    });
  }

  findAll() {
    let holder;
    return this.$q.all({
        authors: this.authors.findAll(),
        publishers: this.publishers.findAll(),
        publications: this.runQuery()
      })
      .then(res => {
        holder = res;
        console.log(`Loaded ${res.authors.length} authors`);
        console.log(`Loaded ${res.publishers.length} publisers`);
        console.log(`Loaded ${res.publications.length} publications`);
        return this.wireUp(res.publications);
      })
      .then(list => ({
        authors: holder.authors,
        publishers: holder.publishers,
        publications: list
      }));
  }

  search(query) {
    return this.runQuery(query).then(list => this.wireUp(list));
  }

  save(publication) {
    // Convert publisher and author list to ids
    publication.publisherId = publication.publisher ? publication.publisher.id : null;
    publication.authorIds = publication.authors.map(author => author.id);

    // If existing do put, else do post
    return publication.id ?
      this.api.update(publication).$promise :
      this.api.save(publication).$promise;
  }

  remove(publication) {
    return this.api.remove({ id: publication.id }).$promise;
  }

  runQuery(query) {
    const params = query || {};
    console.log(`Searching query: ${JSON.stringify(params)}`);
    return this.api.query({
        q: params.text,
        author: params.author,
        type: angular.lowercase(params.type),
        after: params.after,
        before: params.before,
        page: params.page
      }).$promise
      .then(res => {
        console.log(`Search returned: ${JSON.stringify(res.$metadata)}`);
        return res;
      });
  }

  wireUp(publications) {
    let promises = [];
    publications.forEach(pub => {
      promises
        .push(this.$q.all({
            publisher: this.publishers.findById(pub.publisherId),
            authors: this.$q.all(pub.authorIds.map(id => this.authors.findById(id)))
          })
          .then(data => {
            pub.publisher = data.publisher;
            pub.authors = data.authors;
            return pub;
          }));
    });
    return this.$q.all(promises)
      .then(data => {
        data.$metadata = publications.$metadata;
        return data;
      });
  }

}
