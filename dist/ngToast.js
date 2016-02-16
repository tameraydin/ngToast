/*!
 * ngToast v1.5.6 (http://tameraydin.github.io/ngToast)
 * Copyright 2016 Tamer Aydin (http://tamerayd.in)
 * Licensed under  ()
 */
(function(window, angular, undefined) {
  'use strict';

  var module = angular.module('ngToast.provider', []);
  module.provider('ngToast', [
    function() {
      var messages = [],
          messageStack = [];

      var defaults = {
        animation: false,
        className: 'success',
        additionalClasses: null,
        dismissOnTimeout: true,
        timeout: 4000,
        dismissButton: false,
        dismissButtonHtml: '&times;',
        dismissOnClick: true,
        compileContent: false,
        combineDuplications: false,
        horizontalPosition: 'right', // right, center, left
        verticalPosition: 'top', // top, bottom,
        maxNumber: 0
      };

      var Message = function(msg) {
        var id = Math.floor(Math.random()*1000);
        while (messages.indexOf(id) > -1) {
          id = Math.floor(Math.random()*1000);
        }

        this.id = id;
        this.count = 0;
        this.animation = defaults.animation;
        this.className = defaults.className;
        this.additionalClasses = defaults.additionalClasses;
        this.dismissOnTimeout = defaults.dismissOnTimeout;
        this.timeout = defaults.timeout;
        this.dismissButton = defaults.dismissButton;
        this.dismissButtonHtml = defaults.dismissButtonHtml;
        this.dismissOnClick = defaults.dismissOnClick;
        this.compileContent = defaults.compileContent;

        angular.extend(this, msg);
      };

      this.configure = function(config) {
        angular.extend(defaults, config);
      };

      this.$get = ['$rootScope', function($rootScope) {
        var _createWithClassName = function(className, msg) {
          msg = (typeof msg === 'object') ? msg : {content: msg};
          msg.className = className;

          return this.create(msg);
        };

        return {
          settings: defaults,
          messages: messages,
          dismiss: function(id) {
            if (id) {
              for (var i = messages.length - 1; i >= 0; i--) {
                if (messages[i].id === id) {
                  messages.splice(i, 1);
                  messageStack.splice(messageStack.indexOf(id), 1);
                  $rootScope.$broadcast('ngToast:update');
                  return;
                }
              }

            } else {
              while(messages.length > 0) {
                messages.pop();
              }
              messageStack = [];
              $rootScope.$broadcast('ngToast:update');
            }
          },
          create: function(msg) {
            msg = (typeof msg === 'object') ? msg : {content: msg};

            if (defaults.combineDuplications) {
              for (var i = messageStack.length - 1; i >= 0; i--) {
                var _msg = messages[i];
                var _className = msg.className || 'success';

                if (_msg.content === msg.content &&
                    _msg.className === _className) {
                  messages[i].count++;
                  return;
                }
              }
            }

            if (defaults.maxNumber > 0 &&
                messageStack.length >= defaults.maxNumber) {
              this.dismiss(messageStack[0]);
            }

            var newMsg = new Message(msg);
            if (defaults.verticalPosition === 'bottom') {
              messages.unshift(newMsg);
            } else {
              messages.push(newMsg);
            }
            messageStack.push(newMsg.id);
            $rootScope.$broadcast('ngToast:update');
            return newMsg.id;
          },
          success: function(msg) {
            return _createWithClassName.call(this, 'success', msg);
          },
          info: function(msg) {
            return _createWithClassName.call(this, 'info', msg);
          },
          warning: function(msg) {
            return _createWithClassName.call(this, 'warning', msg);
          },
          danger: function(msg) {
            return _createWithClassName.call(this, 'danger', msg);
          }
        };
      }];
    }
  ]);

})(window, window.angular);

