export default class AuthService {

  constructor($http) {
    this.$http = $http;
    this.authenticated = false;
  }

  login(credentials) {
    var config = {}
    if (credentials && credentials.user && credentials.password) {
      config.headers = {};
      config.headers.authorization = "Basic " +
        btoa(credentials.user + ":" + credentials.password);
    }
    return this.$http
      .get('/user', config)
      .then((response) => {
        this.authenticated = response.data.name ? true : false;
        console.log(this.authenticated ? 'Login success' : 'Login failed');
        return this.authenticated;
      }, () => {
        console.log('Login failed');
        return false;
      });
  }

  logout() {
    return this.$http
      .post('/logout')
      .then(() => {
        console.log('Logout success')
        this.authenticated = false;
        return this.authenticated;
      }, () => {
        console.log('Logout failed')
        return this.authenticated;
      });
  }

}
