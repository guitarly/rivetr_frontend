(function(){
  var app = angular.module('Rivetr');

  // ROUTES CONFIGURATION
  app.config(function($routeProvider){
    $routeProvider
      .when('/', {
        controller: 'LandingCtrl',
        templateUrl: '/views/landing-page.html',
        controllerAs: 'vm'
      })
      .when('/:username', {
        resolve: {
          "check": function($location, $rootScope) {
            if(localStorage.length === 0) {
              $location.path('/');
            }
          }
        },
        controller: 'ProfileCtrl',
        templateUrl: '/views/profile.html',
        controllerAs: 'vm'
      })
      .when('/h/home', {
        resolve: {
          "check": function($location, $rootScope) {
            if(localStorage.length === 0) {
              $location.path('/');
            }
          }
        },
        controller: 'HomeCtrl',
        templateUrl: '/views/home.html',
        controllerAs: 'vm'
      });
  });
})();
