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
  //               PROFILE PAGE CTRL               //
  // ================================================
  app.controller('ProfileCtrl', ['$http', '$scope', '$rootScope', '$location', '$document', '$routeParams', function($http, $scope, $rootScope, $location, $document, $routeParams){

    // =========== CONTROLLER VARIABLES =============
    const landing = this;
    const URL = 'http://localhost:3000/';
    // const URL = 'http://rivetrapi.herokuapp.com/'
    $scope.fullHeader = true;

    // =========== HTTP REQUESTS ====================
    // to find the information for the user profile being viewed
    this.findProfileUser = function() {
      $http({
        method: 'GET',
        url: URL + $routeParams.username
      }).then(function(result) {
          this.profileUser = result.data;
          console.log(this.profileUser);
          if(this.profileUser.id === $rootScope.currentUser.id) {
            this.isCurrentUser = true;
          }
      }.bind(this))
    }

    // to delete user
    this.deleteUser = function() {
      if(this.profileUser.id === $rootScope.currentUser.id) {
        $http({
          method: 'DELETE',
          url: URL + 'users/' + this.profileUser.id,
          headers: {
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
          }
        }).then(function(result) {
            this.logout();
        }.bind(this));
      }
    }

    // ============ MODAL DE/ACTIVATION =============
    // default variables
    this.showEdit = false;
    this.showDelete = false;
    this.showFullImage = false;

    // toggle switch
    this.modalToggle = function(modal, riv) {
      switch(modal) {
        case 'edit':
          this.showEdit = !this.showEdit;
          break;
        case 'delete':
          this.showDelete = !this.showDelete;
          break;
        case 'image':
          this.showFullImage = !this.showFullImage;
          this.currentRiv = riv;
          break;
      }
    }

    // ================= RIVS ======================
    // default variables
    this.personal = true;
    this.replies = false;
    this.corrections = false;

    // toggle type of riv
    this.toggleRivs = function(filter) {
      switch(filter) {
        case 'personal':
          this.personal = true;
          this.replies = false;
          this.corrections = false;
          break;
        case 'replies':
          this.personal = false;
          this.replies = true;
          this.corrections = false;
          break;
        case 'corrections':
          this.personal = false;
          this.replies = false;
          this.corrections = true;
      }
    }

    // toggle riv actions
    this.toggleAction = function(action, riv) {
      switch(action) {
        case 'reply':
          riv.replyBox = riv.replyBox === true ? false:true;
          riv.correctionBox = false;
          riv.translationBox = false;
          break;
        case 'correction':
          riv.correctionBox = riv.correctionBox === true ? false:true;
          riv.replyBox = false;
          riv.translationBox = false;
          break;
        case 'translate':
          riv.translationBox = riv.translationBox === true ? false:true;
          riv.replyBox = false;
          riv.correctionBox = false;
          break;
      }
    }
    // ================= SIDEBAR ===================
    // default variables
    this.followers = true;
    this.following = false;

    // toggle follower/following
    this.toggleFollow = function(follow) {
      switch(follow) {
        case 'followers':
          this.followers = true;
          this.following = false;
          break;
        case 'following':
          this.followers = false;
          this.following = true;
          break;
      }
    }

    // ========== ETC. DOM MANIPULATION ============
    // scrolls window back to top
    this.goToTop = function() {
      $document.scrollTop(0, 500);
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
            this.findProfileUser();
        }.bind(this));
      }
    }

    // ============ AUTOMATIC FUNCTION CALLS =======
    this.sessionCheck();

  }]); // ends controller

})(); // ends closure
