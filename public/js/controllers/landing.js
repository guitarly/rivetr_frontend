// ================================================
//               LANDING PAGE CTRL               //
// ================================================

(function(){
  const app = angular.module('Rivetr');

  app.controller('LandingCtrl', ['$http', '$rootScope', function($http, $rootScope){

    // =========== CONTROLLER VARIABLES ==============
    const landing = this;
    if(window.location.href == 'http://localhost:8000/#!/'){
      var URL = 'http://localhost:3000/';
    } else {
      var URL = 'herokulater'
    };

    // =========== HTTP REQUESTS ======================
    // to create a user
    this.register = function(){
      $http({
        method: 'POST',
        url: URL + 'users',
        data: this.newUserData
      }).then(function(err, result){
          if(err){
            console.log(err);
          } else {
            console.log(this.newUserData);
            this.loginData = {
              username: result.data.username,
              password: this.newUserData.password
            }
          }
      }.bind(this));
    };

    // to create a riv
    this.postRiv = function(){
      $http({
        method: 'POST',
        url: URL + 'rivs',
        data: this.newRivData
      }).then(function(result){
          console.log(result);
      }.bind(this));
    };

    // to login
    this.login = function(){
      $http({
        method: 'POST',
        url: URL + 'users/login',
        data: { user: this.loginData }
      }).then(function(result){
          localStorage.setItem('token', JSON.stringify(result.data.token));
          localStorage.setItem('user', result.data.user.id);
          this.sessionCheck();
      }.bind(this))
    }

    // ============ MODAL DE/ACTIVATION =============
    // default variables
    this.showRegister = false;

    // toggle switch
    this.modalToggle = function(modal) {
      switch(modal) {
        case 'register':
          this.showRegister = !this.showRegister;
          break;
      }
    }

    // ============ LOGOUT AND SESSIONS =============
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
