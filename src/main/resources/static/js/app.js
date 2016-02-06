/*
 * App module
 */

angular
  .module(
    'app', [
      'ngMaterial',
      'ngResource',
      'rzModule',
      'app.services',
      'app.controllers'
    ])
  .config(
    function($mdThemingProvider) {
      $mdThemingProvider
        .theme('default')
        .primaryPalette('indigo')
        .accentPalette('red');
    })
  .config(function($mdDateLocaleProvider) {
    var dateFmt = 'YYYY-MM-DD';
    $mdDateLocaleProvider.formatDate = function(date) {
      return moment(date).format(dateFmt);
    };
    $mdDateLocaleProvider.parseDate = function(str) {
      var m = moment(str, dateFmt);
      return m.isValid() ? m.toDate() : new Date(NaN);
    };
  });

angular
  .module('app.services', ['ngResource']);

angular
  .module('app.controllers', []);
