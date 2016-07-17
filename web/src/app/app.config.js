import moment from 'moment';

import PublicationsController from './controller/publications.controller.js';
import AuthorsController from './controller/authors.controller.js';
import PublishersController from './controller/publishers.controller.js';

/*
 * Application routing
 */
function routing($routeProvider) {
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
}
routing.$inject = ['$routeProvider'];

/*
 * Theming configuration for Material AngularJS
 */
function theming($mdThemingProvider) {
  $mdThemingProvider
    .theme('default')
    .primaryPalette('indigo')
    .accentPalette('red');
}
theming.$inject = ['$mdThemingProvider'];

/*
 * Date localization configuration
 */
function dateLocalization($mdDateLocaleProvider) {
  const dateFmt = 'YYYY-MM-DD';
  $mdDateLocaleProvider.formatDate = (date) => {
    return moment(date).format(dateFmt);
  };
  $mdDateLocaleProvider.parseDate = (str) => {
    const m = moment(str, dateFmt);
    return m.isValid() ? m.toDate() : new Date(NaN);
  };
}
dateLocalization.$inject = ['$mdDateLocaleProvider'];

export { routing, theming, dateLocalization };
