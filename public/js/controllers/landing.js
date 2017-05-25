// ================================================
//               LANDING PAGE CTRL               //
// ================================================

(function(){
  var app = angular.module('Rivetr');

  app.controller('LandingCtrl', ['$http', '$rootScope', function($http, $rootScope){

    // =========== CONTROLLER VARIABLES ==============
    const landing = this;
    if(window.location.href == 'http://localhost:8000/#!/'){
      var URL = 'http://localhost:3000/';
    } else {
      var URL = 'herokulater'
    };

    // =========== HTTP REQS ==========================
    // to create a user
    this.register = function(){
      $http({
        method: 'POST',
        url: URL + 'users',
        data: this.newUserData
      }).then(function(result){
          console.log(result);
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

  }]); // ends controller

})(); // ends closure
