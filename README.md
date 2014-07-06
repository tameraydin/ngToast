## ngToast

ngToast is a simple Angular provider for toast notifications. 

http://tameraydin.github.io/ngToast/

## Usage

Download ngToast manually or install with bower:

```bower install ngtoast```

Include resource files in your app:
```
<script src="lib/ngtoast/dist/ngToast.min.js"></script>
<link rel="stylesheet" href="lib/ngtoast/dist/ngToast.css">
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
  content: 'Another message as <a href="#" class="">HTML</a>',
  horizontalPosition: 'left'
});

ngToast.dismiss(msg);

// to clear all toasts:
ngToast.dismiss();
```

##TODO
- Add unit & e2e tests
- Improve API documentation
