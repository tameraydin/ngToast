/*!
 * toast v1.2.1 (http://tameraydin.github.io/toast)
 * Copyright 2014 Tamer Aydin
 * Licensed under MIT (http://tameraydin.mit-license.org/)
 */
(function(window, angular, undefined) {
  'use strict';

  angular.module('toast.provider', [])
    .provider('toast', [
      function() {
        var messages = [],
            messageStack = [];

        var defaults = {
          class: 'success',
          dismissOnTimeout: true,
          timeout: 4000,
          dismissButton: false,
          dismissButtonHtml: '&times;',
          dismissOnClick: true,
          horizontalPosition: 'right', // right, center, left
          verticalPosition: 'top', // top, bottom,
          maxNumber: 0
        };

        function Message(msg) {
          var id = Math.floor(Math.random()*1000);
          while (messages.indexOf(id) > -1) {
            id = Math.floor(Math.random()*1000);
          }

          this.id = id;
          this.class = defaults.class;
          this.dismissOnTimeout = defaults.dismissOnTimeout;
          this.timeout = defaults.timeout;
          this.dismissButton = defaults.dismissButton;
          this.dismissButtonHtml = defaults.dismissButtonHtml;
          this.dismissOnClick = defaults.dismissOnClick;

          angular.extend(this, msg);
        }

        this.configure = function(config) {
          angular.extend(defaults, config);
        };

        this.$get = [function() {
          return {
            settings: defaults,
            messages: messages,
            dismiss: function(id) {
              if (id) {
                for (var i = messages.length - 1; i >= 0; i--) {
                  if (messages[i].id === id) {
                    messages.splice(i, 1);
                    messageStack.splice(messageStack.indexOf(id), 1);
                    return;
                  }
                }

              } else {
                while(messages.length > 0) {
                  messages.pop();
                }
                messageStack = [];
              }
            },
            create: function(msg) {
              if (defaults.maxNumber > 0 &&
                  messageStack.length >= defaults.maxNumber) {
                this.dismiss(messageStack[0]);
              }

              msg = (typeof msg === 'string') ? {content: msg} : msg;

              var newMsg = new Message(msg);
              if (defaults.verticalPosition === 'bottom') {
                messages.unshift(newMsg);
              } else {
                messages.push(newMsg);
              }
              messageStack.push(newMsg.id);
              return newMsg.id;
            }
          };
        }];
      }
    ]);

})(window, window.angular);

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

(function(window, angular, undefined) {
  'use strict';

  angular
    .module('toast', [
      'ngAnimate',
      'ngSanitize',
      'toast.directives',
      'toast.provider'
    ]);

})(window, window.angular);
