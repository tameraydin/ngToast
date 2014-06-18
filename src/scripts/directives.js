'use strict';

angular.module('ngToast.directives', ['ngToast.provider'])
  .directive('ngToast', ['ngToast',
    function(ngToast) {
      return {
        replace: true,
        restrict: 'E',
        template:
          '<div class="ng-toast ng-toast--{{hPos}} ng-toast--{{vPos}}">' +
            '<ul class="ng-toast__list">' +
              '<ng-toast-message ng-repeat="message in messages" ' +
                'message="message">' +
                '<span ng-bind-html="message.content"></span>' +
              '</ng-toast-message>' +
            '</ul>' +
          '</div>',
        link: function(scope) {
          scope.hPos = ngToast.settings.horizontalPosition;
          scope.vPos = ngToast.settings.verticalPosition;
          scope.messages = ngToast.messages;
        }
      };
    }
  ])
  .directive('ngToastMessage', ['$timeout', 'ngToast',
    function($timeout, ngToast) {
      return {
        replace: true,
        transclude: true,
        restrict: 'E',
        scope: {
          message: '='
        },
        controller: ['$scope', 'ngToast', function($scope, ngToast) {
          $scope.dismiss = function() {
            ngToast.dismiss($scope.message.id);
          };
        }],
        template:
          '<li class="ng-toast__message">' +
            '<div class="alert alert-{{message.class}}" ' +
              'ng-class="{\'alert-dismissable\': message.dismissButton}">' +
              '<button type="button" class="close" ' +
                'ng-if="message.dismissButton" ' +
                'ng-bind-html="message.dismissButtonHtml" ' +
                'ng-click="!message.dismissOnClick && dismiss()">' +
              '</button>' +
              '<span ng-transclude></span>' +
            '</div>' +
          '</li>',
        link: function(scope, element) {
          if (scope.message.dismissOnTimeout) {
            $timeout(function() {
              ngToast.dismiss(scope.message.id);
            }, scope.message.timeout);
          }

          if (scope.message.dismissOnClick) {
            element.bind('click', function() {
              ngToast.dismiss(scope.message.id);
              scope.$apply();
            });
          }
        }
      };
    }
  ]);
