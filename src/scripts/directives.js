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
