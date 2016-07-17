class SummaryService {

  constructor($http) {
    this.$http = $http;
  }

  authors() {
    return this.$http.post('/api/summary/authors')
      .then(
        data => console.log(`Loaded authors summary: ${JSON.stringify(data)}`),
        err => console.log(`Error loading authors summary: ${err}`)
      );
  }

  publishers() {
    return this.$http.post('/api/summary/publishers')
      .then(
        data => console.log(`Loaded publishers summary: ${JSON.stringify(data)}`),
        err => console.log(`Error loading publishers summary: ${err}`)
      );
  }

}

SummaryService.$inject = ['$http'];
export default SummaryService;