(function(window, angular) {
  'use strict';

  angular.module('ngToast.directives', ['ngToast.provider'])
    .run(['$templateCache',
      function($templateCache) {
        $templateCache.put('ngToast/toast.html',
          '<div class="ng-toast ng-toast--{{hPos}} ng-toast--{{vPos}} {{animation ? \'ng-toast--animate-\' + animation : \'\'}}">' +
            '<ul class="ng-toast__list">' +
              '<toast-message ng-repeat="message in messages" ' +
                'message="message" count="message.count">' +
                '<span ng-bind-html="message.content"></span>' +
              '</toast-message>' +
            '</ul>' +
          '</div>');
        $templateCache.put('ngToast/toastMessage.html',
          '<li class="ng-toast__message {{message.additionalClasses}}"' +
            'ng-mouseenter="onMouseEnter()"' +
            'ng-mouseleave="onMouseLeave()">' +
            '<div class="alert alert-{{message.className}}" ' +
              'ng-class="{\'alert-dismissible\': message.dismissButton}">' +
              '<button type="button" class="close" ' +
                'ng-if="message.dismissButton" ' +
                'ng-bind-html="message.dismissButtonHtml" ' +
                'ng-click="!message.dismissOnClick && dismiss()">' +
              '</button>' +
              '<span ng-if="count" class="ng-toast__message__count">' +
                '{{count + 1}}' +
              '</span>' +
              '<span ng-if="!message.compileContent" ng-transclude></span>' +
            '</div>' +
          '</li>');
      }
    ])
    .directive('toast', ['ngToast', '$templateCache', '$log',
      function(ngToast, $templateCache, $log) {
        return {
          replace: true,
          restrict: 'EA',
          templateUrl: 'ngToast/toast.html',
          compile: function(tElem, tAttrs) {
            if (tAttrs.template) {
              var template = $templateCache.get(tAttrs.template);
              if (template) {
                tElem.replaceWith(template);
              } else {
                $log.warn('ngToast: Provided template could not be loaded. ' +
                  'Please be sure that it is populated before the <toast> element is represented.');
              }
            }

            return function(scope) {
              scope.hPos = ngToast.settings.horizontalPosition;
              scope.vPos = ngToast.settings.verticalPosition;
              scope.animation = ngToast.settings.animation;
              scope.messages = ngToast.messages;

              scope.$on('ngToast:update', function() {
                scope.$applyAsync();
              });
            };
          }
        };
      }
    ])
    .directive('toastMessage', ['$timeout', '$compile', '$templateRequest', '$controller', '$rootScope', 'ngToast',
      function($timeout, $compile, $templateRequest, $controller, $rootScope, ngToast) {
        return {
          replace: true,
          transclude: true,
          restrict: 'EA',
          scope: {
            message: '=',
            count: '='
          },
          controller: ['$scope', 'ngToast', function($scope, ngToast) {
            $scope.dismiss = function() {
              ngToast.dismiss($scope.message.id);
            };
          }],
          templateUrl: 'ngToast/toastMessage.html',
          link: function(scope, element, attrs, ctrl, transclude) {
            element.attr('data-message-id', scope.message.id);

            var dismissTimeout;
            var templateUrl = scope.message.templateUrl;
            var scopeToBind = scope.message.compileContent;

            // Default scope for templates
            if (templateUrl && !scopeToBind) {
              scopeToBind = $rootScope.$new(true);
            }

            scope.cancelTimeout = function() {
              $timeout.cancel(dismissTimeout);
            };

            scope.startTimeout = function() {
              if (scope.message.dismissOnTimeout) {
                dismissTimeout = $timeout(function() {
                  ngToast.dismiss(scope.message.id);
                }, scope.message.timeout);
              }
            };

            scope.onMouseEnter = function() {
              scope.cancelTimeout();
            };

            scope.onMouseLeave = function() {
              scope.startTimeout();
            };

            if (scopeToBind) {
              var transcludedEl;

              transclude(scope, function(clone) {
                transcludedEl = clone;
                element.children().append(transcludedEl);
              });

              var doLink = function(contents) {
                var template = angular.element(contents);
                // element.append(template);
                var linkFn = $compile(template);
                var linkedScope = typeof scopeToBind === 'boolean' ?
                    scope.$parent : scopeToBind;
                var cloneConnectFn = function(compiledClone) {
                  transcludedEl.replaceWith(compiledClone);
                };
                var controller = scope.message.controller;
                var linkOpts = {};
                if (controller) {
                  linkOpts.transcludeControllers = {};
                  var locals = angular.extend({
                    $scope: linkedScope
                  }, scope.message.locals);
                  linkOpts.transcludeControllers[controller] = $controller(controller, locals);
                }
                linkFn(linkedScope, cloneConnectFn, linkOpts);
              };

              if (templateUrl) {
                $templateRequest(templateUrl).then(function(templateHtml) {
                  return doLink(templateHtml);
                });
              } else {
                $timeout(function() {
                  doLink(transcludedEl.contents());
                }, 0);
              }
            }

            scope.startTimeout();

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

})(window, window.angular);

(function(window, angular) {
  'use strict';

  angular
    .module('ngToast', [
      'ngSanitize',
      'ngToast.directives',
      'ngToast.provider'
    ]);

})(window, window.angular);
