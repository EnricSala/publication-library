/*
 * Authentication service
 */

angular
  .module('app.services')
  .factory('Auth', AuthService);

function AuthService($http) {

  var auth = {
    authenticated: false,
    login: login,
    logout: logout
  };
  return auth;

  function login(credentials) {
    var config = {}
    if (credentials && credentials.user && credentials.password) {
      config.headers = {};
      config.headers.authorization = "Basic " +
        btoa(credentials.user + ":" + credentials.password);
    }
    return $http
      .get('/user', config)
      .then(function(response) {
        auth.authenticated = response.data.name ? true : false;
        console.log(auth.authenticated ? 'Login success' : 'Login failed');
        return auth.authenticated;
      }, function() {
        console.log('Login failed');
        return false;
      });
  }

  function logout() {
    return $http
      .post('/logout')
      .then(function() {
        console.log('Logout success')
        auth.authenticated = false;
        return auth.authenticated;
      }, function() {
        console.log('Logout failed')
        return auth.authenticated;
      });
  }

}
