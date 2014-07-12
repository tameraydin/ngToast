## ngToast

ngToast is a simple Angular provider for toast notifications. 

http://tameraydin.github.io/ngToast/

## Usage

Download ngToast manually or install with bower:

```bower install ngtoast```

Include ngToast resource files along with the [Bootstrap CSS](http://getbootstrap.com/) (only the Alerts component is used as style base, so you don't have to include complete CSS):
```
<link rel="stylesheet" href="lib/bootstrap/dist/css/bootstrap.css">
<link rel="stylesheet" href="lib/ngtoast/dist/ngToast.css">

<script src="lib/ngtoast/dist/ngToast.min.js"></script>
```

Include ngToast as a dependency in your app module:

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
var MyCtrl = function($scope, ngToast) {};
```

## API

```
// to create a toast:
ngToast.create({
  content: 'A toast message...'
});

// to clear specific toast:
var msg = ngToast.create({
  content: 'Another message as <a href="#" class="">HTML</a>'
});

ngToast.dismiss(msg);

// to clear all toasts:
ngToast.dismiss();
```

##TODO
- Add unit & e2e tests
- Improve API documentation
