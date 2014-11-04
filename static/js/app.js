var app = angular.module('ExpressWay', ['ngRoute', 'ngMaterial', 'ngFx']);

app.config(['$routeProvider',
  function($routeProvider){
    $routeProvider.
      when('/', {
        templateUrl: 'templates/marketing.html',
        controller: 'MarketingController'
      }).
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
        redirectTo: '/'
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
  $rootScope.isLoading = false;

  $scope.results = answersModel.answers ? answersModel.answers.question.answers : [];

  $scope.searchContext = function() {
    // $location.path('/search');
    $scope.switchContext('/search');
    $scope.isSearchContext = true;
  }

  $scope.introContext = function() {
    $location.path('/intro');
  }

  $scope.mainContext = function() {
    $scope.isSearchContext = false;
    $scope.switchContext('/');
  } 

  $scope.resultsContext = function() {
    $rootScope.isLoading = true;
    // console.log($scope.question);
    answersModel.askWatson($scope.question).then(function(data) {
      // console.log(data);
      answersModel.setData(data);
      // $location.path('/search/' + $scope.question);
      $scope.results = answersModel.answers.question.answers;
    }, function(error) {
      // console.log('error');
    }).finally(function() {
      $rootScope.isLoading = false;
    });
  }

  function switchContext(context) {
    // console.log(context);
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

app.controller('MarketingController', function($scope, answersModel) {
  $scope.mainCard = {
    actionText: 'Start Asking',
    tagline: 'Immigrate with ease.',
    firstP: 'We are an immigration research tool that assist immigrants around the world.',
    secondP: 'With the power of Watson we answer natural language questions.'
  };

  

  $scope.testimonials = [
    {
      name: 'Don Handerson',
      quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tincidunt tristique sem at ornare. Morbi vel augue eu eros euismod vulputate. Praesent tortor ante, imperdiet quis tellus sed, fermentum viverra elit.'
    },
    {
      name: 'Nancy Policks',
      quote: 'Donec sed porttitor ex, a tincidunt elit. Maecenas tincidunt tincidunt urna, aliquam imperdiet felis tincidunt in. Nunc et arcu eros.'
    },
    {
      name: 'Helen Mario',
      quote: 'Maecenas et orci quis dui eleifend efficitur. Vestibulum augue odio, luctus at consectetur a, luctus in odio. Suspendisse suscipit lacus ut lobortis imperdiet. Nullam elementum elementum mi nec faucibus.'
    }
  ];
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
  // console.log(answersModel.answers);
  if (!answersModel.answers) {
    answersModel.askWatson($routeParams.question).then(function(data) {
      answersModel.setData(data);
      $scope.answers = answersModel.answers.question.answers;
    }, function(error) {
      // console.log('error');
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

app.directive('toolbarAnimate', function(){
    return {
        link: function(scope, element, attributes){
            attributes.$observe('isSearching', function(value){
              if (value === 'true') {
                element.animate({
                  height: '64px'
                }, 300, function() {
                  // Animation complete.
                });
              }
            });
        }
    };
});

app.directive('infoAnimate', function(){
    return {
        link: function(scope, element, attributes){
            attributes.$observe('isSearching', function(value){
              console.log(value);
              if (value === 'true') {
                element.slideUp(300);
              } else {
                element.slideDown(100);
              }
            });
        }
    };
});

