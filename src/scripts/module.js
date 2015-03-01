(function(window, angular) {
  'use strict';

  angular
    .module('ngToast', [
      'ngSanitize',
      'ngToast.directives',
      'ngToast.provider'
    ]);

})(window, window.angular);
