var app = angular.module('ExpressWay', ['ngRoute', 'ngMaterial']);

app.config(['$routeProvider',
  function($routeProvider){
    $routeProvider.
      when('/intro', {
        templateUrl: 'templates/intro.html',
        controller: 'IntroController'
      }).
      when('/search', {
        templateUrl: 'templates/search.html',
        controller: 'SearchController'
      }).
      otherwise({
        redirectTo: '/intro'
      });
  }])

app.controller('MainController', function($scope, $location, $rootScope) {
  var MAIN_THEME_CLASS = 'md-blue-theme';
  var hamburgerIconSrc = 'static/img/hamburger-icon.png';
  var backIconSrc = 'static/img/back-icon.png';
  var searchIconWSrc = 'static/img/search-icon.png';
  var searchIconBSrc = 'static/img/search-icon-b.png';

  $scope.isSearchContext = false;
  $scope.leftControlIconSrc = hamburgerIconSrc;
  $scope.leftControlTitle = 'ExpressWay';
  $scope.searchIconSrc = searchIconWSrc;

  $scope.searchContext = function() {

    $location.path('/search');
  }

  $scope.introContext = function() {
    $location.path('/intro');
  } 

  function switchContext(context) {
    console.log(context);
    if (context === '/search') {
      $scope.leftControlTitle = 'Back';
      $scope.isSearchContext = true;
      $scope.leftControlIconSrc = backIconSrc;      
      $scope.searchIconSrc = searchIconBSrc;

    } else {
      $scope.leftControlTitle = 'ExpressWay';
      $scope.isSearchContext = false;
      $scope.leftControlIconSrc = hamburgerIconSrc
      $scope.searchIconSrc = searchIconWSrc;
    }
  }

  $rootScope.switchContext = switchContext;
})

app.controller('IntroController', function($scope) {

});

app.controller('SearchController', function($scope) {
});

app.run( function($rootScope, $location) {
   $rootScope.$watch(function() { 
      return $location.path(); 
    },
    function(a){  
      $rootScope.switchContext(a);
    });
});