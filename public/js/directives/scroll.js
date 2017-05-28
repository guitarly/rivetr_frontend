// const app = angular.module('Rivetr');
//
// app.directive('scrollPos', function($window) {
//   return {
//     scope: {
//       scroll: '=scrollPos'
//     },
//     link: function(scope, element, attrs) {
//       var windowEl = angular.element($window);
//       var handler = function() {
//         scope.scroll = windowEl.scrollTop();
//       }
//       windowEl.on('scroll', scope.$apply.bind(scope, handler));
//       handler();
//     }
//   }
// });
