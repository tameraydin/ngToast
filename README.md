## ngToast [![Build Status](http://img.shields.io/travis/tameraydin/ngToast/master.svg?style=flat)](https://travis-ci.org/tameraydin/ngToast)

ngToast is a simple Angular provider for toast notifications.

http://tameraydin.github.io/ngToast/

## Usage

Download ngToast manually or install with bower:

```bower install ngtoast```

Include ngToast resource files along with the built-in [ngAnimate](http://docs.angularjs.org/api/ngAnimate) & [ngSanitize](http://docs.angularjs.org/api/ngSanitize) modules and the [Bootstrap CSS](http://getbootstrap.com/) (only the Alerts component is used as style base, so you don't have to include complete CSS):
```
<link rel="stylesheet" href="bower/bootstrap/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="bower/ngtoast/dist/ngToast.min.css">

<script src="bower/angular-animate/angular-animate.min.js"></script>
<script src="bower/angular-sanitize/angular-sanitize.min.js"></script>
<script src="bower/ngtoast/dist/ngToast.min.js"></script>
```

Include ngToast as a dependency in your application module:

```
var app = angular.module('myApp', ['ngToast']);
```

Place ```ng-toast``` element into your HTML:
```
<body>
  <ng-toast></ng-toast>
  ...
</body>
```

Inject ngToast provider in your controller:

```
app.controller('myCtrl', function(ngToast) {
  ngToast.create('a toast message...');
});
```

## Settings & API

Please find at [project website](http://tameraydin.github.io/ngToast/#api).

## Development

* Install dependencies: `npm install`
* Play on **/src**
* Run `grunt`

## License

MIT [http://tameraydin.mit-license.org/](http://tameraydin.mit-license.org/)


##TODO
- Add unit & e2e tests
- Improve API documentation
