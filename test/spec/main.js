'use strict';

describe('ngToast:', function() {
  var ngToast;

  beforeEach(function () {
    module('ngToast.provider');
  });

  beforeEach(inject(function (_ngToast_, $window) {
    ngToast = _ngToast_;
  }));

  it('initial values should be set', function () {
    expect(ngToast.messages).toEqual([]);
  });

  //TODO: button should work although dismissOnClick
});
