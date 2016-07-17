import angular from 'angular';
import ngRoute from 'angular-route';
import ngResource from 'angular-resource';
import ngMaterial from 'angular-material';
import uiBootstrap from 'angular-ui-bootstrap';
import ngSlider from 'angularjs-slider';

import MainController from './controller/main.controller.js';
import { routing, theming, dateLocalization } from './app.config.js';

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
  .config(routing)
  .config(theming)
  .config(dateLocalization)
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
