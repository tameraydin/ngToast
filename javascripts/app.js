'use strict';

angular
  .module('ngToastApp', [
    'ngAnimate',
    'ngSanitize',
    'ngToast'
  ])
  .config(['ngToastProvider', function(ngToast) {
    ngToast.configure({
      // verticalPosition: 'bottom',
      // horizontalPosition: 'center'
    });
  }])
  .controller('MainController', function($scope, ngToast, $timeout) {
    $timeout(function() {
      ngToast.create({
        content:'<strong>ngToast</strong>: a simple Angular provider for toast notifications!',
        dismissOnTimeout: false,
        dismissButton: true,
        dismissOnClick: false
      });
    }, 1000)

    var TYPE = [
      'info',
      'warning',
      'danger',
      'success'
    ];
    var MESSAGE = [
      'a toast message...',
      'another toast message...',
      'sample toast message by <a href="#" class="alert-link">ngToast</a>'
    ];
    var cType = 0;
    var cMessage = 0;

    $scope.showSample = function() {
      ngToast.create({
        content: MESSAGE[cMessage],
        class: TYPE[cType]
      });
      cType++;
      if (cType > 3) cType = 0;
      cMessage++;
      if (cMessage > 2) cMessage = 0;
    };
  });
