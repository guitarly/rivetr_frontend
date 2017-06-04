// ================================================
//               LANDING PAGE CTRL               //
// ================================================

(function(){
  const app = angular.module('Rivetr');

  app.controller('LandingCtrl', ['$http', '$rootScope', '$location', function($http, $rootScope, $location){

    // =========== CONTROLLER VARIABLES ==============
    const landing = this;
    // const URL = 'http://localhost:3000/';
    const URL = 'http://rivetrapi.herokuapp.com/'

    // =========== HTTP REQUESTS ======================
    // to create a user
    this.register = function(){
      if(!this.newUserData || !this.newUserData.username || !this.newUserData.password || !this.newUserData.language_known || !this.newUserData.language_learning) {
        landing.registrationErrorMessage = "everything with * required!";
      } else {
        this.registrationErrorMessage = null;
        this.newUserData.username = this.newUserData.username.toLowerCase();
        if(!this.newUserData.profile_photo) {
          this.newUserData.profile_photo = '../../img/default_icon.png';
        }
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
      }
    };

    // to login
    this.login = function(){
      this.loginData.username = this.loginData.username.toLowerCase();
      this.loginError = null;
      $http({
        method: 'POST',
        url: URL + 'users/login',
        data: { user: this.loginData }
      }).then(function(response){
          if(response.data.status === 401) {
            this.loginError = response.data.message;
          } else {
            localStorage.setItem('token', JSON.stringify(response.data.token));
            localStorage.setItem('user', response.data.user.id);
            this.loginData = null;
            this.showLogin = false;
            this.sessionCheck();
            $location.path('/h/home');
          }
      }.bind(this))
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

    // ============ MODAL DE/ACTIVATION =============
    // default variables
    this.showRegister = false;
    this.showLogin = false;

    // toggle switch
    this.modalToggle = function(modal) {
      switch(modal) {
        case 'register':
          this.showRegister = !this.showRegister;
          this.newUserData.language_learning = 'LANGUAGE LEARNING';
          this.newUserData.language_known = 'LANGUAGE KNOWN';
          this.loginError = null;
          break;
        case 'login':
          this.showLogin = !this.showLogin;
          this.loginError = null;
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

    // ============ AUTOMATIC FUNCTION CALLS =======
    this.sessionCheck();
    this.getLanguages();

  }]); // ends controller

})(); // ends closure
