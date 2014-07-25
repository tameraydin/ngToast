'use strict';

describe('ngToast:', function() {

  describe('directive:', function() {
    var ngToast;

    beforeEach(function () {
      module('ngToast.provider');
    });

    beforeEach(inject(function (_ngToast_, $window) {
      ngToast = _ngToast_;
    }));

    //TODO: button should work although dismissOnClick
  });
});
