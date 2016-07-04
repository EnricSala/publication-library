export default class StatsService {

  constructor($http) {
    this.$http = $http;
  }

  authors() {
    return this.$http.post('/api/stats/authors')
      .then(
        data => console.log(`Loaded authors summary: ${JSON.stringify(data)}`),
        err => console.log(`Error loading authors summary: ${err}`)
      );
  }

}
