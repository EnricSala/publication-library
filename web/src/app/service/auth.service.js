class AuthService {

  constructor($http) {
    this.$http = $http;
    this.authenticated = false;
  }

  login(credentials) {
    const config = {};
    if (credentials && credentials.user && credentials.password) {
      config.headers = {};
      config.headers.authorization = "Basic " +
        btoa(credentials.user + ":" + credentials.password);
    }
    return this.$http.get('/api/user', config).then(
      res => {
        this.authenticated = !!res.data.name;
        console.log(this.authenticated ? 'Login success' : 'Login failed');
        return this.authenticated;
      },
      err => {
        console.log('Login failed');
        return false;
      });
  }

  logout() {
    return this.$http.post('/logout').then(
      res => {
        console.log('Logout success');
        this.authenticated = false;
        return this.authenticated;
      },
      err => {
        console.log('Logout failed');
        return this.authenticated;
      });
  }

}

AuthService.$inject = ['$http'];
export default AuthService;
