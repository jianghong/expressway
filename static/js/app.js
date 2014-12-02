var app = angular.module('ExpressWay', ['ngRoute', 'ngMaterial', 'firebase']);

app.config(['$routeProvider',
  function($routeProvider){
    $routeProvider.
      when('/', {
        templateUrl: 'templates/marketing.html',
        controller: 'MarketingController'
      }).
      otherwise({
        redirectTo: '/'
      });
    }
  ]
);


app.controller('MainController', function($scope, $location, $rootScope, $window, $mdDialog, $firebase) {
  $scope.panelHidden = false;
  $scope.animatePeekRow = false;

  setTimeout(function($scope){
    document.getElementById('marketing-img').className += ' shrink-height';
    document.getElementById('md-opaque').className += ' shrink-height';
  }, 1000);


  $scope.hideThePanel = function() {
    $scope.panelHidden = true;
  }

  $scope.email = "";

  var ref = new Firebase("https://expressway.firebaseio.com/");
  var sync = $firebase(ref);

  $scope.sendEmail = function() {
    console.log($scope.email);
    if(validateEmail($scope.email)){
      sync.$push({emails: $scope.email});
    }
  }

});


app.directive('homepagePanel', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/homepagepanel.html'
  }
});

function validateEmail(email) { 
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}