var app = angular.module('ExpressWay', ['ngRoute', 'ngMaterial', 'ngFx']);

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
      when('/search/:question', {
        templateUrl: 'templates/results.html',
        controller: 'ResultsController'
      }).
      otherwise({
        redirectTo: '/intro'
      });
  }])

app.controller('MainController', function($scope, $location, $rootScope, answersModel) {
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

  $scope.resultsContext = function() {
    answersModel.askWatson($scope.question).then(function(data) {
      answersModel.setData(data);
      $location.path('/search/' + $scope.question);
    }, function(error) {
      console.log('error');
    });
  }

  function switchContext(context) {
    console.log(context);
    if (context.indexOf('/search') >= 0) {
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
 });

app.controller('IntroController', function($scope) {

});

app.controller('SearchController', function($scope) {
});

app.controller('SuggestionsController', function($scope) {
  $scope.suggestedQuestions = [
    {
      question: 'What is life?'
    },
    {
      question: 'What is your mom\'s number?'
    }
  ];
});

app.controller('ResultsController', function($scope, $routeParams, answersModel) {
  console.log(answersModel.answers);
  if (!answersModel.answers) {
    answersModel.askWatson($routeParams.question).then(function(data) {
      answersModel.setData(data);
      $scope.answers = answersModel.answers.question.answers;
    }, function(error) {
      console.log('error');
    });
  } else {
    $scope.answers = answersModel.answers.question.answers;
  }
});

app.run( function($rootScope, $location) {
   $rootScope.$watch(function() { 
      return $location.path(); 
    },
    function(a){  
      $rootScope.switchContext(a);
    });
});

app.service('answersModel', function($http, $q) {
  var watsonRoute = 'http://127.0.0.1:8000/ask';

  this.askWatson = function(question) {
    return $q(function(resolve, reject) {
      $http.get(watsonRoute, {params: {q: question}}).
      success(function(data, status, headers, config) {
        resolve(data);
      }).
      error(function(error, status, headers, config) {
        reject(error);
      });
    });
  }

  this.setData = function(data) {
    this.answers = data;
  }
});