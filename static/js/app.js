angular.module('ExpressWay', ['ngMaterial'])

.controller('MainController', function($scope) {
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
    switchContext('search');
  }

  $scope.mainContext = function() {
    switchContext('main');
  } 

  function switchContext(context) {
    console.log(context);
    if (context === 'search') {
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
})