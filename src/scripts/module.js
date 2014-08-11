(function(window, angular, undefined) {
  'use strict';

  angular
    .module('ngToast', [
      'ngAnimate',
      'ngSanitize',
      'ngToast.directives',
      'ngToast.provider'
    ]);

})(window, window.angular);
