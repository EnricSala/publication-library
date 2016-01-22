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

  function login(credentials, callback) {
    var headers = {}
    if (credentials && credentials.user && credentials.password) {
      headers.authorization = "Basic " + btoa(credentials.user + ":" + credentials.password);
    }
    $http.get('/user', {
      headers: headers
    }).success(function(data) {
      auth.authenticated = data.name ? true : false;
      console.log('Logged in: ' + (auth.authenticated ? 'yes' : 'no'));
      callback && callback(auth.authenticated);
    }).error(function() {
      console.log('Login failed');
      auth.authenticated = false;
      callback && callback(false);
    });
  }

  function logout(callback) {
    auth.authenticated = false;
    $http.post('/logout', {})
      .success(function(data) {
        auth.authenticated = false;
        callback && callback(false);
      }).error(function() {
        callback && callback(auth.authenticated);
      });
  }

}
