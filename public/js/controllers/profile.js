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
    const profile = this;
    // const URL = 'http://localhost:3000/';
    const URL = 'http://rivetrapi.herokuapp.com/'
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
            console.log('checking follows');
            $rootScope.currentUser.followed_follows.forEach(function(followed) {
              if(followed.followed.id === profile.profileUser.id) {
                profile.followed = true;
                profile.followedId = followed.id;
              }
            });
            $rootScope.currentUser.likes.forEach(function(liked) {
              profile.profileUser.rivs.forEach(function(riv) {
                if(liked.riv_id === riv.id) {
                  riv.liked = true;
                }
              })
              profile.profileUser.replies.forEach(function(reply) {
                if(liked.reply_id === reply.id) {
                  reply.liked = true;
                }
              })
            })
          }
      }.bind(this))
    }

    // to edit user
    this.editUser = function(){
      if(this.profileUser.id === $rootScope.currentUser.id) {
        if(!this.profileUser.username || !this.profileUser.password) {
          profile.editErrorMessage = "username and password required";
        } else {
          this.editErrorMessage = null;
          this.profileUser.username = this.profileUser.username.toLowerCase();
          $http({
            method: 'PUT',
            url: URL + 'users/' + this.profileUser.id,
            data: this.profileUser,
            headers: {
              'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
            }
          }).then(function(response){
              this.showEdit = false;
              this.sessionCheck();
          }.bind(this));
        }
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
          this.followed = true;
          this.sessionCheck();
      }.bind(this))
    }

    // to unfollow a user
    this.unfollowUser = function() {
      $http({
        method: 'DELETE',
        url: URL + 'follows/' + this.followedId
      }).then(function(response) {
          this.followed = false;
          this.sessionCheck();
      }.bind(this));
    }

    // to delete a single riv
    this.deleteOneRiv = function(riv) {
      if(this.profileUser.id === $rootScope.currentUser.id) {
        riv.likes.forEach(function(like) {
          profile.deleteAssociatedLikes(like);
        })
        $http({
          method: 'DELETE',
          url: URL + 'rivs/' + riv.id
        }).then(function(response) {
            this.sessionCheck();
        }.bind(this))
      }
    }

    // to delete a single reply
    this.deleteOneReply = function(reply) {
      if(this.profileUser.id === $rootScope.currentUser.id) {
        reply.likes.forEach(function(like) {
          profile.deleteAssociatedLikes(like)
        })
        $http({
          method: 'DELETE',
          url: URL + 'replies/' + reply.id
        }).then(function(response) {
            this.sessionCheck();
        }.bind(this))
      }
    }

    // to delete associated likes
    this.deleteAssociatedLikes = function(like) {
      $http({
        method: 'DELETE',
        url: URL + 'likes/' + like.id
      }).then(function(response) {
          console.log(like);
          console.log(response);
      });
    }

    // to favorite a riv/reply
    this.favoriteRivReply = function(type, user, riv) {
      switch(type) {
        case 'riv':
          if(!riv.liked) {
            $http({
              method: 'POST',
              url: URL + 'likes',
              data: {
                user_id: user,
                riv_id: riv.id
              }
            }).then(function(response) {
              riv.liked = true;
            })
          } else if(riv.liked) {
            $rootScope.currentUser.likes.forEach(function(liked) {
              if(liked.riv_id === riv.id) {
                $http({
                  method: 'DELETE',
                  url: URL + 'likes/' + liked.id
                }).then(function(response) {
                    console.log(response);
                    riv.liked = false;
                })
              }
            })
          }
          break;
        case 'reply':
          if(!riv.liked) {
            $http({
              method: 'POST',
              url: URL + 'likes',
              data: {
                user_id: user,
                reply_id: riv.id
              }
            }).then(function(response) {
                riv.liked = true;
            })
          } else if(riv.liked) {
            $rootScope.currentUser.likes.forEach(function(liked) {
              if(liked.reply_id === riv.id) {
                $http({
                  method: 'DELETE',
                  url: URL + 'likes/' + liked.id
                }).then(function(response) {
                    console.log(response);
                    riv.liked = false;
                })
              }
            })
          }
          break;
      }
    }

    // to send a reply
    this.sendReply = function(type, user, riv) {
      switch(type) {
        case 'reply':
          $http({
            method: 'POST',
            url: URL + 'replies',
            data: {
              user_id: user,
              riv_id: riv.id,
              content: profile.replyData.content,
              photo: profile.replyData.photo
            }
          }).then(function(response) {
              riv.replyBox = false;
          }.bind(this));
          break;
        case 'correction':
          $http({
            method: 'POST',
            url: URL + 'replies',
            data: {
              user_id: user,
              riv_id: riv.id,
              content: profile.correctionData.content,
              photo: profile.correctionData.photo,
              explanation: profile.correctionData.explanation,
              correction: true
            }
          }).then(function(response) {
              riv.correctionBox = false;
          }.bind(this));
          break;
      }
    }

    // gets languages available
    this.getLanguages = function() {
      $http({
        method: 'GET',
        url: 'http://transltr.org/api/getlanguagesfortranslate'
      }).then(function(response){
          this.languages =  response.data;
      }.bind(this))
    }

    // to translate
    this.translateText = function() {
      // sets variables for url params
      let text = this.translate.text;
      let from = this.translate.from;
      let to = this.translate.to;
      // sends request to translatr
      $http({
        method: 'GET',
        url: 'http://transltr.org/api/translate?text=' + text + '&to=' + to + '&from=' + from,
      }).then(function(response){
        this.translate.translated = true;
        this.translate.translatedText = response.data.translationText;
      }.bind(this))
    }

    // finds a riv
    this.findRiv = function(riv) {
      $http({
        method: 'GET',
        url: URL + 'rivs/' + riv.id
      }).then(function(response){
          this.detailedRiv = response.data;
          this.detailedRiv.isReply = false;
      }.bind(this))
    }

    // find a reply
    this.findReply = function(reply) {
      $http({
        method: 'GET',
        url: URL + 'replies/' + reply.id
      }).then(function(response) {
          this.detailedRiv = response.data;
          this.detailedRiv.isReply = true;
      }.bind(this))
    }

    // ============ MODAL DE/ACTIVATION =============
    // default variables
    this.showEdit = false;
    this.showDelete = false;
    this.showFullImage = false;
    this.showDetails = false;

    // toggle switch
    this.modalToggle = function(modal, riv, page) {
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
        case 'details':
          this.showDetails = !this.showDetails;
          if(page === 'personal') {
            this.findRiv(riv);
          } else if(page === 'replies') {
            this.findReply(riv);
          }
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
          // sets ng-model to populate translation box
          this.translate = {};
          this.translate.text = riv.content;
          // opens translation box
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
            this.findProfileUser();
        }.bind(this));
      }
    }

    // ============ AUTOMATIC FUNCTION CALLS =======
    this.sessionCheck();
    this.getLanguages();

  }]); // ends controller

})(); // ends closure
