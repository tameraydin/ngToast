(function(window, angular, undefined) {
  'use strict';

  angular.module('toast.directives', ['toast.provider'])
    .directive('toast', ['toast', '$templateCache', '$log',
      function(toast, $templateCache, $log) {
        return {
          replace: true,
          restrict: 'E',
          template:
            '<div class="toast toast--{{hPos}} toast--{{vPos}}">' +
              '<ul class="toast__list">' +
                '<toast-message ng-repeat="message in messages" ' +
                  'message="message">' +
                  '<span ng-bind-html="message.content"></span>' +
                '</toast-message>' +
              '</ul>' +
            '</div>',
          compile: function(tElem, tAttrs) {
            if (tAttrs.template) {
              var template = $templateCache.get(tAttrs.template);
              if (template) {
                tElem.replaceWith(template);
              } else {
                $log.warn('toast: Provided template could not be loaded. ' +
                  'Please be sure that it is populated before the <toast> element is represented.');
              }
            }

            return function(scope) {
              scope.hPos = toast.settings.horizontalPosition;
              scope.vPos = toast.settings.verticalPosition;
              scope.messages = toast.messages;
            };
          }
        };
      }
    ])
    .directive('toastMessage', ['$timeout', 'toast',
      function($timeout, toast) {
        return {
          replace: true,
          transclude: true,
          restrict: 'E',
          scope: {
            message: '='
          },
          controller: ['$scope', 'toast', function($scope, toast) {
            $scope.dismiss = function() {
              toast.dismiss($scope.message.id);
            };
          }],
          template:
            '<li class="toast__message">' +
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
                toast.dismiss(scope.message.id);
              }, scope.message.timeout);
            }

            if (scope.message.dismissOnClick) {
              element.bind('click', function() {
                toast.dismiss(scope.message.id);
                scope.$apply();
              });
            }
          }
        };
      }
    ]);

})(window, window.angular);
