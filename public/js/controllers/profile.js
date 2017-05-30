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
          if(this.profileUser.id === $rootScope.currentUser.id) {
            this.isCurrentUser = true;
          } else {
            $rootScope.currentUser.followed_follows.forEach(function(followed) {
              if(followed.followed.id === landing.profileUser.id) {
                landing.followed = true;
              }
            });
          }
      }.bind(this))
    }

    // to edit user
    this.editUser = function(){
      if(this.profileUser.id === $rootScope.currentUser.id) {
        this.profileUser.username = this.profileUser.username.toLowerCase();
        $http({
          method: 'PUT',
          url: URL + 'users/' + this.profileUser.id,
          data: this.profileUser,
          headers: {
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
          }
        }).then(function(response){
            $location.path('/' + response.data.username);
        }.bind(this));
      }
    };

    // to start delete user chain
    this.deleteChain = function() {
      if(this.profileUser.id === $rootScope.currentUser.id) {
        this.deleteFollows();
        this.deleteRivs();
        this.deleteLikes();
        this.deleteReplies();
        this.deleteUser();
      }
    }

    // to delete all of a users follows
    this.deleteFollows = function() {
      if(this.profileUser.follower_follows.length > 0 || this.profileUser.followed_follows.length > 0) {
        // deletes followers
        this.profileUser.follower_follows.forEach(function(follow) {
          $http({
            method: 'DELETE',
            url: URL + 'follows/' + follow.id
          }).then(function(response) {});
        });
        // deletes following
        this.profileUser.followed_follows.forEach(function(follow) {
          $http({
            method: 'DELETE',
            url: URL + 'follows/' + follow.id
          }).then(function(response) {});
        });
      }
    }

    // to delete all rivs
    this.deleteRivs = function() {
      if(this.profileUser.rivs.length > 0) {
        this.profileUser.rivs.forEach(function(riv) {
          $http({
            method: 'DELETE',
            url: URL + 'rivs/' + riv.id
          }).then(function(response) {});
        })
      }
    }

    // to delete likes
    this.deleteLikes = function() {
      if(this.profileUser.likes.length > 0) {
        this.profileUser.likes.forEach(function(like) {
          $http({
            method: 'DELETE',
            url: URL + 'likes/' + like.id
          }).then(function(response) {});
        })
      }
    }

    // to delete replies
    this.deleteReplies = function() {
      if(this.profileUser.replies.length > 0) {
        this.profileUser.replies.forEach(function(reply) {
          $http({
            method: 'DELETE',
            url: URL + 'replies/' + reply.id
          }).then(function(response) {});
        })
      }
    }

    // to delete user
    this.deleteUser = function() {
      $http({
        method: 'DELETE',
        url: URL + 'users/' + this.profileUser.id,
        headers: {
          'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
        }
      }).then(function(response) {
          console.log(response);
          this.logout();
      }.bind(this));
    }

    // to follow user
    this.followUser = function(follower, following) {
      $http({
        method: 'POST',
        url: URL + 'follows',
        data: {
          follower_id: follower,
          followed_id: following
        }
      }).then(function(response) {
          location.reload();
      })
    }

    // to delete a single riv
    this.deleteOneRiv = function(id) {
      if(this.profileUser.id === $rootScope.currentUser.id) {
        $http({
          method: 'DELETE',
          url: URL + 'rivs/' + id
        }).then(function(response) {
            location.reload();
        })
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
