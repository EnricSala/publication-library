class PublishersService {

  constructor($q, $resource) {
    this.$q = $q;
    this.cache = {};
    this.api = $resource('/api/publishers/:id', {}, {
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
    var publisher = this.cache[id];
    return publisher ?
      this.$q.when(publisher) :
      this.api.get({ id }).$promise.then(it => this.cacheAndReturn(it));
  }

  save(publisher) {
    return publisher.id ?
      this.api.update(publisher).$promise.then(it => this.cacheAndReturn(it)) :
      this.api.save(publisher).$promise.then(it => this.cacheAndReturn(it));
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

PublishersService.$inject = ['$q', '$resource'];
export default PublishersService;
