(function(window, angular) {
  'use strict';

  angular.module('ngToast.directives', ['ngToast.provider'])
    .directive('toast', ['ngToast', '$templateCache', '$log',
      function(ngToast, $templateCache, $log) {
        return {
          replace: true,
          restrict: 'EA',
          template:
            '<div class="ng-toast ng-toast--{{hPos}} ng-toast--{{vPos}} {{animation ? \'ng-toast--animate-\' + animation : \'\'}}">' +
              '<ul class="ng-toast__list">' +
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
    .directive('toastMessage', ['$timeout', '$compile', 'ngToast',
      function($timeout, $compile, ngToast) {
        return {
          replace: true,
          transclude: true,
          priority: 400,
          restrict: 'EA',
          scope: {
            message: '='
          },
          controller: ['$scope', 'ngToast', function($scope, ngToast) {
            $scope.dismiss = function() {
              ngToast.dismiss($scope.message.id);
            };
          }],
          template: _getDefaultTemplate(),
          link: function(scope, element, attrs, ctrl, transclude) {
            if (scope.message.compileContent) {
              var transcludedEl;

              transclude(scope, function(clone) {
                transcludedEl = clone;
                element.children().append(transcludedEl);
              });

              $timeout(function() {
                $compile(transcludedEl.contents())
                  (scope.$parent, function(compiledClone) {
                    transcludedEl.replaceWith(compiledClone);
                  });
              }, 0);
            }

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
    ])
    .directive('toastMessage', ['$timeout', '$compile', '$controller', '$log',
      function($timeout, $compile, $controller, $log) {
        return {
          restrict: 'EA',
          priority: -400,
          link: function (scope, $element) {
            if(scope.message.template && !scope.message.controller) {
              return $log.error('[ngToast] Controller is required is you want to use a custom template');
            }

            if(!scope.message.template && scope.message.controller) {
              return $log.error('[ngToast] Template is required is you want to associating a controller with a toast');
            }

            if(!scope.message.template && !scope.message.controller) {
              return;
            }

            if(scope.message.compileContent) {
              return $log.error('[ngToast] `compileContent` option is incompatible with `controller`. Consider removing it.');
            }

            $element.html(_getDefaultTemplate(scope.message.template));
            var locals = {};
            var link = $compile($element.contents());

            locals.$scope = scope;
            locals.$element = $element;
            $controller(scope.message.controller, locals);

            link(scope);
          }
        };
      }
    ])
  ;

  function _getDefaultTemplate(customContent)
  {
    return ''+
      '<li class="ng-toast__message {{message.additionalClasses}}">' +
        '<div class="alert alert-{{message.className}}" ' +
          'ng-class="{\'alert-dismissible\': message.dismissButton}">' +
          '<button type="button" class="close" ' +
            'ng-if="message.dismissButton" ' +
            'ng-bind-html="message.dismissButtonHtml" ' +
            'ng-click="!message.dismissOnClick && dismiss()">' +
          '</button>' +
          (customContent || '<span ng-if="!message.compileContent" ng-transclude></span>') +
        '</div>' +
      '</li>';
  }

})(window, window.angular);
