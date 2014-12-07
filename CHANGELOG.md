<a name="1.3.5"></a>
# 1.2.1 (2014-12-06)

## Breaking Changes

`ngToast` has been renamed to `toast` in keeping with Angular best practices.
This refactor includes the module, directive, css, and js files.

**Upgrading:**

1. Rename the source files included in your `<head>`:
  ```html
  <link rel="stylesheet" href="bower/ngtoast/dist/toast.min.css">
  <script src="bower/ngtoast/dist/toast.min.js"></script>
  ```

2. Rename the angular app dependency:
  ```javascript
  angular.module('myApp', ['toast']);
  ```

3. Rename the directive:
  ```html
  <body>
    <toast></toast>
  </body>
  ```

4. Finally, rename any injections:
  ```javascript
  app.controller('myCtrl', function(toast) {
    toast.create('a toast message...');
  });
  ```

See the updated [readme](https://github.com/tameraydin/ngToast).
