(function(){
  const app = angular.module('Rivetr');

  // ==============================================
  //              SCROLL DIRECTIVE               //
  // ==============================================
  app.directive("scroll", function ($window) {
      return function(scope, element, attrs) {

          angular.element($window).bind("scroll", function() {
              if (this.pageYOffset >= 100) {
                   scope.fullHeader = false;
                   console.log('Scrolled below header.');
               } else {
                   scope.fullHeader = true;
                   console.log('Header is in view.');
               }
              scope.$apply();
          });
      };
  });

  // ================================================
  //               PROFILE PAGE CTRL               //
  // ================================================
  app.controller('ProfileCtrl', ['$http', '$scope', '$rootScope', function($http, $scope, $rootScope){

    // =========== CONTROLLER VARIABLES =============
    const landing = this;
    const URL = 'http://localhost:3000/';
    // const URL = 'http://rivetrapi.herokuapp.com/'
    $scope.fullHeader = true;

    // =========== HTTP REQUESTS ====================


    // ============ MODAL DE/ACTIVATION =============
    // default variables

    // toggle switch
    this.modalToggle = function(modal) {
      switch(modal) {
        case 'register':
          this.showRegister = !this.showRegister;
          break;
      }
    }

    // ============ LOGOUT AND SESSIONS ============
    // to logout
    this.logout = function(){
      localStorage.clear('token');
      location.reload();
    }

    // checks if session active
    this.sessionCheck = function(){
      if(localStorage.length !== 0){
        let id = localStorage.user;
        $http({
          method: 'GET',
          url: URL + 'users/' + id
        }).then(function(result){
            $rootScope.currentUser = result.data;
        })
      }
    }

    this.sessionCheck();

  }]); // ends controller

})(); // ends closure
