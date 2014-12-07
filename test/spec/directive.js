'use strict';

describe('toast:', function() {

  describe('directive:', function() {
    var toast;

    beforeEach(function () {
      module('toast.provider');
    });

    beforeEach(inject(function (_toast_, $window) {
      toast = _toast_;
    }));

    //TODO: button should work although dismissOnClick
  });
});
