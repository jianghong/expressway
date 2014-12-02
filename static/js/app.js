var app = angular.module('ExpressWay', ['ngRoute', 'ngMaterial']);

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


app.controller('MainController', function($scope, $location, $rootScope, $window, $mdDialog) {

  $scope.panelHidden = false;
  $scope.animatePeekRow = false;

  setTimeout(function($scope){
    document.getElementById('marketing-img').className += ' shrink-height';
    document.getElementById('md-opaque').className += ' shrink-height';
  }, 1000);


  $scope.hideThePanel = function() {
    $scope.panelHidden = true;
  }
});


app.directive('homepagePanel', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/homepagepanel.html'
  }
});