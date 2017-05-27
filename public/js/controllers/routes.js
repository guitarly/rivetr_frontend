(function(){
  var app = angular.module('Rivetr');

  // ROUTES CONFIGURATION
  app.config(function($routeProvider){
    $routeProvider
      .when('/', {
        controller: 'LandingCtrl',
        templateUrl: '/views/landing-page.html',
        controllerAs: 'vm'
      });
  });
})();
