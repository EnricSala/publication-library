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
    });

angular
  .module('app.services', ['ngResource']);

angular
  .module('app.controllers', []);
