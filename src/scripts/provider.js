(function(window, angular, undefined) {
  'use strict';

  angular.module('ngToast.provider', [])
    .provider('ngToast', [
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
          onDismiss: null,
          compileContent: false,
          combineDuplications: false,
          horizontalPosition: 'right', // right, center, left
          verticalPosition: 'top', // top, bottom,
          maxNumber: 0,
          newestOnTop: true
        };

        function Message(msg) {
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
          this.onDismiss = defaults.onDismiss;
          this.compileContent = defaults.compileContent;

          angular.extend(this, msg);
        }

        this.configure = function(config) {
          angular.extend(defaults, config);
        };

        this.$get = [function() {
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
              messages[defaults.newestOnTop ? 'unshift' : 'push'](newMsg);
              messageStack.push(newMsg.id);

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
