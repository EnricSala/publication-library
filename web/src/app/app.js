import angular from 'angular';
import ngRoute from 'angular-route';
import ngResource from 'angular-resource';
import ngMaterial from 'angular-material';
import uiBootstrap from 'angular-ui-bootstrap';
import ngSlider from 'angularjs-slider';
import moment from 'moment';

import MainController from './controller/main.controller.js';
import PublicationsController from './controller/publications.controller.js';
import AuthorsController from './controller/authors.controller.js';
import PublishersController from './controller/publishers.controller.js';

import AuthService from './service/auth.service.js';
import PublicationsService from './service/publications.service.js';
import AuthorsService from './service/authors.service.js';
import PublishersService from './service/publishers.service.js';

import 'angular-material/angular-material.min.css';
import 'angularjs-slider/dist/rzslider.min.css';
import '../style/app.css';

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, [
    'ngRoute',
    'ngMaterial',
    'ngResource',
    'ui.bootstrap',
    'rzModule',
    'app.services'
  ])
  .config($mdThemingProvider => {
    $mdThemingProvider
      .theme('default')
      .primaryPalette('indigo')
      .accentPalette('red');
  })
  .config($mdDateLocaleProvider => {
    const dateFmt = 'YYYY-MM-DD';
    $mdDateLocaleProvider.formatDate = (date) => {
      return moment(date).format(dateFmt);
    };
    $mdDateLocaleProvider.parseDate = (str) => {
      const m = moment(str, dateFmt);
      return m.isValid() ? m.toDate() : new Date(NaN);
    };
  })
  .config($routeProvider => {
    $routeProvider
      .when('/publications', {
        template: require('./view/publications.html'),
        controller: PublicationsController,
        controllerAs: 'vm'
      })
      .when('/authors', {
        template: require('./view/authors.html'),
        controller: AuthorsController,
        controllerAs: 'vm'
      })
      .when('/publishers', {
        template: require('./view/publishers.html'),
        controller: PublishersController,
        controllerAs: 'vm'
      })
      .otherwise({ redirectTo: '/publications' });
  })
  .directive('app', () => ({
    template: require('./app.html'),
    controller: MainController,
    controllerAs: 'main'
  }));

angular
  .module('app.services', ['ngResource'])
  .service('Auth', AuthService)
  .service('Publications', PublicationsService)
  .service('Authors', AuthorsService)
  .service('Publishers', PublishersService);

export default MODULE_NAME;
