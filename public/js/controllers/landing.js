// ================================================
//               LANDING PAGE CTRL               //
// ================================================

(function(){
  const app = angular.module('Rivetr');

  app.controller('LandingCtrl', ['$http', '$rootScope', function($http, $rootScope){

    // =========== CONTROLLER VARIABLES ==============
    const landing = this;
    const URL = 'http://localhost:3000/';
    // const URL = 'http://rivetrapi.herokuapp.com/'

    // =========== HTTP REQUESTS ======================
    // to create a user
    this.register = function(){
      this.newUserData.username = this.newUserData.username.toLowerCase();
      $http({
        method: 'POST',
        url: URL + 'users',
        data: this.newUserData
      }).then(function(response){
          this.loginData = {
            username: response.data.username,
            password: this.newUserData.password
          }
          this.newUserData = null;
          this.login();
      }.bind(this));
    };

    // to create a riv
    this.postRiv = function(){
      $http({
        method: 'POST',
        url: URL + 'rivs',
        data: this.newRivData
      }).then(function(response){
          console.log(response);
      }.bind(this));
    };

    // to login
    this.login = function(){
      this.loginData.username = this.loginData.username.toLowerCase();
      $http({
        method: 'POST',
        url: URL + 'users/login',
        data: { user: this.loginData }
      }).then(function(response){
          localStorage.setItem('token', JSON.stringify(response.data.token));
          localStorage.setItem('user', response.data.user.id);
          this.sessionCheck();
      }.bind(this))
    }

    // ============ MODAL DE/ACTIVATION =============
    // default variables
    this.showRegister = false;
    this.showLogin = false;

    // toggle switch
    this.modalToggle = function(modal) {
      switch(modal) {
        case 'register':
          this.showRegister = !this.showRegister;
          break;
        case 'login':
          this.showLogin = !this.showLogin;
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
