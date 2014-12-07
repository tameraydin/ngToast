'use strict';

describe('toast:', function() {

  describe('service:', function() {
    var toast;

    beforeEach(function () {
      module('toast.provider');
    });

    beforeEach(inject(function (_toast_) {
      toast = _toast_;
    }));

    it('initial values should be set', function () {
      expect(toast.messages).toEqual([]);
      expect(toast.settings).not.toEqual({});
    });

    it('create should work', function () {
      toast.create('toast1');
      expect(toast.messages.length).toBe(1);
      expect(toast.messages[0].content).toBe('toast1');

      toast.create({content: 'toast2'});
      expect(toast.messages.length).toBe(2);
      expect(toast.messages[1].content).toBe('toast2');
    });

    it('create should work in reverse order when vertical position is set as bottom', function () {
      toast.create('toast1');

      toast.settings.verticalPosition = 'bottom';
      toast.create('toast2');
      expect(toast.messages.length).toBe(2);
      expect(toast.messages[0].content).toBe('toast2');
    });

    it('create should dismiss first message when reached to max limit', function () {
      toast.settings.maxNumber = 2;
      toast.create('toast1');
      toast.create('toast2');

      toast.create('toast3');
      expect(toast.messages.length).toBe(2);
      expect(toast.messages[0].content).toBe('toast2');
    });

    it('dismiss should work', function () {
      var toast1 = toast.create('toast1');
      var toast2 = toast.create('toast2');

      toast.dismiss(-1); // non-existent id
      expect(toast.messages.length).toBe(2);
      expect(toast.messages[0].content).toBe('toast1');

      toast.dismiss(toast1);
      expect(toast.messages.length).toBe(1);
      expect(toast.messages[0].content).toBe('toast2');

      toast.dismiss(toast2);
      expect(toast.messages.length).toBe(0);
    });

    it('dismiss all should work', function () {
      toast.create('toast1');
      toast.create('toast2');
      toast.create('toast3');

      toast.dismiss();
      expect(toast.messages.length).toBe(0);
    });
  });

  describe('service configuration:', function() {
    beforeEach(module('toast.provider', function(toastProvider) {
      toastProvider.configure({
        timeout: 3000,
        dismissButton: true,
        maxNumber: 3
      });
    }));

    it('should respect config values', inject(function(toast) {
      expect(toast.settings.timeout).toBe(3000);
      expect(toast.settings.dismissButton).toBe(true);
      expect(toast.settings.maxNumber).toBe(3);
    }));
  });
});
