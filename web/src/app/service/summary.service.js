class SummaryService {

  constructor($http) {
    this.$http = $http;
  }

  authors() {
    return this.$http.get('/api/summary/authors').then(
      res => res.data,
      err => console.log(`Error loading authors summary: ${err}`)
    );
  }

  publishers() {
    return this.$http.get('/api/summary/publishers').then(
      res => res.data,
      err => console.log(`Error loading publishers summary: ${err}`)
    );
  }

}

SummaryService.$inject = ['$http'];
export default SummaryService;
