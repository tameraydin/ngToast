'use strict';

describe('ngToast:', function() {

  describe('directive:', function() {
    var ngToast,
      compiler,
      rootScope,
      element;

    beforeEach(function () {
      module('ngToast');
    });

    beforeEach(function() {
      inject(function (_ngToast_, _$compile_, _$rootScope_) {
        ngToast = _ngToast_;
        compiler = _$compile_;
        rootScope = _$rootScope_;
      });

      ngToast.messages = [
        {
          id: 1,
          content: 'test1',
          compileContent: true // somehow throws error if not defined...
        },
        {
          id: 2,
          content: 'test2',
          compileContent: true
        }
      ];

      element = compiler('<toast></toast>')(rootScope);
      rootScope.$digest();
    });

    //TODO: button should work although dismissOnClick

    it('should initialize properly', function() {
      expect(element.html().indexOf('ng-toast__list') > -1).toBeTruthy();

      var messages = element.children().children();
      expect(messages.length).toBe(2);
      expect(angular.element(messages['0']).html()).toContain('test');
      expect(angular.element(messages['1']).attr('data-message-id')).toBe('2');
    });
  });
});
