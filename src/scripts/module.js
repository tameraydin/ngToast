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
