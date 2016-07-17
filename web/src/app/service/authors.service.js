class AuthorsService {

  constructor($q, $resource) {
    this.$q = $q;
    this.cache = {};
    this.api = $resource('/api/authors/:id', {}, {
      update: { method: 'PUT' }
    });
  }

  findAll() {
    return this.api.query().$promise
      .then(list => {
        this.cache = this.toIdMap(list);
        return list;
      });
  }

  findById(id) {
    var author = this.cache[id];
    return author ?
      this.$q.when(author) :
      this.api.get({ id }).$promise.then(it => this.cacheAndReturn(it));
  }

  save(author) {
    return author.id ?
      this.api.update(author).$promise.then(it => this.cacheAndReturn(it)) :
      this.api.save(author).$promise.then(it => this.cacheAndReturn(it));
  }

  cacheAndReturn(data) {
    this.cache[data.id] = data;
    return data;
  }

  toIdMap(list) {
    return list.reduce((map, obj) => {
      map[obj.id] = obj;
      return map;
    }, {});
  }

}

AuthorsService.$inject = ['$q', '$resource'];
export default AuthorsService;
