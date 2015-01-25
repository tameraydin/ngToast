'use strict';

describe('ngToast:', function() {

  describe('service:', function() {
    var ngToast;

    beforeEach(function () {
      module('ngToast.provider');
    });

    beforeEach(inject(function (_ngToast_) {
      ngToast = _ngToast_;
    }));

    it('initial values should be set', function () {
      expect(ngToast.messages).toEqual([]);
      expect(ngToast.settings).not.toEqual({});
    });

    it('create should work', function () {
      ngToast.create('toast1');
      expect(ngToast.messages.length).toBe(1);
      expect(ngToast.messages[0].content).toBe('toast1');

      ngToast.create({content: 'toast2'});
      expect(ngToast.messages.length).toBe(2);
      expect(ngToast.messages[1].content).toBe('toast2');
    });

    it('create should work in reverse order when vertical position is set as bottom', function () {
      ngToast.create('toast1');

      ngToast.settings.verticalPosition = 'bottom';
      ngToast.create('toast2');
      expect(ngToast.messages.length).toBe(2);
      expect(ngToast.messages[0].content).toBe('toast2');
    });

    it('create should dismiss first message when reached to max limit', function () {
      ngToast.settings.maxNumber = 2;
      ngToast.create('toast1');
      ngToast.create('toast2');

      ngToast.create('toast3');
      expect(ngToast.messages.length).toBe(2);
      expect(ngToast.messages[0].content).toBe('toast2');
    });

    it('dismiss should work', function () {
      var toast1 = ngToast.create('toast1');
      var toast2 = ngToast.create('toast2');

      ngToast.dismiss(-1); // non-existent id
      expect(ngToast.messages.length).toBe(2);
      expect(ngToast.messages[0].content).toBe('toast1');

      ngToast.dismiss(toast1);
      expect(ngToast.messages.length).toBe(1);
      expect(ngToast.messages[0].content).toBe('toast2');

      ngToast.dismiss(toast2);
      expect(ngToast.messages.length).toBe(0);
    });

    it('dismiss all should work', function () {
      ngToast.create('toast1');
      ngToast.create('toast2');
      ngToast.create('toast3');

      ngToast.dismiss();
      expect(ngToast.messages.length).toBe(0);
    });
  });

  describe('service configuration:', function() {
    beforeEach(module('ngToast.provider', function(ngToastProvider) {
      ngToastProvider.configure({
        className: "info",
        timeout: 3000,
        dismissButton: true,
        maxNumber: 3
      });
    }));

    it('should respect config values', inject(function(ngToast) {
      expect(ngToast.settings.className).toBe("info");
      expect(ngToast.settings.timeout).toBe(3000);
      expect(ngToast.settings.dismissButton).toBe(true);
      expect(ngToast.settings.maxNumber).toBe(3);
    }));
  });
});
