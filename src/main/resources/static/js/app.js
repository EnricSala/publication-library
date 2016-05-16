/*
 * App module
 */

angular
  .module(
    'app', [
      'ngRoute',
      'ngMaterial',
      'ngResource',
      'rzModule',
      'app.services',
      'app.controllers'
    ])
  .config(function ($mdThemingProvider) {
    $mdThemingProvider
      .theme('default')
      .primaryPalette('indigo')
      .accentPalette('red');
  })
  .config(function ($mdDateLocaleProvider) {
    var dateFmt = 'YYYY-MM-DD';
    $mdDateLocaleProvider.formatDate = function (date) {
      return moment(date).format(dateFmt);
    };
    $mdDateLocaleProvider.parseDate = function (str) {
      var m = moment(str, dateFmt);
      return m.isValid() ? m.toDate() : new Date(NaN);
    };
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/publications', {
        templateUrl: 'view/publications.html',
        controller: 'PublicationsController'
      })
      .when('/authors', {
        templateUrl: 'view/authors.html',
        controller: 'AuthorsController'
      })
      .when('/publishers', {
        templateUrl: 'view/publishers.html',
        controller: 'PublishersController'
      })
      .otherwise({ redirectTo: '/publications' });
  });

angular
  .module('app.services', ['ngResource']);

angular
  .module('app.controllers', []);
