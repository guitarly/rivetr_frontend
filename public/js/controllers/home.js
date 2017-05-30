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
               } else {
                   scope.fullHeader = true;
               }
              scope.$apply();
          });
      };
  });

  // ================================================
  //                HOME PAGE CTRL                 //
  // ================================================
  app.controller('HomeCtrl', ['$http', '$scope', '$rootScope', '$location', '$document', '$routeParams', function($http, $scope, $rootScope, $location, $document, $routeParams){

    // =========== CONTROLLER VARIABLES =============
    const home = this;
    const URL = 'http://localhost:3000/';
    // const URL = 'http://rivetrapi.herokuapp.com/'
    $scope.fullHeader = true;
    $scope.compiledRivs = [];

    // =========== HTTP REQUESTS ====================


    // ========== ETC. DOM MANIPULATION ============
    // scrolls window back to top
    this.goToTop = function() {
      $document.scrollTop(0, 500);
    }

    // goes to index page
    this.indexPage = function() {
      console.log('index page');
      $location.url('/');
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
            this.compileRivs();
        }.bind(this));
      }
    }

    // compiles the user's followers' rivs
    this.compileRivs = function() {
      // pushes followed rivs
      $rootScope.currentUser.followed_follows.forEach(function(followed) {
        // regular
        followed.followed.rivs.forEach(function(riv) {
          $scope.compiledRivs.push({'riv': riv, 'user': followed.followed});
        });
        // replies
        followed.followed.replies.forEach(function(reply) {
          $scope.compiledRivs.push({'riv': reply, 'user': followed.followed, 'reply': true});
        });
      });
      // pushes own rivs
      $rootScope.currentUser.rivs.forEach(function(riv) {
        $scope.compiledRivs.push({'riv': riv, 'user': $rootScope.currentUser});
      });
      // pushes own replies
      $rootScope.currentUser.replies.forEach(function(reply) {
        $scope.compiledRivs.push({'riv': reply, 'user': $rootScope.currentUser, 'reply': true});
      });
      console.log($scope.compiledRivs);
    }

    // ============ AUTOMATIC FUNCTION CALLS =======
    this.sessionCheck();

  }]); // ends controller

})(); // ends closure
